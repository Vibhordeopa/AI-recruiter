import { NextResponse } from "next/server";
import OpenAI from "openai";

const FEEDBACK_PROMPT = `
You are an AI Interview Evaluator.
Analyze the following conversation and give structured JSON feedback.

Conversation:
{{conversation}}

Return JSON with:
{
  "feedback": {
    "rating": {
      "technicalSkills": <number>,
      "communication": <number>,
      "problemSolving": <number>,
      "experience": <number>
    },
    "summary": "<3 line summary>",
    "recommendation": "<Yes/No>",
    "recommendationMsg": "<short message>"
  }
}
`;

export async function POST(req) {
  try {
    const body = await req.json();
    const conversation = body.conversation || [];

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json({
        content: "AI service unavailable (missing API key)."
      });
    }

    const FINAL_PROMPT = FEEDBACK_PROMPT.replace(
      "{{conversation}}",
      JSON.stringify(conversation, null, 2)
    );

    const client = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    const response = await client.responses.create({
      model: "openai/gpt-4o-mini",
      input: FINAL_PROMPT,
    });

    const result =
      response.output_text ||
      response.output?.[0]?.content?.[0]?.text ||
      "No feedback generated.";

    return NextResponse.json({ content: result });
  } catch (e) {
    console.error("AI Feedback Error:", e);

    return NextResponse.json({
      content: "AI feedback is temporarily unavailable. Please try again later."
    });
  }
}

