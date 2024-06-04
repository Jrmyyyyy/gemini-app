"use client";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { FaPaperPlane } from "react-icons/fa";
import runModel from "../app/api";
import React from "react";

export default function Home() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [history, setHistory] = useState<
    {
      role: string;
      parts: { text: string }[];
    }[]
  >([]);

  // Ref to the chat container
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleRun = () => {
    runModel(userInput, history, setIsGenerating, setUserInput);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleRun();
    }
  };

  // Function to scroll to the bottom
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  // Use useEffect to scroll after new messages and user input
  useEffect(() => {
    scrollToBottom();
  }, [history, userInput]);

  return (

    <div className="flex flex-col items-center justify-between h-screen p-4 bg-gray-100">
      <div className="flex flex-col items-center w-full h-full overflow-hidden bg-white shadow-md rounded-lg">
        <div
          ref={chatContainerRef}
          className="flex-grow w-full overflow-y-auto p-6"
        >
          {history.length > 0 && (
            <div className="w-full mb-4 space-y-4">
              {history.map((message, index) => (
                <div key={index} className="p-4 bg-gray-100 rounded-lg">
                  <h3 className="font-bold text-gray-800">{message.role}</h3>
                  <div className="mt-2 text-gray-600">
                    <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                      {message.parts[0].text}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center w-full p-4 bg-white shadow-md rounded-t-lg">
          <textarea
            className="flex-grow p-2 border border-gray-300 rounded-lg h-12 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="How can I help you?"
          />
          <button
            className="ml-4 p-3 bg-blue-500 text-white rounded-full focus:outline-none disabled:opacity-50"
            onClick={handleRun}
            disabled={isGenerating}
          >
            {isGenerating ? "..." : <FaPaperPlane />}
          </button>
        </div>
      </div>
    </div>
  );
}