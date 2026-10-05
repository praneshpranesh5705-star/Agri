import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MODEL = "meta-llama/llama-4-scout-17b-16e-instruct";

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
        {
          reply:
            "AgriAssist is ready, but GROQ_API_KEY is not configured. Add GROQ_API_KEY to your Vercel Environment Variables and redeploy."
        },
        { status: 503 }
      );
    }

    const systemPrompt = `You are AgriAssist, an expert agriculture AI assistant for Indian farmers and agriculture students.
Give practical, clear and accurate answers about crops, vegetables, fruits, soil, irrigation, fertilizers, pests, diseases, seeds, machinery, sensors, IoT, greenhouse systems, farm planning and agricultural technology.
You can also solve mathematics, science and engineering questions when the user asks.
For an uploaded agricultural image, carefully identify what is visibly present, explain likely symptoms or possibilities, and give safe next steps. Never claim an image diagnosis is 100% certain.
For pesticide or chemical recommendations, tell the user to follow the product label and consult a qualified local agricultural officer.
Use simple language and structured steps when helpful. If the question is unrelated to agriculture, still answer useful general questions when possible.`;

    const userText = typeof message === "string" && message.trim()
      ? message.trim()
      : "Please analyze the uploaded image and explain what you observe.";

    const content: Array<
      | { type: "text"; text: string }
      | { type: "image_url"; image_url: { url: string } }
    > = [
      { type: "text", text: userText }
    ];

    if (typeof image === "string" && image && mimeType) {
      const base64 = image.replace(/^data:[^;]+;base64,/, "");

      if (base64.length > 12_000_000) {
        return NextResponse.json(
          { reply: "The image is too large. Please upload a smaller image." },
          { status: 413 }
        );
      }

      content.push({
        type: "image_url",
        image_url: {
          url: `data:${mimeType};base64,${base64}`
        }
      });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30_000);

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`
        },
        body: JSON.stringify({
          model: MODEL,
          temperature: 0.2,
          max_tokens: 1200,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content }
          ]
        }),
        signal: controller.signal
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        console.error("Groq API error:", data);
        return NextResponse.json(
          {
            reply:
              "Groq could not process the request. Please check GROQ_API_KEY in Vercel and try again."
          },
          { status: 502 }
        );
      }

      const reply = data?.choices?.[0]?.message?.content;

      if (typeof reply !== "string" || !reply.trim()) {
        return NextResponse.json(
          { reply: "I could not generate an answer. Please try again." },
          { status: 502 }
        );
      }

      return NextResponse.json({ reply: reply.trim() });
    } finally {
      clearTimeout(timeout);
    }
  } catch (error) {
    console.error("AgriAssist error:", error);

    if ((error as Error).name === "AbortError") {
      return NextResponse.json(
        { error: "AI request timed out. Please try again." },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { error: "AI service temporarily unavailable." },
      { status: 500 }
    );
  }
}
