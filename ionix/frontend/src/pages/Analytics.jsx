import React, { useState, useEffect } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area, CartesianGrid 
} from "recharts";
import { motion } from "framer-motion";
import { 
  Activity, CheckCircle, StickyNote, Calendar, 
  TrendingUp, ArrowUpRight, Target, Zap 
} from "lucide-react";
import api from "../lib/api";
import "../styles/Analytics.css";

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data } = await api.get("/analytics");
      setData(data);
    } catch (error) {
      console.error("Error fetching analytics");
    } finally {
      setLoading(false);
    }
  };

  // --- CHART CONFIG ---
  const pieData = data ? [
    { name: 'Completed', value: data.completedTasks },
    { name: 'Pending', value: data.pendingTasks },
  ] : [];

  const COLORS = ['#10b981', '#6366f1']; // Emerald (Done) vs Indigo (Pending)

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1 } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full text-[var(--subtext)]">
      <Activity className="animate-spin mr-2" /> Crunching numbers...
    </div>
  );

  return (
    <div className="analytics-page custom-scrollbar">
      
      {/* HEADER */}
      <div className="analytics-header">
         <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
               Performance Overview
            </h1>
            <p className="text-sm opacity-60 mt-1" style={{ color: 'var(--subtext)' }}>
               Track your productivity metrics and trends.
            </p>
         </div>
         <div className="date-badge">
            <Calendar size={14} /> 
            <span>Last 7 Days</span>
         </div>
      </div>

      <motion.div 
        className="analytics-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        
        {/* --- 1. KPI GRID --- */}
        <div className="kpi-grid">
          <KPICard 
            title="Completion Rate" 
            value={`${data.taskRate}%`} 
            icon={Target} 
            color="emerald" 
            trend="+5%"
          />
          <KPICard 
            title="Total Tasks" 
            value={data.totalTasks} 
            icon={CheckCircle} 
            color="indigo" 
            trend="+12"
          />
          <KPICard 
            title="Notes Created" 
            value={data.totalNotes} 
            icon={StickyNote} 
            color="amber" 
            trend="+3"
          />
          <KPICard 
            title="Events" 
            value={data.totalEvents} 
            icon={Calendar} 
            color="blue" 
            trend="Upcoming"
          />
        </div>

        {/* --- 2. CHARTS SECTION --- */}
        <div className="charts-layout">
          
          {/* Main Chart: Activity */}
          <motion.div variants={itemVariants} className="glass-chart-card wide">
            <div className="chart-header">
               <h3>Weekly Activity</h3>
               <button className="chart-opt-btn">View Report</button>
            </div>
            
            <div style={{ width: '100%', height: 320 }}>
              <ResponsiveContainer>
                <BarChart data={data.activityData} barGap={8}>
                  <defs>
                    <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.9}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.4}/>
                    </linearGradient>
                    <linearGradient id="colorNotes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.9}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.4}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: 'var(--subtext)', fontSize: 12}} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: 'var(--subtext)', fontSize: 12}} 
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{fill: 'var(--bg3)', opacity: 0.4}} />
                  <Bar dataKey="tasks" name="Tasks Completed" fill="url(#colorTasks)" radius={[6, 6, 0, 0]} barSize={30} />
                  <Bar dataKey="notes" name="Notes Created" fill="url(#colorNotes)" radius={[6, 6, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Secondary Chart: Distribution (Donut) */}
          <motion.div variants={itemVariants} className="glass-chart-card">
            <div className="chart-header">
               <h3>Task Status</h3>
            </div>
            
            <div className="donut-container" style={{ width: '100%', height: 260, position: 'relative' }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={6}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>

              {/* Centered Text in Donut */}
              <div className="donut-label">
                 <span className="donut-value">{data.taskRate}%</span>
                 <span className="donut-sub">Done</span>
              </div>
            </div>

            {/* Custom Legend */}
            <div className="chart-legend">
               <div className="legend-item">
                  <span className="dot" style={{background: '#10b981'}}></span>
                  <span className="label">Completed</span>
                  <span className="val">{data.completedTasks}</span>
               </div>
               <div className="legend-item">
                  <span className="dot" style={{background: '#6366f1'}}></span>
                  <span className="label">Pending</span>
                  <span className="val">{data.pendingTasks}</span>
               </div>
            </div>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const KPICard = ({ title, value, icon: Icon, color, trend }) => (
  <motion.div 
    variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
    className="glass-kpi-card"
    whileHover={{ y: -4 }}
  >
    <div className="kpi-top">
       <div className={`icon-box ${color}`}>
          <Icon size={20} />
       </div>
       <div className="trend-badge">
          <TrendingUp size={12} /> {trend}
       </div>
    </div>
    <div className="kpi-content">
       <h2 className="kpi-value">{value}</h2>
       <p className="kpi-title">{title}</p>
    </div>
    {/* Decorative Background Blob */}
    <div className={`kpi-glow ${color}`}></div>
  </motion.div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">{label}</p>
        {payload.map((p, i) => (
          <div key={i} className="tooltip-item">
             <span className="tooltip-dot" style={{background: p.fill}}></span>
             <span className="tooltip-name">{p.name}:</span>
             <span className="tooltip-value">{p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default Analytics;