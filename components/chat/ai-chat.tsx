"use client";

import { Sparkles, Send } from "lucide-react";
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

const createInitialMessage = (): Message => ({
  id: "welcome-message",
  role: "assistant",
  content:
    "👋 Welcome to TechStore AI! Tell me what you're looking for, and I'll help you find the right product.",
  createdAt: new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  }),
});

export default function AiChat() {

  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(() => [
  createInitialMessage(),
]);
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

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      150;

    if (isNearBottom || loading) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const sendMessage = async (input: string) => {
    const trimmedInput = input.trim();
    if (!trimmedInput || loading) return;

    playSound("send");

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmedInput,
      createdAt: getCurrentTime(),
    };

    const historyWithContext = messages.map((msg) => {
      if (msg.role === "assistant" && msg.products?.length) {
        return {
          ...msg,
          content: `${msg.content}\n\n[SYSTEM_CONTEXT: ${JSON.stringify(
            msg.products,
          )}]`,
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
          content:
            "⚠️ Rate limit reached, please try again later. Thank you for your patience.",
          createdAt: getCurrentTime(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(chatInput);
  };

  const handleSuggestionClick = (value: string) => {
    sendMessage(value);
  };

  return (
    <div className="max-w-4xl px-4 mx-auto md:h-[80vh] h-[85vh] flex flex-col relative">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto no-scrollbar scroll-smooth pt-4 pb-20 space-y-6"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
          >
            <div
              className={`flex gap-3 max-w-[85%] md:max-w-175 ${
                message.role === "user" ? "flex-row-reverse" : "items-start"
              }`}
            >
              {message.role === "assistant" && (
                <div className="relative shrink-0">
                  <div className="w-9 h-9 rounded-2xl bg-linear-to-tr from-primary to-purple-500 flex items-center justify-center shadow-lg shadow-primary/25">
                    <Sparkles size={17} className="animate-pulse text-white" />
                  </div>
                </div>
              )}

              <div
                className={`flex flex-col gap-1.5 min-w-0 ${
                  message.role === "user" ? "items-end" : "items-start"
                }`}
              >
                {message.role === "assistant" && (
                  <span className="text-[11px] font-semibold tracking-wide text-primary/80 uppercase px-1">
                    TechStore AI
                  </span>
                )}

                <div
                  className={`px-5 py-3.5 rounded-3xl text-[14.5px] leading-relaxed shadow-sm ${
                    message.role === "user"
                      ? "bg-primary shadow-primary/20 rounded-tr-xs font-medium text-white"
                      : "bg-white/70 dark:bg-card/60 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-tl-xs text-neutral-800 dark:text-neutral-100 shadow-neutral-200/50 dark:shadow-none"
                  }`}
                >
                  <ReactMarkdown
                    components={{
                      img: ({ node, ...props }) => (
                        <img
                          {...props}
                          className="max-w-full md:max-w-md h-auto rounded-2xl my-3 shadow-lg border border-neutral-200/50 dark:border-neutral-700/50 hover:scale-[1.01] transition-transform"
                          alt={props.alt || "Product Image"}
                        />
                      ),
                      p: ({ children }) => (
                        <p className="mb-2 last:mb-0">{children}</p>
                      ),
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>

                  {message.products && message.products.length > 0 && (
                    <div className="w-full overflow-hidden mt-3 pt-2 border-t border-neutral-200/40 dark:border-neutral-700/40">
                      <div className="flex gap-3.5 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth snap-x">
                        {message.products.map((product) => (
                          <div
                            key={product.id}
                            className="w-52.5 md:w-60 shrink-0 snap-start transition-transform hover:-translate-y-1"
                          >
                            <ProductCard product={product} isChat />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <span className="text-[10px] text-neutral-400 dark:text-neutral-500 px-2 font-medium select-none">
                  {message.createdAt}
                </span>
              </div>
            </div>
          </div>
        ))}

        {messages.length === 1 && !loading && (
          <div className="mt-6">
            <SuggestionGrid onSelect={handleSuggestionClick} />
          </div>
        )}

        {loading && (
          <div className="flex justify-start animate-in fade-in duration-300">
            <div className="flex gap-3 max-w-[85%] md:max-w-175 items-start">
              <div className="relative shrink-0">
                <div className="w-9 h-9 rounded-2xl bg-linear-to-tr from-primary to-purple-500 flex items-center justify-center shadow-lg shadow-primary/25">
                  <Sparkles size={17} className="animate-spin text-white" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-semibold tracking-wide text-primary/80 uppercase px-1">
                  TechStore AI
                </span>

                <div className="flex items-center gap-2.5 bg-white/70 dark:bg-card/60 backdrop-blur-xl border border-white/40 dark:border-white/10 px-5 py-3.5 rounded-3xl rounded-tl-xs shadow-sm">
                  <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300 animate-pulse">
                    Thinking...
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="w-full shrink-0 pt-2 pb-20 md:pb-4 bg-background/80 backdrop-blur-md">
        <div className="max-w-2xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 bg-white/80 dark:bg-card/80 backdrop-blur-2xl border border-neutral-200/80 dark:border-neutral-800 rounded-full shadow-2xl shadow-primary/5 p-1.5 transition-all focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10"
          >
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask AI about products, specs, recommendations..."
              className="flex-1 bg-transparent px-5 py-2.5 text-sm outline-none placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
            />

            <button
              disabled={!chatInput.trim() || loading}
              className="bg-linear-to-r from-primary to-purple-600 p-3 rounded-full disabled:opacity-40 transition-transform active:scale-95 shadow-md shadow-primary/30"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
