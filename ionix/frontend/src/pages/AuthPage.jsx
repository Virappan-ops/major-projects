import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Loader2, Sparkles, Sun, Moon } from "lucide-react";
import { GoogleLogin } from '@react-oauth/google';
import { useLocation, Link } from "react-router-dom";
import api from "../lib/api";

const AuthPage = ({ onLogin }) => {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.state?.mode !== "signup");
  
  // Theme State (synced with LandingPage via localStorage)
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") !== "light";
    }
    return true;
  });

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const endpoint = isLogin ? "/users/login" : "/users/register";
      const { data } = await api.post(endpoint, formData);
      localStorage.setItem("userInfo", JSON.stringify(data));
      onLogin();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      const { data } = await api.post("/users/google", { token: credentialResponse.credential });
      localStorage.setItem("userInfo", JSON.stringify(data));
      onLogin();
    } catch (err) {
      setError("Google Login Failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    // ADDED 'cursor-default' to fix the text selection cursor issue
    <div className={`relative min-h-screen w-full overflow-hidden font-sans flex items-center justify-center transition-colors duration-700 ease-in-out cursor-default ${isDark ? "bg-[#030014] text-white selection:bg-indigo-500/30" : "bg-[#F5F5F7] text-slate-900 selection:bg-indigo-200"}`}>
      
      {/* ================= BACKGROUND EFFECTS ================= */}
      <div className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-1000">
        {isDark ? (
           <>
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-600/20 blur-[120px] rounded-full mix-blend-screen animate-pulse" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/20 blur-[120px] rounded-full mix-blend-screen animate-pulse" />
            <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[500px] h-[500px] bg-cyan-500/10 blur-[100px] rounded-full" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
           </>
        ) : (
           <>
            <div className="absolute top-[-20%] left-[-20%] w-[70%] h-[70%] bg-blue-200/40 blur-[120px] rounded-full mix-blend-multiply" />
            <div className="absolute bottom-[-20%] right-[-20%] w-[70%] h-[70%] bg-purple-200/40 blur-[120px] rounded-full mix-blend-multiply" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]"></div>
           </>
        )}
      </div>

      {/* THEME TOGGLE (Floating Top Right) */}
      <div className="absolute top-6 right-6 z-50">
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
      </div>

      {/* ================= MAIN CARD ================= */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "circOut" }}
        className="relative z-10 w-full max-w-md p-1"
      >
        {/* Glow Border Effect */}
        <div className={`absolute inset-0 rounded-3xl opacity-20 blur-xl transition-colors duration-700 ${isDark ? "bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500" : "bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400"}`}></div>

        <div className={`relative w-full overflow-hidden rounded-3xl border backdrop-blur-2xl shadow-2xl transition-all duration-700 ${isDark ? "border-white/10 bg-black/40" : "border-white/40 bg-white/60"}`}>
          
          {/* Header Section */}
          <div className="px-8 pt-10 pb-6 text-center cursor-default">
            <Link to="/" className="inline-flex items-center justify-center mb-6 group cursor-pointer">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:rotate-12 ${isDark ? "bg-gradient-to-br from-indigo-500 to-cyan-500 shadow-indigo-500/30" : "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-500/30"}`}>
                <Sparkles size={20} className="text-white" />
              </div>
            </Link>
            
            <h2 className="text-3xl font-bold tracking-tight mb-2">
              <span className={`bg-clip-text text-transparent ${isDark ? "bg-gradient-to-b from-white to-slate-400" : "bg-gradient-to-b from-slate-900 to-slate-600"}`}>
                {isLogin ? "Welcome Back" : "Create Account"}
              </span>
            </h2>
            <p className={`text-sm transition-colors ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              {isLogin ? "Enter your credentials to access your workspace." : "Start your intelligent journey today."}
            </p>
          </div>

          <div className="px-8 pb-10">
            {/* FORM START */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <AnimatePresence mode="popLayout">
                {!isLogin && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, marginTop: 0 }} 
                    animate={{ opacity: 1, height: "auto", marginTop: 20 }} 
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <InputGroup isDark={isDark} icon={User} type="text" name="name" placeholder="Full Name" onChange={handleChange} />
                  </motion.div>
                )}
              </AnimatePresence>

              <InputGroup isDark={isDark} icon={Mail} type="email" name="email" placeholder="Email Address" onChange={handleChange} />
              <InputGroup isDark={isDark} icon={Lock} type="password" name="password" placeholder="Password" onChange={handleChange} />

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs text-center font-medium"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <button 
                disabled={loading} 
                className={`group relative w-full flex items-center justify-center gap-2 rounded-xl p-3.5 font-semibold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden ${isDark ? "bg-gradient-to-r from-indigo-600 to-purple-600 shadow-indigo-500/25" : "bg-slate-900 shadow-slate-900/20"}`}
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <span className="relative z-10 flex items-center gap-2">
                  {loading ? <Loader2 className="animate-spin" size={18} /> : (isLogin ? "Sign In" : "Sign Up")}
                  {!loading && <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />}
                </span>
              </button>
            </form>

            {/* DIVIDER */}
            <div className="relative flex py-8 items-center">
              <div className={`flex-grow border-t ${isDark ? "border-white/10" : "border-slate-300"}`}></div>
              <span className={`flex-shrink-0 mx-4 text-[10px] uppercase tracking-widest font-medium ${isDark ? "text-slate-500" : "text-slate-400"}`}>Or continue with</span>
              <div className={`flex-grow border-t ${isDark ? "border-white/10" : "border-slate-300"}`}></div>
            </div>

            {/* GOOGLE LOGIN */}
            <div className="flex justify-center mb-8">
              <div className={`rounded-full overflow-hidden border transition-colors shadow-lg ${isDark ? "border-white/10 hover:border-white/30 shadow-black/50" : "border-slate-200 hover:border-slate-400 shadow-slate-200"}`}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError("Google Login Failed")}
                  theme={isDark ? "filled_black" : "outline"}
                  shape="circle"
                  text="continue_with"
                  width="300" 
                />
              </div>
            </div>

            {/* TOGGLE MODE */}
            <div className="text-center text-sm">
              <span className={isDark ? "text-slate-500" : "text-slate-500"}>
                {isLogin ? "New to Ionix? " : "Already have an account? "}
              </span>
              <button 
                onClick={() => { setError(""); setIsLogin(!isLogin); }} 
                className={`font-semibold transition-colors hover:underline underline-offset-4 ${isDark ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600 hover:text-indigo-800"}`}
              >
                {isLogin ? "Create an account" : "Log in"}
              </button>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Reusable Input Component with Theme Support
const InputGroup = ({ icon: Icon, isDark, ...props }) => (
  <div className="relative group">
    <Icon className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-300 ${isDark ? "text-slate-500 group-focus-within:text-indigo-400" : "text-slate-400 group-focus-within:text-indigo-600"}`} />
    <input 
      {...props} 
      className={`w-full rounded-xl border p-3.5 pl-12 outline-none transition-all duration-300 ${
        isDark 
          ? "border-white/10 bg-white/5 text-white placeholder-slate-500 focus:bg-white/10 focus:border-indigo-500/50 focus:shadow-[0_0_15px_rgba(99,102,241,0.1)]" 
          : "border-slate-200 bg-white/50 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-indigo-500/50 focus:shadow-[0_0_15px_rgba(99,102,241,0.1)]"
      }`}
    />
  </div>
);

export default AuthPage;