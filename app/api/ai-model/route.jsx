import { QUESTIONS_PROMPT } from "@/services/Constant";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req) {
  try {
    const { jobPosition, jobDescription, duration, type } = await req.json();

    if (!jobPosition || !jobDescription) {
      return NextResponse.json({
        content: "Missing required fields."
      });
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json({
        content: "AI service unavailable (missing API key)."
      });
    }

    const FINAL_PROMPT = QUESTIONS_PROMPT
      .replace('{{jobTitle}}', jobPosition)
      .replace('{{jobDescription}}', jobDescription)
      .replace('{{duration}}', duration || "N/A")
      .replace('{{type}}', type || "General");

    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
      defaultHeaders: {
        "X-Title": "AI Recruiter Resume Demo",
      },
    });

    const completion = await openai.chat.completions.create({
      model: "google/gemma-3n-e2b-it:free",
      messages: [{ role: "user", content: FINAL_PROMPT }],
    });

    const content =
      completion?.choices?.[0]?.message?.content ||
      "No questions generated.";

    return NextResponse.json({ content });

  } catch (e) {
    console.error("AI Model API Error:", e);

    return NextResponse.json({
      content: "AI question generation is temporarily unavailable."
    });
  }
}
