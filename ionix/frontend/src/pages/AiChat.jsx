import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Sparkles } from "lucide-react";
import api from "../lib/api";
import { motion } from "framer-motion";

const AiChat = () => {
  const [messages, setMessages] = useState([
    { role: "ai", content: "Hello! I am Ionix AI. How can I help you optimize your life today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // 1. Add User Message immediately
    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // 2. Call Backend
      const { data } = await api.post("/ai/chat", { prompt: input });

      // 3. Add AI Response
      const aiMessage = { role: "ai", content: data.reply };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "ai", content: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full relative" style={{ color: 'var(--text)' }}>
      
      {/* HEADER */}
      <div className="p-4 border-b border-[var(--border)] bg-[var(--nav)] backdrop-blur-md flex items-center justify-between z-10 sticky top-0">
        <div className="flex items-center gap-2">
           <Sparkles className="text-indigo-400" size={20} />
           <h3 className="font-semibold">Ionix Intelligence</h3>
        </div>
        <span className="text-xs px-2 py-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">Gemini Pro</span>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4 pb-24">
        {messages.map((msg, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-[var(--border)] ${msg.role === "ai" ? "bg-indigo-600" : "bg-[var(--bg3)]"}`}>
               {msg.role === "ai" ? <Bot size={16} className="text-white"/> : <User size={16} style={{ color: 'var(--text)' }}/>}
            </div>

            {/* Bubble */}
            <div 
              className={`p-4 rounded-2xl max-w-[80%] text-sm leading-relaxed shadow-sm ${
                msg.role === "user" 
                ? "bg-indigo-600 text-white rounded-tr-sm" 
                : "bg-[var(--card)] text-[var(--text)] border border-[var(--border)] rounded-tl-sm"
              }`}
            >
              {msg.content}
            </div>
          </motion.div>
        ))}
        
        {loading && (
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                 <Bot size={16} className="text-white"/>
              </div>
              <div className="p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] flex items-center gap-2">
                 <Loader2 className="animate-spin text-indigo-400" size={16} />
                 <span className="text-xs" style={{ color: 'var(--subtext)' }}>Thinking...</span>
              </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT AREA - Gradient removed for cleaner theme look, replaced with glass effect */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[var(--bg1)] to-transparent">
        <form onSubmit={sendMessage} className="relative max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Ionix anything..."
            className="w-full p-4 pr-12 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--text)] placeholder-[var(--subtext)] focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 backdrop-blur-md shadow-xl transition-all"
          />
          <button 
            disabled={loading || !input}
            type="submit" 
            className="absolute right-3 top-3 p-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AiChat;