import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAnthropicClient, CLAUDE_MODEL } from "@/lib/ai/anthropic";
import { buildCompatibilityChatSystemPrompt, extractVerdict } from "@/lib/ai/prompts";

export async function POST(request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { message, conversationId } = await request.json();
  if (!message || typeof message !== "string") {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  let activeConversationId = conversationId;
  if (!activeConversationId) {
    const { data: conversation, error: conversationError } = await supabase
      .from("conversations")
      .insert({ user_id: user.id })
      .select()
      .single();

    if (conversationError) {
      return NextResponse.json({ error: conversationError.message }, { status: 500 });
    }
    activeConversationId = conversation.id;
  }

  const [{ data: devices, error: devicesError }, { data: priorMessages, error: priorError }] =
    await Promise.all([
      supabase.from("devices").select("*").eq("user_id", user.id),
      supabase
        .from("messages")
        .select("role, content")
        .eq("conversation_id", activeConversationId)
        .order("created_at", { ascending: true }),
    ]);

  if (devicesError) {
    return NextResponse.json({ error: devicesError.message }, { status: 500 });
  }
  if (priorError) {
    return NextResponse.json({ error: priorError.message }, { status: 500 });
  }

  const { error: userMessageError } = await supabase.from("messages").insert({
    conversation_id: activeConversationId,
    role: "user",
    content: message,
  });
  if (userMessageError) {
    return NextResponse.json({ error: userMessageError.message }, { status: 500 });
  }

  const anthropic = getAnthropicClient();
  const response = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 2048,
    system: buildCompatibilityChatSystemPrompt(devices ?? []),
    tools: [{ type: "web_search_20260209", name: "web_search", max_uses: 5 }],
    messages: [
      ...priorMessages.map((m) => ({ role: m.role, content: m.content })),
      { role: "user", content: message },
    ],
  });

  const textBlocks = response.content.filter((block) => block.type === "text");
  const rawText = textBlocks.map((block) => block.text).join("\n").trim();
  const { content, verdict } = extractVerdict(rawText);

  const { error: assistantMessageError } = await supabase.from("messages").insert({
    conversation_id: activeConversationId,
    role: "assistant",
    content,
    verdict,
  });
  if (assistantMessageError) {
    return NextResponse.json({ error: assistantMessageError.message }, { status: 500 });
  }

  return NextResponse.json({ conversationId: activeConversationId, content, verdict });
}
