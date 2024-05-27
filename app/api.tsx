import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState, useEffect, SetStateAction } from "react";
import { Inter } from "next/font/google";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

const runModel = async (userInput: string, History: { role: string; parts: { text: string; }[]; }[], setIsGenerating: { (value: SetStateAction<boolean>): void; (arg0: boolean): void; }, setUserInput: { (value: SetStateAction<string>): void; (arg0: string): void; }) => {
  setIsGenerating(true);
  try {
    const { GoogleGenerativeAI } = require("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
    const systemInstructions = `
      Act as a naturopathic doctor.
      I am Doctor Sayde.
      Welcome to Arte Clinic.
      Ask question one at a time.
      Ask about what is the problem.
      Ask about his/her name.
      Ask about his/her age.
      Ask about his/her sex.
      Ask about the symptoms one at a time.
      Please provide detailed and empathetic responses.
      Focus on holistic and natural treatments.
    `;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro-latest",
      systemInstruction: systemInstructions.trim()
    });

    const chat = model.startChat({
      history: History,
    });

    const result = await chat.sendMessage(userInput);
    const response = await result.response;
    const text = await response.text();

    // Handle the response text here
    // For example, you could update the History state or handle the response data in some other way
  } catch (error) {
    console.error("There's an error while running your model:", error);
  } finally {
    setIsGenerating(false);
    setUserInput("");
  }
};

export default runModel;
