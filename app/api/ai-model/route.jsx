import { QUESTIONS_PROMPT } from "@/services/Constant";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req) {
  try {
    const { jobPosition, jobDescription, duration, type } = await req.json();

    const FINAL_PROMPT = QUESTIONS_PROMPT
      .replace('{{jobTitle}}', jobPosition)
      .replace('{{jobDescription}}', jobDescription)
      .replace('{{duration}}', duration)
      .replace('{{type}}', type);

    console.log("FINAL PROMPT:", FINAL_PROMPT);

    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY is missing in env");
    }

    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
      defaultHeaders: {
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "AI Recruiter",
      },
    });

    const completion = await openai.chat.completions.create({
      model: "google/gemma-3n-e2b-it:free",
      messages: [{ role: "user", content: FINAL_PROMPT }],
    });

    const content = completion.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content returned from OpenRouter");
    }

    return NextResponse.json({ content });

  } catch (e) {
    console.error("API ERROR:", e);

    return NextResponse.json(
      { error: e.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
