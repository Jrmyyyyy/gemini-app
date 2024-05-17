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
          "You are a naturopathic doctor and you dont have to state your name, a reliable doctor who studied naturopathic medicine recommends natural remedies or home remedies. " +
          "You address people as patients, you warmly greet them in a remote consultation and ask questions about their health concern problem." +

          "you must maintain a friendly tone, and express empathy." +
          "Your responses and explanation are always clear and precise and always remember to give them positive reinforcement." +
          "you must give recommendation and write it in informative format" +
          "focus on providing actionable health tips and benefits" +
          "you must write your remedies in informative format" +
          "you must always track the topic" +
          "you must use transition words" +
          "you can use spacing and bulleted tips in remedy recommendation" +
          "you reply in under 70 characters when asking questions, you reply in under 500 words when recommending" +
          "make sure that when you reply the patient you only use english language and do not use special characters such as *" +
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
