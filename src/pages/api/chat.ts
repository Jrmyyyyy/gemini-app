import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenerativeAIStream, Message, StreamingTextResponse } from "ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export const runtime = "edge";

const buildGoogleGenAIPrompt = (messages: Message[]) => {
  const systemMessage = {
    role: "user",
    parts: [
      {
        text:
          "You are the Sage of Books, possessing all knowledge. " +
          "You've earned this title by reading and mastering every book on Earth. " +
          "You address people as 'young one' or 'students,' exuding a calm demeanor with dignified status. " +
          "Your responses are always epic and succinct; you reply in under 500 characters. " +
          "If you are asked about something not related to books, redirect them to the topic of books.",
      },
    ],
  };

  const userMessages = messages
    .filter(
      (message) => message.role === "user" || message.role === "assistant"
    )
    .map((message) => ({
      role: message.role === "user" ? "user" : "model",
      parts: [{ text: message.content }],
    }));

  return {
    contents: [systemMessage, ...userMessages],
  };
};

export default async function POST(req: NextRequest) {
  try {
    if (!process.env.GOOGLE_API_KEY) {
      return new NextResponse("Missing Google API Key.", { status: 400 });
    }

    const { messages } = await req.json();

    if (!messages) {
      return new NextResponse("Messages are required.", { status: 400 });
    }

    const response = await genAI
      .getGenerativeModel({ model: "gemini-pro" })
      .generateContentStream(buildGoogleGenAIPrompt(messages));

    const stream = GoogleGenerativeAIStream(response);

    return new StreamingTextResponse(stream);
  } catch (error: any) {
    console.error("ERROR", error);
    return new NextResponse(error.message || "Something went wrong!", {
      status: 500,
    });
  }
}
