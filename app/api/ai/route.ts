import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Groq production models: GPT-OSS 120B for stronger reasoning/text,
// Qwen 3.8 27B for image understanding.
const TEXT_MODEL = "openai/gpt-oss-120b";
const VISION_MODEL = "qwen/qwen3.8-27b";

const SYSTEM_PROMPT = `You are AgriAssist, a fast expert agriculture AI assistant for Indian farmers and agriculture students.
Give concise, practical and accurate answers about crops, soil, irrigation, fertilizers, pests, diseases, seeds, machinery, sensors, IoT, greenhouse systems and farm planning.
You can also solve mathematics, science and engineering questions.
For images, describe visible evidence first, give likely possibilities, and safe next steps. Never claim an image diagnosis is certain.
For pesticides or chemicals, tell the user to follow the product label and consult a qualified local agricultural officer.
Prefer short, useful answers with bullets when appropriate.`;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const { message, image, mimeType } = body as {
      message?: string;
      image?: string;
      mimeType?: string;
    };
    const key = process.env.GROQ_API_KEY;

    if (!key) {
      return NextResponse.json(
        { reply: "Add GROQ_API_KEY to Vercel Environment Variables and redeploy." },
        { status: 503 }
      );
    }

    const userText = typeof message === "string" && message.trim()
      ? message.trim()
      : "Analyze the uploaded image and explain what you observe.";

    const hasImage = typeof image === "string" && image.length > 0 && !!mimeType;
    const model = hasImage ? VISION_MODEL : TEXT_MODEL;

    const content: Array<
      | { type: "text"; text: string }
      | { type: "image_url"; image_url: { url: string } }
    > = [{ type: "text", text: userText }];

    if (hasImage) {
      const base64 = image!.replace(/^data:[^;]+;base64,/, "");
      if (base64.length > 10_000_000) {
        return NextResponse.json(
          { reply: "Image is too large. Please upload a smaller image." },
          { status: 413 }
        );
      }
      content.push({
        type: "image_url",
        image_url: { url: `data:${mimeType};base64,${base64}` }
      });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20_000);

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`
        },
        body: JSON.stringify({
          model,
          temperature: hasImage ? 0.5 : 0.2,
          max_tokens: hasImage ? 700 : 700,
          ...(hasImage ? { reasoning_effort: "none" } : { reasoning_effort: "medium" }),
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: hasImage ? content : userText }
          ]
        }),
        signal: controller.signal
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        console.error("Groq API error:", data);
        return NextResponse.json(
          { reply: "Groq could not process this request. Check GROQ_API_KEY and try again." },
          { status: 502 }
        );
      }

      const reply = data?.choices?.[0]?.message?.content;
      if (typeof reply !== "string" || !reply.trim()) {
        return NextResponse.json({ reply: "I could not generate an answer. Please try again." }, { status: 502 });
      }

      return NextResponse.json({ reply: reply.trim() });
    } finally {
      clearTimeout(timeout);
    }
  } catch (error) {
    console.error("AgriAssist error:", error);
    if ((error as Error).name === "AbortError") {
      return NextResponse.json({ error: "AI request timed out. Please try again." }, { status: 504 });
    }
    return NextResponse.json({ error: "AI service temporarily unavailable." }, { status: 500 });
  }
}
