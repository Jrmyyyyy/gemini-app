'use client';
import { useState } from "react";
import { Inter } from "next/font/google";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import runModel from "../app/api";

export default function Home() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [History] = useState<
    { role: string; parts: 
    { text: string }[] }[]
  >([]);

  const handleRun = () => {
    runModel(userInput, History, setIsGenerating, setUserInput);
  };

  return (
    <div>
      <div style={{ position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', width: '90%', maxWidth: '600px' }}>
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Enter your message"
          style={{ width: '100%', height: '50px', padding: '10px', borderRadius: '8px', resize: 'none' }}
        />
        <button onClick={handleRun} disabled={isGenerating} style={{ marginLeft: '10px', padding: '8px 16px', borderRadius: '8px', backgroundColor: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}>
          {isGenerating ? "..." : "Submit"}
        </button>
      </div>

      <div style={{ padding: '20px', marginTop: '80px' }}>
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
    </div>
  );
}
