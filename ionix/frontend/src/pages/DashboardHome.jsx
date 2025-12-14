import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  CheckCircle, StickyNote, Calendar, 
  ArrowRight, Sparkles, Zap, Activity, Plus,
  TrendingUp, Clock
} from "lucide-react";
import api from "../lib/api"; // Aapka existing API
import { motion } from "framer-motion";

const DashboardHome = () => {
  const [user, setUser] = useState({});
  const [stats, setStats] = useState({
    totalTasks: 0,
    pendingTasks: 0,
    totalNotes: 0,
    totalEvents: 0,
    taskRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo || {});
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // API Call same rakha hai taaki logic na tute
      const { data } = await api.get("/analytics");
      setStats(data);
    } catch (error) {
      console.error("Dashboard error", error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-full w-full pb-10">
      
      {/* Container with Staggered Animation */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto space-y-8"
      >
        
        {/* --- 1. HERO / WELCOME SECTION --- */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight" style={{ color: 'var(--text)' }}>
              {getGreeting()}, <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 animate-gradient-x">
                {user.name?.split(" ")[0]}
              </span>
              <span className="text-3xl"> 👋</span>
            </h1>
            <p className="mt-2 text-lg font-medium" style={{ color: 'var(--subtext)' }}>
              You have <span className="text-indigo-400 font-bold">{stats.pendingTasks} pending tasks</span> waiting for you.
            </p>
          </div>
          
          {/* Date Badge */}
          <div 
            className="px-5 py-2 rounded-2xl border backdrop-blur-md text-sm font-semibold shadow-sm"
            style={{ 
              background: "var(--card)", 
              borderColor: "var(--border)",
              color: "var(--subtext)" 
            }}
          >
            📅 {new Date().toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </motion.div>

        {/* --- 2. STATS GRID (VisionOS Cards) --- */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard 
                to="/tasks"
                title="Pending Tasks"
                value={stats.pendingTasks}
                subtext={`${stats.taskRate}% Completion Rate`}
                icon={CheckCircle}
                color="#10b981" // Emerald
                trendUp={stats.taskRate > 50}
            />
            <StatCard 
                to="/notes"
                title="Total Notes"
                value={stats.totalNotes}
                subtext="Knowledge Base"
                icon={StickyNote}
                color="#f59e0b" // Amber
                trendUp={true}
            />
            <StatCard 
                to="/planner"
                title="Upcoming Events"
                value={stats.totalEvents}
                subtext="Next 7 Days"
                icon={Calendar}
                color="#3b82f6" // Blue
                trendUp={true}
            />
            <StatCard 
                to="/analytics"
                title="Productivity"
                value={stats.taskRate > 70 ? "High" : "Normal"}
                subtext="Weekly Status"
                icon={Activity}
                color="#ec4899" // Pink
                trendUp={stats.taskRate > 40}
            />
        </motion.div>

        {/* --- 3. QUICK ACTIONS & PROMO ROW --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Quick Actions (Span 2) */}
            <motion.div variants={itemVariants} className="lg:col-span-2 space-y-4">
                <h3 className="text-xl font-bold flex items-center gap-2" style={{ color: 'var(--text)' }}>
                    <Sparkles size={20} className="text-amber-400" /> Quick Actions
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <ActionTile 
                        to="/chat" 
                        title="AI Assistant" 
                        desc="Ask for code or help" 
                        icon={Sparkles} 
                        color="text-violet-400"
                        bg="bg-violet-500/10"
                    />
                    <ActionTile 
                        to="/tasks" 
                        title="New Task" 
                        desc="Add to your list" 
                        icon={Plus} 
                        color="text-emerald-400"
                        bg="bg-emerald-500/10"
                    />
                    <ActionTile 
                        to="/pdf-tools" 
                        title="PDF Tools" 
                        desc="Merge or Split docs" 
                        icon={StickyNote} 
                        color="text-rose-400"
                        bg="bg-rose-500/10"
                    />
                </div>
            </motion.div>

            {/* Promo / Upgrade Card (Span 1) - Only if Free */}
            {!user.isPremium && (
                <motion.div variants={itemVariants} className="lg:col-span-1 flex flex-col justify-end">
                    <div className="relative group overflow-hidden rounded-3xl border border-indigo-500/30 p-[1px]">
                        {/* Gradient Border Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-20 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        <div className="relative h-full rounded-[23px] p-6 flex flex-col justify-between" style={{ background: 'var(--bg1)' }}>
                            <div>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-300 to-orange-500 flex items-center justify-center mb-4 shadow-lg shadow-orange-500/20">
                                    <Zap size={20} className="text-white fill-current" />
                                </div>
                                <h3 className="text-lg font-bold" style={{ color: 'var(--text)' }}>Upgrade to Pro</h3>
                                <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--subtext)' }}>
                                    Unlock unlimited AI chats, premium themes, and cloud backup.
                                </p>
                            </div>
                            <Link 
                                to="/subscription"
                                className="mt-6 w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-center shadow-lg shadow-indigo-500/25 transition-all active:scale-95"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>

      </motion.div>
    </div>
  );
};

// ================= SUB-COMPONENTS =================

// 1. VisionOS Stat Card
const StatCard = ({ to, title, value, subtext, icon: Icon, color, trendUp }) => (
    <Link to={to} className="block group relative">
        <div 
            className="relative overflow-hidden rounded-3xl p-6 border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            style={{ 
                background: "var(--card)", 
                borderColor: "var(--border)",
                backdropFilter: "blur(20px)"
            }}
        >
            {/* Hover Glow Background */}
            <div 
                className="absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 blur-[50px] transition-opacity duration-500 group-hover:opacity-20"
                style={{ backgroundColor: color }}
            />

            <div className="relative z-10 flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-sm font-medium mb-1" style={{ color: 'var(--subtext)' }}>{title}</h3>
                    <div className="text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text)' }}>{value}</div>
                </div>
                <div 
                    className="flex h-12 w-12 items-center justify-center rounded-2xl border shadow-inner"
                    style={{ 
                        backgroundColor: `${color}15`, 
                        borderColor: `${color}30`
                    }}
                >
                    <Icon size={22} style={{ color: color }} />
                </div>
            </div>

            <div className="relative z-10 flex items-center gap-2 text-xs font-semibold">
                <span 
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-md bg-opacity-10 ${trendUp ? 'text-emerald-500 bg-emerald-500' : 'text-rose-500 bg-rose-500'}`}
                >
                    {trendUp ? <TrendingUp size={12} /> : <TrendingUp size={12} className="rotate-180" />}
                    {trendUp ? "+2.5%" : "-1.2%"}
                </span>
                <span style={{ color: 'var(--subtext)' }}>{subtext}</span>
            </div>
        </div>
    </Link>
);

// 2. Action Tile
const ActionTile = ({ to, title, desc, icon: Icon, color, bg }) => (
    <Link 
        to={to} 
        className="group flex items-center gap-4 rounded-2xl border p-4 transition-all hover:bg-[var(--bg3)] hover:border-indigo-500/30"
        style={{ 
            background: "var(--card)", 
            borderColor: "var(--border)",
            backdropFilter: "blur(12px)"
        }}
    >
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${bg} ${color} transition-transform group-hover:scale-110`}>
            <Icon size={22} />
        </div>
        <div>
            <h4 className="font-bold text-sm group-hover:text-indigo-400 transition-colors" style={{ color: 'var(--text)' }}>{title}</h4>
            <p className="text-xs font-medium" style={{ color: 'var(--subtext)' }}>{desc}</p>
        </div>
        <div className="ml-auto opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0">
            <ArrowRight size={16} className="text-indigo-400" />
        </div>
    </Link>
);

export default DashboardHome;