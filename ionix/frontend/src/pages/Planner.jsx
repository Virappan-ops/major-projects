import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../lib/api"; 
import "../styles/Planner.css";

// SVG Icons
const CloseIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const TrashIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;
const PlusIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const ArrowIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>;

const getTodayString = () => new Date().toISOString().split('T')[0];

export default function Planner() {
  const [events, setEvents] = useState([]);
  const [backlog, setBacklog] = useState([]);
  const [backlogInput, setBacklogInput] = useState("");
  const [energyLevel, setEnergyLevel] = useState("neutral");

  // Calendar
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  
  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ 
    title: "", start: 9, duration: 1, type: "purple", date: getTodayString(), tag: "Work", backlogId: null 
  });
  const [editingId, setEditingId] = useState(null);
  const [eventToDelete, setEventToDelete] = useState(null);

  // Time Engine
  const [timeOffset, setTimeOffset] = useState(0);
  const [formattedTime, setFormattedTime] = useState("");
  const [isToday, setIsToday] = useState(true);

  // --- 1. FETCH DATA ---
  useEffect(() => {
    fetchPlannerData();
  }, []);

  const fetchPlannerData = async () => {
    try {
      const { data } = await api.get("/events");
      
      const scheduled = data
        .filter(item => !item.isBacklog)
        .map(item => ({ ...item, id: item._id }));
        
      const inbox = data
        .filter(item => item.isBacklog)
        .map(item => ({ ...item, id: item._id }));

      setEvents(scheduled);
      setBacklog(inbox);
    } catch (error) {
      console.error("Failed to fetch planner data", error);
    }
  };

  // --- ENGINE ---
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = now.getHours();
      const m = now.getMinutes();
      setFormattedTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      if (h < 6) { setTimeOffset(-10); return; }
      const px = ((h - 6) * 90) + ((m / 60) * 90);
      setTimeOffset(px);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();
  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  
  const handleDateClick = (day) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const offset = newDate.getTimezoneOffset();
    const localDate = new Date(newDate.getTime() - (offset*60*1000));
    const dateStr = localDate.toISOString().split('T')[0];
    setSelectedDate(dateStr);
    setIsToday(dateStr === getTodayString());
  };

  const filteredEvents = events.filter(e => e.date === selectedDate);
  const busyPercent = Math.min((filteredEvents.reduce((acc, c) => acc + c.duration, 0) / 12) * 100, 100);

  // --- ACTIONS ---

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    if (!modalData.title.trim()) return;

    try {
      if (editingId) {
        // UPDATE
        const payload = { ...modalData, isBacklog: false };
        const { data } = await api.put(`/events/${editingId}`, payload);
        
        setEvents(events.map(ev => ev.id === editingId ? { ...data, id: data._id } : ev));
        
        if (modalData.backlogId) {
           setBacklog(backlog.filter(b => b.id !== modalData.backlogId));
        }

      } else {
        // CREATE
        const payload = { ...modalData, isBacklog: false };
        const { data } = await api.post("/events", payload);
        setEvents([...events, { ...data, id: data._id }]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving event", error);
    }
  };

  const requestDelete = (id) => { setEventToDelete(id); setIsModalOpen(false); };
  
  const confirmDelete = async () => {
    const id = eventToDelete;
    setEvents(events.filter(ev => ev.id !== id));
    setEventToDelete(null);
    try {
      await api.delete(`/events/${id}`);
    } catch (error) {
      console.error("Error deleting event");
    }
  };

  const handleAddBacklog = async (e) => {
    e.preventDefault();
    if (!backlogInput.trim()) return;

    try {
      const payload = { 
        title: backlogInput, 
        isBacklog: true 
      };
      const { data } = await api.post("/events", payload);
      
      setBacklog([...backlog, { ...data, id: data._id }]);
      setBacklogInput("");
    } catch (error) {
      console.error("Error adding to backlog");
    }
  };

  const handleDeleteBacklog = async (id) => {
    setBacklog(backlog.filter(b => b.id !== id));
    try {
      await api.delete(`/events/${id}`);
    } catch (error) {
      console.error("Error deleting backlog item");
    }
  };

  const moveBacklogToSchedule = (item) => {
    setEditingId(item.id);
    setModalData({ 
        title: item.title, 
        start: 9, 
        duration: 1, 
        type: "blue", 
        date: selectedDate, 
        tag: "Work", 
        backlogId: item.id 
    });
    setIsModalOpen(true);
  };

  const openModal = (hour = 9, event = null) => {
    if (event) { 
        setEditingId(event.id); 
        setModalData({ ...event, backlogId: null }); 
    } else { 
        setEditingId(null); 
        setModalData({ 
            title: "", 
            start: hour, 
            duration: 1, 
            type: "purple", 
            date: selectedDate, 
            tag: "Work", 
            backlogId: null 
        }); 
    }
    setIsModalOpen(true);
  };

  const renderCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysCount = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);
    const todayStr = getTodayString();
    const days = [];
    for (let i = 0; i < startDay; i++) days.push(<div key={`empty-${i}`} className="cal-date empty"></div>);
    for (let i = 1; i <= daysCount; i++) {
      const d = new Date(year, month, i);
      const offset = d.getTimezoneOffset();
      const local = new Date(d.getTime() - (offset*60*1000));
      const dateStr = local.toISOString().split('T')[0];
      days.push(<div key={i} className={`cal-date ${dateStr===todayStr?'today':''} ${dateStr===selectedDate?'selected':''}`} onClick={() => handleDateClick(i)}>{i}</div>);
    }
    return days;
  };
  
  const hours = [6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];

  return (
    <div className="planner-page">
      <div className="sidebar-column">
        <div className="mini-calendar">
          <div className="cal-header">
             <button className="cal-nav-btn" onClick={handlePrevMonth}>←</button>
             <div className="cal-month-title">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</div>
             <button className="cal-nav-btn" onClick={handleNextMonth}>→</button>
          </div>
          <div className="cal-grid">
            {/* FIX: Added index as key to avoid duplicates */}
            {['S','M','T','W','T','F','S'].map((d, i) => <div key={i} className="cal-day-name">{d}</div>)}
            {renderCalendarDays()}
          </div>
        </div>

        <div className="weekly-focus-box">
          <div className="focus-label">Today's Focus</div>
          <input className="focus-input" placeholder="Main Goal..." />
        </div>

        <div className="energy-tracker">
           <button className={`energy-btn ${energyLevel==='low'?'selected':''}`} onClick={()=>setEnergyLevel('low')}>🪫</button>
           <button className={`energy-btn ${energyLevel==='neutral'?'selected':''}`} onClick={()=>setEnergyLevel('neutral')}>☕</button>
           <button className={`energy-btn ${energyLevel==='high'?'selected':''}`} onClick={()=>setEnergyLevel('high')}>⚡</button>
        </div>
      </div>

      <section className="section-card timeline-column">
        <div className="timeline-header-wrapper">
           <div className="timeline-top-row">
             <div>
               <div className="date-large">{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', day: 'numeric' })}</div>
               <div className="date-sub"><span>⛅ 24°C</span> • <span>{filteredEvents.length} Events</span></div>
             </div>
             <button className="add-event-btn" onClick={() => openModal(9)}>+ New Event</button>
           </div>
           <div className="day-progress-container"><div className="day-progress-bar" style={{ width: `${busyPercent}%` }}></div></div>
        </div>
        <div className="timeline-scroll-area">
           {isToday && <div className="current-time-line" style={{ top: `${timeOffset}px` }}><div className="time-badge">{formattedTime}</div></div>}
           {hours.map(hour => (
             <div key={hour} className="time-row">
               <div className="time-label">{hour > 12 ? `${hour-12} PM` : `${hour} ${hour===12 ? 'PM' : 'AM'}`}</div>
               <div className="time-cell" onClick={() => openModal(hour)}>
                 {filteredEvents.filter(ev => Math.floor(ev.start) === hour).map(ev => (
                   <motion.div
                     key={ev.id} layoutId={`event-${ev.id}`}
                     className={`event-block event-${ev.type}`}
                     style={{ height: `${ev.duration * 90 - 10}px`, top: `${(ev.start % 1) * 90 + 5}px` }}
                     onClick={(e) => { e.stopPropagation(); openModal(0, ev); }}
                   >
                     <div className="event-title">{ev.title}</div>
                     <div className="event-meta"><span>{ev.tag}</span><span>{ev.duration}h</span></div>
                   </motion.div>
                 ))}
               </div>
             </div>
           ))}
        </div>
      </section>

      <section className="section-card backlog-column">
        <div className="backlog-header">
           <h2 style={{margin:0}}>Inbox <span style={{opacity:0.5, fontSize:12, fontWeight:400, marginLeft:5}}>(Unscheduled)</span></h2>
           <form onSubmit={handleAddBacklog} className="backlog-input-box">
             <input className="backlog-input" placeholder="Add task..." value={backlogInput} onChange={(e) => setBacklogInput(e.target.value)} />
             <button type="submit" className="backlog-add-btn"><PlusIcon/></button>
           </form>
        </div>
        <div className="backlog-list">
          <AnimatePresence>
            {backlog.map(item => (
              <motion.div layout initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, scale:0.9}} key={item.id} className="backlog-item">
                <span className="backlog-text">{item.title}</span>
                <div className="backlog-actions">
                  <button className="action-btn schedule" onClick={() => moveBacklogToSchedule(item)} title="Schedule"><ArrowIcon/></button>
                  <button className="action-btn delete" onClick={() => handleDeleteBacklog(item.id)} title="Delete"><TrashIcon/></button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      <AnimatePresence>
        {isModalOpen && (
           <div className="confirm-overlay" onClick={() => setIsModalOpen(false)}>
             <motion.div 
               className="planner-modal-content"
               initial={{scale:0.95, opacity:0, y:20}} animate={{scale:1, opacity:1, y:0}} exit={{scale:0.95, opacity:0}}
               onClick={(e) => e.stopPropagation()}
             >
               <div className="modal-header-row">
                 <span className="modal-title">{editingId ? 'Edit Event' : 'New Event'}</span>
                 <button className="btn-icon" onClick={() => setIsModalOpen(false)}><CloseIcon/></button>
               </div>
               <form onSubmit={handleSaveEvent}>
                 <input className="hero-input" placeholder="What are we doing?" autoFocus value={modalData.title} onChange={(e) => setModalData({...modalData, title: e.target.value})} />
                 <div className="form-section">
                   <label className="section-label">When</label>
                   <input type="date" className="premium-input" value={modalData.date} onChange={(e) => setModalData({...modalData, date: e.target.value})} />
                   <div className="split-row">
                      <div style={{flex:1}}><input type="number" className="premium-input" placeholder="Start" min="6" max="23" step="0.5" value={modalData.start} onChange={(e) => setModalData({...modalData, start: parseFloat(e.target.value)})} /></div>
                      <div style={{flex:1}}><input type="number" className="premium-input" placeholder="Hours" min="0.5" max="10" step="0.5" value={modalData.duration} onChange={(e) => setModalData({...modalData, duration: parseFloat(e.target.value)})} /></div>
                   </div>
                 </div>
                 <div className="form-section">
                    <label className="section-label">Category</label>
                    <div className="tag-pills">
                        {['Work', 'Study', 'Meeting', 'Health'].map(tag => (
                          <div key={tag} className={`tag-pill ${modalData.tag === tag ? 'selected' : ''}`} onClick={() => setModalData({...modalData, tag})} style={{color: tag==='Work'?'#8b5cf6': tag==='Study'?'#f59e0b': tag==='Meeting'?'#3b82f6':'#10b981', backgroundColor: modalData.tag === tag ? 'var(--card)' : 'transparent', borderColor: modalData.tag===tag?'currentColor':'var(--border)'}}>{tag}</div>
                        ))}
                    </div>
                    <div className="tag-pills" style={{marginTop:8}}>
                        {['purple', 'blue', 'green', 'orange'].map(c => (
                          <div key={c} onClick={() => setModalData({...modalData, type: c})} style={{width:28, height:28, borderRadius:'50%', cursor:'pointer', background:`var(--event-${c}-bg, ${c==='purple'?'#8b5cf6':c==='blue'?'#3b82f6':c==='green'?'#10b981':'#f59e0b'})`, border: modalData.type===c?'2px solid white':'2px solid transparent'}} />
                        ))}
                    </div>
                 </div>
                 <div className="modal-footer">
                   {editingId ? <button type="button" className="btn-icon delete" onClick={() => requestDelete(editingId)}><TrashIcon/></button> : <div></div>}
                   <button type="submit" className="add-event-btn" style={{padding:'14px 28px', fontSize:14}}>{editingId ? 'Save Changes' : 'Create Event'}</button>
                 </div>
               </form>
             </motion.div>
           </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {eventToDelete && (
          <div className="confirm-overlay">
             <motion.div className="confirm-box" initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}}>
               <h3 className="confirm-title">Delete Event?</h3>
               <p className="confirm-text">This will remove it from your timeline permanently.</p>
               <div className="confirm-actions">
                  <button className="btn-confirm-cancel" onClick={() => setEventToDelete(null)}>Cancel</button>
                  <button className="btn-confirm-delete" onClick={confirmDelete}>Delete</button>
               </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}