import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAnthropicClient, CLAUDE_MODEL } from "@/lib/ai/anthropic";
import { DEVICE_IDENTIFY_SYSTEM_PROMPT } from "@/lib/ai/prompts";

const PHOTO_BUCKET = "device-photos";

export async function POST(request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { photoPath } = await request.json();
  if (!photoPath || !photoPath.startsWith(`${user.id}/`)) {
    return NextResponse.json({ error: "Invalid photo path" }, { status: 400 });
  }

  const { data: photoBlob, error: downloadError } = await supabase.storage
    .from(PHOTO_BUCKET)
    .download(photoPath);

  if (downloadError) {
    return NextResponse.json({ error: "Could not read uploaded photo" }, { status: 400 });
  }

  const mediaType = photoBlob.type || "image/jpeg";
  const base64Data = Buffer.from(await photoBlob.arrayBuffer()).toString("base64");

  const anthropic = getAnthropicClient();
  const response = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 1024,
    system: DEVICE_IDENTIFY_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: { type: "base64", media_type: mediaType, data: base64Data },
          },
          { type: "text", text: "Identify this device." },
        ],
      },
    ],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock) {
    return NextResponse.json({ error: "Identification failed" }, { status: 502 });
  }

  let identified;
  try {
    identified = JSON.parse(textBlock.text);
  } catch {
    return NextResponse.json({ error: "Could not parse identification" }, { status: 502 });
  }

  const { data: device, error: insertError } = await supabase
    .from("devices")
    .insert({
      user_id: user.id,
      name: identified.name,
      category: identified.category ?? null,
      brand: identified.brand ?? null,
      model: identified.model ?? null,
      specs: identified.specs ?? null,
      confidence: identified.confidence ?? null,
      photo_url: photoPath,
    })
    .select()
    .single();

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ device });
}
