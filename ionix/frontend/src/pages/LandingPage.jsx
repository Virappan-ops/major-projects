import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Shield, Layers, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";

const LandingPage = () => {
  // Theme State with LocalStorage Persistence
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") !== "light";
    }
    return true;
  });

  useEffect(() => {
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    // MASTER CONTAINER
    <div className={`relative h-screen w-full overflow-hidden transition-colors duration-700 ease-in-out cursor-default font-sans selection:bg-indigo-500/30 ${isDark ? "bg-[#030014] text-white" : "bg-[#F5F5F7] text-slate-900"}`}>
      
      {/* ================= BACKGROUND EFFECTS ================= */}
      <div className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-1000">
        {isDark ? (
          // DARK MODE AURORA
          <>
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[120px] rounded-full mix-blend-screen animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[120px] rounded-full mix-blend-screen animate-pulse" />
            <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/10 blur-[100px] rounded-full" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
          </>
        ) : (
          // LIGHT MODE GRADIENTS (Soft & Airy)
          <>
            <div className="absolute top-[-20%] left-[-20%] w-[70%] h-[70%] bg-blue-200/40 blur-[120px] rounded-full mix-blend-multiply" />
            <div className="absolute bottom-[-20%] right-[-20%] w-[70%] h-[70%] bg-purple-200/40 blur-[120px] rounded-full mix-blend-multiply" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          </>
        )}
      </div>

      {/* ================= NAVBAR ================= */}
      <nav className="relative z-50 w-full px-10 py-6 flex justify-between items-center backdrop-blur-sm">
        
        {/* LOGO */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 group cursor-pointer"
        >
          <motion.div 
            whileHover={{ rotate: 180, scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className={`h-10 w-10 rounded-xl flex items-center justify-center shadow-lg transition-all duration-500 ${isDark ? "bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 shadow-indigo-500/50" : "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-500/30"}`}
          >
            <Sparkles size={20} className="text-white drop-shadow-md" />
          </motion.div>
          
          <span className={`text-3xl font-extrabold tracking-tight bg-clip-text text-transparent transition-all duration-500 ${isDark ? "bg-gradient-to-r from-white via-indigo-200 to-slate-400" : "bg-gradient-to-r from-slate-900 via-indigo-800 to-slate-600"}`}>
            Ionix
          </span>
        </motion.div>

        {/* RIGHT SIDE ACTIONS */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex gap-4 items-center"
        >
          {/* THEME TOGGLE BUTTON */}
          <button 
            onClick={toggleTheme}
            className={`p-2.5 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg border ${
              isDark 
                ? "bg-white/10 border-white/10 text-yellow-300 hover:bg-white/20 hover:shadow-yellow-500/20" 
                : "bg-white border-slate-200 text-indigo-600 hover:bg-slate-50 hover:shadow-indigo-500/20"
            }`}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={isDark ? "dark" : "light"}
                initial={{ y: -20, opacity: 0, rotate: -90 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ y: 20, opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                {isDark ? <Sun size={20} fill="currentColor" /> : <Moon size={20} fill="currentColor" />}
              </motion.div>
            </AnimatePresence>
          </button>

          <Link to="/auth" state={{ mode: "login" }} className={`text-sm font-medium transition-colors duration-300 ${isDark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-indigo-600"}`}>
            Log in
          </Link>
          
          <Link 
            to="/auth" 
            state={{ mode: "signup" }}
            className={`px-6 py-2.5 text-sm font-bold rounded-full transition-all hover:scale-105 shadow-lg backdrop-blur-md ${
              isDark 
               ? "text-white bg-white/10 border border-white/10 hover:bg-white/20 shadow-white/5" 
               : "text-white bg-slate-900 border border-slate-800 hover:bg-slate-800 shadow-slate-900/20"
            }`}
          >
            Get Started
          </Link>
        </motion.div>
      </nav>

      {/* ================= MAIN HERO CONTENT ================= */}
      <main className="relative z-10 flex flex-col items-center justify-center h-[calc(100vh-140px)] w-full px-4 pb-32">
        
        {/* Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <div className={`group relative px-5 py-2 rounded-full border backdrop-blur-md overflow-hidden transition-all duration-300 ${isDark ? "bg-black/40 border-white/10 hover:border-indigo-500/50" : "bg-white/60 border-indigo-100 hover:border-indigo-300 shadow-sm"}`}>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className={`relative text-xs font-semibold tracking-widest uppercase flex items-center gap-2 bg-clip-text text-transparent ${isDark ? "bg-gradient-to-r from-indigo-300 to-cyan-300" : "bg-gradient-to-r from-indigo-600 to-cyan-600"}`}>
              <span className={`w-2 h-2 rounded-full animate-pulse shadow-[0_0_10px_currentColor] ${isDark ? "bg-cyan-400" : "bg-indigo-500"}`} />
              Intelligence Redesigned
            </span>
          </div>
        </motion.div>

        {/* Hero Headline */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "circOut" }}
          className="text-center max-w-5xl mx-auto z-20"
        >
          <h1 className="text-7xl md:text-9xl font-bold tracking-tighter leading-[1.05] mb-8 drop-shadow-2xl">
            <span className={`inline-block bg-clip-text text-transparent ${isDark ? "bg-gradient-to-b from-white via-white to-slate-400" : "bg-gradient-to-b from-slate-900 via-slate-800 to-slate-500"}`}>
              Think Faster.
            </span>
            <br />
            <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 animate-gradient-x bg-[length:200%_auto]">
              Create Better.
            </span>
          </h1>

          <p className={`text-xl max-w-2xl mx-auto mb-12 font-light leading-relaxed transition-colors ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            The only workspace you'll ever need. AI, Notes, and Tasks merged into a 
            <span className={`font-medium ${isDark ? "text-slate-200" : "text-slate-900"}`}> fluid, cinematic interface</span>.
          </p>

          {/* CTA Button */}
          <Link to="/auth" state={{ mode: "signup" }} className={`group relative inline-flex items-center justify-center gap-3 px-10 py-5 rounded-full font-bold text-lg tracking-tight overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-2xl ${isDark ? "bg-white text-black shadow-white/10" : "bg-slate-900 text-white shadow-indigo-500/20"}`}>
            <span className="relative z-10">Start Your Journey</span>
            <ArrowRight className="relative z-10 w-5 h-5 transition-transform group-hover:translate-x-1" />
            <div className={`absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent to-transparent ${isDark ? "via-slate-300/50" : "via-white/20"}`} />
          </Link>
        </motion.div>

        {/* ================= GLASS CARDS ================= */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="absolute bottom-10 w-full max-w-5xl px-6 grid grid-cols-1 md:grid-cols-3 gap-5"
        >
            <GlassCard isDark={isDark} icon={<Zap className={isDark ? "text-yellow-300" : "text-yellow-600"} size={24} />} title="Instant AI" desc="Gemini Flash Included" />
            <GlassCard isDark={isDark} icon={<Layers className={isDark ? "text-cyan-300" : "text-cyan-600"} size={24} />} title="Fluid Workflow" desc="Tasks meet Notes" />
            <GlassCard isDark={isDark} icon={<Shield className={isDark ? "text-emerald-300" : "text-emerald-600"} size={24} />} title="Encrypted" desc="Private by default" />
        </motion.div>

      </main>
    </div>
  );
};

// Reusable Glass Card
const GlassCard = ({ icon, title, desc, isDark }) => {
  return (
    <div className={`group relative p-6 rounded-2xl border backdrop-blur-md transition-all duration-300 hover:-translate-y-2 cursor-default ${
      isDark 
        ? "bg-white/5 border-white/5 hover:bg-white/10 hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]" 
        : "bg-white/60 border-white/40 hover:bg-white/80 hover:shadow-[0_10px_30px_-10px_rgba(100,100,200,0.1)] shadow-sm"
    }`}>
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${isDark ? "from-indigo-500/10 to-purple-500/10" : "from-blue-500/5 to-purple-500/5"}`} />
      
      <div className="relative z-10 flex items-center gap-5">
        <div className={`p-3 rounded-xl border shadow-inner transition-colors ${isDark ? "bg-black/50 border-white/10 group-hover:border-white/20" : "bg-white border-slate-200 group-hover:border-indigo-100"}`}>
          {icon}
        </div>
        <div className="text-left">
          <h3 className={`font-bold text-base tracking-wide transition-colors ${isDark ? "text-white group-hover:text-indigo-200" : "text-slate-800 group-hover:text-indigo-600"}`}>
            {title}
          </h3>
          <p className={`text-sm transition-colors ${isDark ? "text-slate-500 group-hover:text-slate-300" : "text-slate-500 group-hover:text-slate-600"}`}>
            {desc}
          </p>
        </div>
      </div>
    </div>
  )
}

export default LandingPage;