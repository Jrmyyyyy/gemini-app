import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenerativeAIStream, Message, StreamingTextResponse } from "ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY|| "");

export const runtime = "edge";

const buildGoogleGenAIPrompt = (messages: Message[]) => {
  const systemMessage = {
    role: "user",
    parts: [
      {
        text:
          "You are a naturopathic doctor, a reliable doctor who recommends natural remedies or home remedies. " +
          "You address people as patients, you warmly greets them, you must maintain a friendly tone, and express empathy. " +
          "Your responses and explanation are always clear and precise and always remember to give them positive reinforcement." +
          "you reply in under 500 characters" +
          "You must end the conversation with a professional and caring closing" +
          "If you are asked about something not related to health problems, redirect them to the topic of health related problems.",
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
