import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Sun, Moon, ChevronDown, Mic, MicOff } from "lucide-react";
import { useTheme } from "next-themes";

const topics = ["Sorting Algorithms", "Binary Search Trees", "Graph Traversal", "Dynamic Programming"];
const codeExample = `function quickSort(arr) {
  if (arr.length <= 1) return arr;
  const pivot = arr[Math.floor(arr.length / 2)];
  const left = arr.filter(x => x < pivot);
  const middle = arr.filter(x => x === pivot);
  const right = arr.filter(x => x > pivot);
  return [...quickSort(left), ...middle, ...quickSort(right)];
}`;

const fetchAIResponse = async (message, topic = "DSA") => {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay
  return `You asked about ${topic}: "${message}". Let's explore this topic step by step.`;
};

export default function BestChatbotUI() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [currentTopic, setCurrentTopic] = useState(null);
  const [aiResponse, setAiResponse] = useState("");
  const [codeInput, setCodeInput] = useState(codeExample);
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef(null);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMessages([
      { role: "assistant", content: "Welcome to the Socratic Ai Teacher! What would you like to explore?" },
    ]);
  }, []);

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = { role: "user", content: input };
      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsTyping(true);

      try {
        const aiResponse = await fetchAIResponse(input, currentTopic);
        setMessages((prev) => [...prev, { role: "assistant", content: aiResponse }]);
      } catch (error) {
        setMessages((prev) => [...prev, { role: "assistant", content: "Error fetching AI response." }]);
      } finally {
        setIsTyping(false);
      }
    }
  };

  const startTopicChat = (topic) => {
    setCurrentTopic(topic);
    setMessages([
      { role: "assistant", content: `Let's dive into ${topic}. What specific aspect would you like to explore?` },
    ]);
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-violet-500 to-indigo-500 dark:from-violet-900 dark:to-indigo-900">
      <header className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-md">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Socratic Teach Ai</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              onClick={() => {}}
              className="flex items-center text-white bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30"
            >
              {currentTopic || "Select Topic"} <ChevronDown className="ml-2 h-5 w-5" />
            </button>
            <div className="absolute mt-2 w-40 bg-white rounded-md shadow-lg">
              {topics.map((topic) => (
                <button
                  key={topic}
                  onClick={() => startTopicChat(topic)}
                  className="block w-full text-left px-4 py-2 text-black hover:bg-gray-200"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-white hover:text-indigo-200"
          >
            {theme === "dark" ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
          </button>
        </div>
      </header>

      <div className="flex flex-grow overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden sm:flex flex-col w-1/4 bg-white/10 p-4">
          <h3 className="text-white text-xl mb-4">Sections</h3>
          <button className="text-white mb-4 bg-white/20 py-2 px-4 rounded-lg hover:bg-white/30">Chat</button>
          <button className="text-white mb-4 bg-white/20 py-2 px-4 rounded-lg hover:bg-white/30">Code</button>
          <button className="text-white mb-4 bg-white/20 py-2 px-4 rounded-lg hover:bg-white/30">Progress</button>
        </aside>

        {/* Main Content */}
        <main className="flex-grow flex flex-col p-4">
          {/* Chat Area */}
          <div className="flex-grow overflow-y-auto p-4" ref={scrollAreaRef}>
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} mb-4`}
                >
                  <div className={`flex items-start max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                    <div
                      className={`p-4 rounded-lg shadow-lg ${
                        message.role === "user" ? "bg-indigo-600 text-white" : "bg-white text-black"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Input Area */}
          <div className="flex items-center bg-white/10 p-4 rounded-lg">
            <input
              type="text"
              className="flex-grow bg-white/10 text-white px-4 py-2 rounded-lg focus:outline-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about DSA..."
            />
            <button
              onClick={handleSend}
              className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Send
            </button>
          </div>
        </main>

        {/* Code Area */}
        <aside className="hidden sm:block w-1/3 p-4 bg-gray-900">
          <h3 className="text-white mb-4">Code Snippet</h3>
          <SyntaxHighlighter language="javascript" style={tomorrow}>
            {codeInput}
          </SyntaxHighlighter>
        </aside>
      </div>
    </div>
  );
}
