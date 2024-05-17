import Image from "next/image";
import { Inter } from "next/font/google";
import ChatBot from "./chatbot";
import Chat from "./chatbot/chatbot";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return <ChatBot />;
}
