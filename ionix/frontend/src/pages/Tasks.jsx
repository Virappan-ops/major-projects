import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Calendar, Flag, Tag, Trash2, X, Check, AlertCircle, Layers 
} from "lucide-react";
import api from "../lib/api"; 
import "../styles/Tasks.css";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // --- 1. FETCH TASKS ---
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await api.get("/tasks");
      const mappedTasks = data.map(t => ({
        ...t,
        id: t._id, 
        sub: `${t.due || 'Today'} · ${t.priority || 'Medium'} Priority` 
      }));
      setTasks(mappedTasks);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. ADD TASK ---
  const handleAddTask = async (taskData) => {
    const getTagColor = (tag) => {
      switch(tag) {
        case "Work": return "#8b5cf6"; 
        case "Personal": return "#10b981"; 
        case "Study": return "#3b82f6";
        case "Urgent": return "#ef4444"; 
        default: return "#f59e0b"; 
      }
    };

    const color = getTagColor(taskData.tag);
    const tempId = Date.now();
    
    const uiTask = {
      id: tempId,
      ...taskData,
      color: color,
      sub: `${taskData.due} · ${taskData.priority} Priority`,
      completed: false
    };

    setTasks([uiTask, ...tasks]);
    setIsModalOpen(false);

    try {
      const { data } = await api.post("/tasks", { ...uiTask });
      setTasks(prev => prev.map(t => t.id === tempId ? { ...t, id: data._id } : t));
    } catch (error) {
      setTasks(prev => prev.filter(t => t.id !== tempId));
    }
  };

  // --- 3. ACTIONS ---
  const toggleComplete = async (id) => {
    const task = tasks.find(t => t.id === id);
    if(!task) return;
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    try { await api.put(`/tasks/${id}`, { completed: !task.completed }); } catch (err) {}
  };

  const deleteTask = async (id) => {
    setTasks(tasks.filter(t => t.id !== id));
    try { await api.delete(`/tasks/${id}`); } catch (err) {}
  };

  // Stats calculation
  const pendingCount = tasks.filter(t => !t.completed).length;

  return (
    <div className="tasks-container custom-scrollbar">
      
      {/* --- STICKY TOP BAR (Replaces Title) --- */}
      <div className="sticky-glass-header">
        
        {/* Left: Subtle Status */}
        <div className="status-pill">
           <Layers size={14} className="text-indigo-400"/>
           <span className="font-bold">{pendingCount}</span>
           <span className="text-opacity-60">Pending</span>
        </div>

        {/* Right: Add Button */}
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="sticky-add-btn"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={18} strokeWidth={3} />
          <span>Add Task</span>
        </motion.button>
      </div>

      {/* --- TASK LIST --- */}
      <div className="tasks-grid">
        <AnimatePresence mode="popLayout">
          {tasks.map((task) => (
            <TaskItem 
              key={task.id} 
              task={task} 
              onToggle={() => toggleComplete(task.id)}
              onDelete={() => deleteTask(task.id)}
            />
          ))}
        </AnimatePresence>

        {!loading && tasks.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="empty-state"
          >
            <div className="empty-icon">🏖️</div>
            <h3>All Caught Up!</h3>
            <p>Relax, you have zero pending tasks.</p>
          </motion.div>
        )}
      </div>

      {/* --- PREMIUM MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <PremiumModal 
            close={() => setIsModalOpen(false)} 
            submit={handleAddTask}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// --- SUB-COMPONENTS (Same as before, Logic reused) ---

function TaskItem({ task, onToggle, onDelete }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.01 }}
      className={`glass-task-card ${task.completed ? "completed" : ""}`}
      onClick={onToggle}
      style={{ borderLeftColor: task.color }}
    >
      <div className="flex items-center gap-4 w-full">
        <div className={`checkbox-circle ${task.completed ? "checked" : ""}`} style={{ '--accent': task.color }}>
          {task.completed && <Check size={14} strokeWidth={3} />}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="task-text truncate">{task.title}</h3>
          <div className="flex items-center gap-3 mt-1">
             <span className="meta-tag" style={{ color: task.color, background: `${task.color}15` }}>
               {task.tag}
             </span>
             <span className="meta-text">{task.due}</span>
             {task.priority === 'High' && <span className="text-red-400 text-[10px] font-bold uppercase">High</span>}
          </div>
        </div>

        <button className="icon-btn-delete" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
          <Trash2 size={18} />
        </button>
      </div>
    </motion.div>
  );
}

function PremiumModal({ close, submit }) {
  const [data, setData] = useState({ title: "", tag: "Personal", due: "Today", priority: "Medium" });
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!data.title.trim()) { setError(true); return; }
    submit(data);
  };

  return (
    <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close}>
      <motion.div className="premium-modal" initial={{ y: 50, opacity: 0, scale: 0.9 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 50, opacity: 0, scale: 0.9 }} onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
           <h2 className="text-xl font-bold" style={{ color: "var(--text)" }}>New Task</h2>
           <button onClick={close} className="close-btn"><X size={20}/></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
             <input type="text" className={`title-input ${error ? "input-error" : ""}`} placeholder="What needs doing?" value={data.title} onChange={(e) => { setData({...data, title: e.target.value}); setError(false); }} autoFocus />
             {error && <div className="absolute right-4 top-4 text-red-500 text-xs font-bold flex gap-1"><AlertCircle size={14} /> Required</div>}
          </div>
          <div className="selection-group">
            <label className="group-label"><Flag size={14}/> Priority</label>
            <div className="chips-row">{['Low', 'Medium', 'High'].map(p => (<button key={p} type="button" className={`chip ${data.priority === p ? 'active' : ''} ${p.toLowerCase()}`} onClick={() => setData({...data, priority: p})}>{p}</button>))}</div>
          </div>
          <div className="selection-group">
            <label className="group-label"><Tag size={14}/> Category</label>
            <div className="chips-row">{['Personal', 'Work', 'Study', 'Urgent'].map(t => (<button key={t} type="button" className={`chip outline ${data.tag === t ? 'active' : ''}`} onClick={() => setData({...data, tag: t})}>{t}</button>))}</div>
          </div>
          <div className="selection-group">
             <label className="group-label"><Calendar size={14}/> Due Date</label>
             <div className="chips-row">{['Today', 'Tomorrow', 'Next Week'].map(d => (<button key={d} type="button" className={`chip minimal ${data.due === d ? 'active' : ''}`} onClick={() => setData({...data, due: d})}>{d}</button>))}
             </div>
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="submit-btn-premium">Create Task</motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
}