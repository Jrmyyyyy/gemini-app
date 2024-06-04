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
  const [showChat, setShowChat] = useState(false);

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

  const handleStartChat = () => {
    setShowChat(true);
  };

  return (
    <div className="flex flex-col items-center justify-between h-screen p-4 bg-gray-100">
      <div className="flex flex-col items-center w-full h-full overflow-hidden bg-white shadow-md rounded-lg">
        <div ref={chatContainerRef} className="flex-grow w-full overflow-y-auto p-6">
          {!showChat && (
            <div className="flex flex-col items-start w-full h-full justify-center">
              <h1 className="text-8xl font-bold text-gray-800 ml-6">THE ARTE <br /> CLINIC</h1>
              <h2 className="text-2xl font-medium text-gray-600 ml-6 mt-4">Take Control of Your Health</h2>
              <p className="text-base text-gray-800 ml-6 mt-4">
                This chatbot is here to answer your questions  <br /> and provide helpful resources.
              </p>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-8 ml-6"
                onClick={handleStartChat}
              >
                Start Chat
              </button>
            </div>
          )}
          {/* The new image div */}
          <div className="absolute right-8 bottom-8 flex items-center">
            <img src="/kani.png" alt="Cartoon Nurse" className="w-100 h-100 rounded-2xl" />
          </div>

          {showChat && (
            <>
              {history.length > 0 && (
                <div className="w-full mb-4 space-y-4 relative"> {/* Added relative to position the icon */}
                  {history.map((message, index) => (
                    <div
                      key={index}
                      className={`flex w-full mb-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {/* User Message with Icon */}
                      {message.role === 'user' && (
                        <div className="relative"> {/* Added relative to position the icon */}
                          <div
                            className={`p-4 rounded-lg  bg-blue-500 text-white text-right`}
                            style={{ maxWidth: '70%' }}
                          >
                            <div>
                              <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                                {message.parts[0].text}
                              </ReactMarkdown>
                            </div>
                          </div>
                          <div className="h-6 w-6 absolute top-0 right-0 -mt-3 -mr-3 text-white" />
                        </div>
                      )}

                      {/* Model Message */}
                      {message.role !== 'user' && (
                        <div className="flex"> {/* Use flexbox to align icon and message */}
                          <div className="h-6 w-6 mt-4 ml-2 text-gray-500" /> {/* Icon on the left */}
                          <div
                            className={`p-4 rounded-lg bg-gray-100`}
                            style={{ maxWidth: '70%' }}
                          >
                            <div>
                              <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                                {message.parts[0].text}
                              </ReactMarkdown>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {showChat && (
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
        )}
      </div>
    </div>
  );
}