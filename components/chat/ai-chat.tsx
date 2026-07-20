"use client";

import { BotIcon, Send } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

import { ProductCard } from "../products/product-card";
import ReactMarkdown from "react-markdown";
import SuggestionGrid from "./suggestion-grid";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  products?: any[];
  createdAt: string;
};

export default function AiChat() {
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const sendAudioRef = useRef<HTMLAudioElement | null>(null);
  const receiveAudioRef = useRef<HTMLAudioElement | null>(null);

  const getCurrentTime = () =>
  new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  }); 

  useEffect(() => {
    sendAudioRef.current = new Audio("/sounds/send.mp3");
    receiveAudioRef.current = new Audio("/sounds/receive.mp3");
  }, []);

  const playSound = (type: "send" | "receive") => {
    const audio =
      type === "send" ? sendAudioRef.current : receiveAudioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  };

  const scrollToBottom = (force = false) => {
    const container = containerRef.current;
    if (!container) return;

    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      120;

    if (force || isNearBottom) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (loading) scrollToBottom(true);
  }, [loading]);

  useEffect(() => {
    setMessages([
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          "Hello! I'm TechStore AI 🤖. Ask me about products, prices, color, or description.",
        createdAt: getCurrentTime(),
      },
      
    ]);
  }, []);

  const sendMessage = async (input: string) => {
    if (!input || loading) return;

    playSound("send");

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input,
       createdAt: getCurrentTime(),
    };

    const historyWithContext = messages.map((msg) => {
      if (msg.role === "assistant" && msg.products?.length) {
        return {
          ...msg,
          content:
            msg.content +
            `\n\n[SYSTEM_CONTEXT: ${JSON.stringify(msg.products)}]`,
        };
      }
      return msg;
    });

    const finalMessages = [...historyWithContext, userMessage];

    setMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ messages: finalMessages }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      const aiMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          data.text ||
          (data.products?.length
            ? "Here are some products I found:"
            : "Sorry, I couldn't find anything that matches your request 😢"),
        products: data.products || [],
        createdAt: getCurrentTime(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      playSound("receive");
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "⚠️ Now limit reached, please try again later. Thank you for your patience.",
           createdAt: getCurrentTime(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(chatInput.trim());
  };

  const handleSuggestionClick = (value: string) => {
    setChatInput(value);
    sendMessage(value);
  };

  return (
    <div className="max-w-7xl px-5 mx-auto md:h-[76vh] h-96 flex flex-col">
      <div ref={containerRef} className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
  <div className="space-y-6 pb-[calc(env(safe-area-inset-bottom)+24px)] px-2">
    {messages.map((message) => (
      <div
        key={message.id}
        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
      >
        <div
          className={`flex gap-3.5 w-full max-w-[85%] md:max-w-[75%] ${
            message.role === "user" ? "flex-row-reverse" : "items-start"
          }`}
        >
          {message.role === "assistant" && (
            <div className="shrink-0 bg-primary/10 dark:bg-primary/20 rounded-xl p-2.5 mt-0.5 shadow-sm border border-primary/10">
              <BotIcon size={18} className="text-primary" />
            </div>
          )}

          <div className={`flex flex-col gap-1.5 min-w-0 ${message.role === "user" ? "items-end" : "items-start"}`}>
            <div
              className={`px-4 py-3 rounded-2xl text-[15px] shadow-sm tracking-wide leading-relaxed border ${
                message.role === "user"
                  ? "bg-primary text-white border-primary rounded-tr-none"
                  : "bg-white/70 dark:bg-card/70 backdrop-blur-md border-neutral-100 dark:border-neutral-800/60 rounded-tl-none text-neutral-800 dark:text-neutral-200"
              }`}
            >
              <ReactMarkdown
                components={{
                  img: ({ node, ...props }) => (
                    <img
                      {...props}
                      className="max-w-full md:max-w-md h-auto rounded-xl my-3 shadow-md border border-neutral-100 dark:border-neutral-800 transition-transform hover:scale-[1.01]"
                      alt={props.alt || "Product Image"}
                    />
                  ),
                  p: ({ children }) => (
                    <p className="mb-2 last:mb-0">
                      {children}
                    </p>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
            
            {message.products && message.products.length > 0 && (
              <div className="w-full overflow-hidden mt-1">
                <div className="flex gap-4 overflow-x-auto pb-3 no-scrollbar scroll-smooth snap-x snap-mandatory">
                  {message.products.map((product) => (
                    <div
                      key={product.id}
                      className="w-[220px] md:w-[260px] shrink-0 snap-start transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
                    >
                      <ProductCard product={product} isChat />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <span className="text-[11px] text-neutral-400 dark:text-neutral-500 px-1 font-medium select-none">
              {message.createdAt}
            </span>
          </div>
        </div>
      </div>
    ))}

    {messages.length === 1 && !loading && (
      <div className="mt-4 animate-fade-in">
        <SuggestionGrid onSelect={handleSuggestionClick} />
      </div>
    )}

    {loading && (
      <div className="flex justify-start animate-pulse">
        <div className="flex gap-3.5 max-w-[85%] items-start">
          <div className="shrink-0 bg-primary/10 dark:bg-primary/20 rounded-xl p-2.5 mt-0.5 border border-primary/10">
            <BotIcon size={18} className="text-primary" />
          </div>

          <div className="px-5 py-3.5 bg-white/50 dark:bg-card/50 backdrop-blur-md border border-neutral-100 dark:border-neutral-800/60 rounded-2xl rounded-tl-none shadow-sm flex items-center justify-center">
            <div className="flex gap-1.5 items-center">
              <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-2 h-2 bg-primary/80 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
            </div>
          </div>
        </div>
      </div>
    )}

    <div ref={bottomRef} />
  </div>
</div>

      <div
        className="fixed md:bottom-0 bottom-18 left-0 w-full z-40 backdrop-blur-md border-t"
      >
        <div
          className="max-w-4xl mx-auto px-4 pt-3 
          pb-[calc(env(safe-area-inset-bottom)+16px)]"
        >
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 bg-gray-100 dark:bg-card border rounded-full px-2 py-1.5 shadow-sm focus-within:ring-2 focus-within:ring-primary/50"
          >
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask about products..."
              className="flex-1 bg-transparent px-4 py-2 text-sm outline-none"
            />

            <button
              disabled={!chatInput.trim() || loading}
              className="bg-primary text-white p-2.5 rounded-full disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
