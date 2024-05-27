"use client"
import { useState } from "react";
import { Inter } from "next/font/google";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import runModel from "./api";

export default function Home() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [History] = useState<
    {
      role: string; parts:
      { text: string }[]
    }[]
  >([]);

  const handleRun = () => {
    runModel(userInput, History, setIsGenerating, setUserInput);
  };

  return (
    <div className="flex items-center flex-col gap-y-5 border mx-[20%] lg:border-yellow-200 md:border-red-200">

      <div className="border">
        j
        {History.map((message, index) => (
          <div key={index}>
            <h3 style={{ color: 'black' }}>{message.role}</h3>
            <p style={{ color: 'gray', padding: '10px' }}>
              <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                {message.parts[0].text}
              </ReactMarkdown>
            </p>
          </div>
        ))}
      </div>

      <div className="flex">
        <textarea
          className=""
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Enter your message"
        />
        <button className="bg-[#000] text-white p-5 rounded-full w-[70%] py-3" onClick={handleRun} disabled={isGenerating}>
          {isGenerating ? "..." : "Submit"}
        </button>
      </div>


    </div>
  );
}
