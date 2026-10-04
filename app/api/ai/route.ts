import { NextResponse } from "next/server";

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

    const key = process.env.GEMINI_API_KEY;

    if (!key) {
      return NextResponse.json({
        reply:
          "AgriAssist is ready, but GEMINI_API_KEY is not configured in Vercel. Add it in Vercel → Settings → Environment Variables and redeploy."
      });
    }

    const prompt = `You are AgriAssist, an expert agriculture assistant for Indian farmers.
Answer clearly and practically about crops, vegetables, fruits, soil, irrigation, fertilizers, pest management, seeds, tractors, pumps, farm machinery, agricultural tools, sensors/IoT, greenhouse equipment, market questions and farm planning.
If an uploaded crop/plant image is provided, carefully describe visible symptoms first, give likely possibilities rather than claiming certainty, and recommend safe next steps. Do not pretend an image diagnosis is 100% certain.
For pesticide dosage, always tell the user to follow the product label and local agricultural officer.
If the question is unrelated to agriculture, say you specialize in agriculture.
User question: ${typeof message === "string" && message.trim() ? message : "Please analyze the uploaded agricultural image."}`;

    const parts: Array<{
      text?: string;
      inlineData?: { mimeType: string; data: string };
    }> = [{ text: prompt }];

    if (typeof image === "string" && image && mimeType) {
      const base64 = image.replace(/^data:[^;]+;base64,/, "");

      if (base64.length > 12_000_000) {
        return NextResponse.json(
          { reply: "The image is too large. Please upload a smaller image." },
          { status: 413 }
        );
      }

      parts.push({ inlineData: { mimeType, data: base64 } });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25_000);

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
        encodeURIComponent(key),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts }] }),
        signal: controller.signal
      }
    );

    clearTimeout(timeout);

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API error:", data);
      return NextResponse.json(
        {
          reply:
            "Gemini could not process the request. Please check the Vercel API key and try again."
        },
        { status: 502 }
      );
    }

    const reply =
      data?.candidates?.[0]?.content?.parts
        ?.map((part: any) => part?.text || "")
        .filter(Boolean)
        .join("\n") || "I could not generate an answer.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("AgriAssist error:", error);

    if ((error as Error).name === "AbortError") {
      return NextResponse.json(
        { error: "AI request timed out. Please try again." },
        { status: 504 }
      );
    }

    return NextResponse.json({ error: "AI service temporarily unavailable." }, { status: 500 });
  }
}
