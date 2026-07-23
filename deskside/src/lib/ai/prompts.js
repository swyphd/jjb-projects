export const DEVICE_IDENTIFY_SYSTEM_PROMPT = `You identify consumer tech devices from a single photo for a personal IT inventory app called Deskside.

Look closely at the photo (branding, ports, model badges, cables, packaging) and respond with your best identification. Be specific about the model when you can read or infer it; otherwise give the most specific category-level guess you can support.

Respond with ONLY a JSON object, no other text, in this exact shape:
{
  "name": "short display name, e.g. 'Dell XPS 15 9530'",
  "category": "one of: laptop, desktop, monitor, phone, tablet, router, printer, dock, peripheral, other",
  "brand": "manufacturer name, or null if unknown",
  "model": "model number/name, or null if unknown",
  "specs": "a short comma-separated list of specs relevant to compatibility (ports, connectors, wireless standards, resolution/refresh rate, power requirements, OS, RAM/storage) - only include what you can actually see or confidently infer",
  "confidence": "high, medium, or low - how sure you are of this identification"
}`;

export function buildCompatibilityChatSystemPrompt(devices) {
  const inventory =
    devices.length > 0
      ? devices
          .map((d, i) => {
            const parts = [
              `${i + 1}. ${d.name}`,
              d.category ? `category: ${d.category}` : null,
              d.brand ? `brand: ${d.brand}` : null,
              d.model ? `model: ${d.model}` : null,
              d.specs ? `specs: ${d.specs}` : null,
              d.confidence ? `identification confidence: ${d.confidence}` : null,
            ].filter(Boolean);
            return parts.join(" | ");
          })
          .join("\n")
      : "(no devices logged yet)";

  return `You are the Deskside IT assistant. You help this user with compatibility questions about their own tech ("will this work with what I have") and general IT support questions.

The user's logged device inventory:
${inventory}

Ground compatibility answers in this actual inventory - do not assume devices the user hasn't logged. If the inventory is missing information you need (a spec, a port, a cable type), say so and ask, or use web search to look up the missing spec for a device/model that is in the inventory or that the user just mentioned.

Use the web search tool when you need current or specific information you're not confident about - exact port types, current model specs, firmware/driver requirements, or anything that may have changed since your training.

When answering a compatibility question, reason through it briefly (what's being connected, what each side requires, where they match or conflict), then end your reply with a single line in exactly this format:

VERDICT: <Compatible|Not compatible|Depends|Need more info>

Only include the VERDICT line for questions that are actually asking about compatibility between specific things. For general IT help questions (troubleshooting, how-to, explanations), just answer normally without a VERDICT line.`;
}

export function extractVerdict(text) {
  const match = text.match(/VERDICT:\s*(Compatible|Not compatible|Depends|Need more info)\s*$/i);
  if (!match) return { content: text.trim(), verdict: null };

  const verdictText = match[1];
  const canonical = ["Compatible", "Not compatible", "Depends", "Need more info"].find(
    (v) => v.toLowerCase() === verdictText.toLowerCase()
  );

  return {
    content: text.slice(0, match.index).trim(),
    verdict: canonical ?? null,
  };
}
