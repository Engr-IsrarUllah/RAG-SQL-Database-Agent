"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useEffect, useRef } from "react";

export default function Chat() {
  // 1. Get 'setMessages' so we can modify the history
  const { messages, sendMessage, setMessages } = useChat() as any;

  const [inputVal, setInputVal] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null); // To auto-focus input

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 2. The Edit Function
  const handleEdit = (index: number, textToEdit: string) => {
    const newHistory = messages.slice(0, index);
    setMessages(newHistory);
    setInputVal(textToEdit);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 10);
  };

  // 3. Send Handler
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const text = inputVal;
    setInputVal("");

    await sendMessage({
      text: text,
    });
  };

  // Helper to safely extract text from message parts or content
  const getTextFromMessage = (message: any) => {
    if (message.parts) {
      return message.parts
        .map((p: any) => (p.type === "text" ? p.text : ""))
        .join("");
    }
    return message.content;
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* --- HEADER --- */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center shadow-sm z-10 sticky top-0">
        <div className="bg-blue-600 p-2 rounded-lg mr-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
            />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-gray-800">SQL Database Agent</h1>
      </header>

      {/* --- MESSAGES --- */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-20">
            <p className="text-lg font-medium">👋 Hi there!</p>
            <p className="text-sm">Ask me about your users or database.</p>
          </div>
        )}

        {messages.map((message: any, index: number) => {
          // Extract text helper
          const displayContent = getTextFromMessage(message);

          return (
            <div
              key={message.id}
              className={`flex w-full group ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`relative max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-3 shadow-sm ${
                  message.role === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-white border border-gray-200 text-gray-800 rounded-bl-none"
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <div className="font-semibold text-xs opacity-70 uppercase tracking-wider">
                    {message.role === "user" ? "You" : "Agent"}
                  </div>

                  {/* --- PENCIL ICON (Only for User) --- */}
                  {message.role === "user" && (
                    <button
                      onClick={() => handleEdit(index, displayContent)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 p-1 hover:bg-blue-500 rounded text-white/80 hover:text-white"
                      title="Edit this message"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-3 h-3"
                      >
                        <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                        <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                      </svg>
                    </button>
                  )}
                </div>

                <div className="whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
                  {message.parts
                    ? message.parts
                        .map((p: any, i: number) => {
                          if (p.type === "text") return p.text;
                          if (
                            p.type === "tool-invocation" ||
                            p.type === "tool-db_query"
                          ) {
                            const args =
                              p.args ||
                              (p.toolInvocation && p.toolInvocation.args);
                            // return `\n[Executed SQL: ${JSON.stringify(args)}]\n`;
                          }
                          return "";
                        })
                        .join("")
                    : message.content}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* --- INPUT --- */}
      <div className="p-4 bg-white border-t border-gray-200">
        <form
          onSubmit={handleSend}
          className="max-w-4xl mx-auto relative flex items-center"
        >
          <input
            ref={inputRef} // Attached ref for auto-focus on edit
            className="w-full p-4 pr-12 bg-gray-50 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-gray-800"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Ask a question..."
          />
          <button
            type="submit"
            disabled={!inputVal.trim()}
            className="absolute right-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
              />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
