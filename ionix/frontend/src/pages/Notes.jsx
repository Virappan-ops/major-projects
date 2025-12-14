import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Trash2, X, Check, Edit3, Search, Calendar, 
  ChevronLeft, ChevronRight, Grid, Maximize 
} from "lucide-react";
import api from "../lib/api"; 
import "../styles/Notes.css";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Logic Same as your original code
  const [newNoteData, setNewNoteData] = useState({ 
    title: "", 
    pages: [""], 
    size: "square" 
  });

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const { data } = await api.get("/notes");
      const mappedData = data.map(n => ({
        ...n,
        id: n._id,
        date: new Date(n.updatedAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric' })
      }));
      setNotes(mappedData);
    } catch (error) {
      console.error("Error fetching notes", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!newNoteData.title.trim()) return;

    try {
      const { data } = await api.post("/notes", newNoteData);
      const newNote = { ...data, id: data._id, date: "Just now" };
      setNotes([newNote, ...notes]);
      setIsCreateOpen(false);
      setNewNoteData({ title: "", pages: [""], size: "square" }); 
    } catch (error) {
      console.error("Error creating note", error);
    }
  };

  const handleUpdate = async (updatedUI_Note) => {
    setNotes(notes.map(n => n.id === updatedUI_Note.id ? updatedUI_Note : n));
    if (selectedNote && selectedNote.id === updatedUI_Note.id) {
        setSelectedNote(updatedUI_Note);
    }
    try {
      await api.put(`/notes/${updatedUI_Note.id}`, {
        title: updatedUI_Note.title,
        pages: updatedUI_Note.pages,
        size: updatedUI_Note.size
      });
    } catch (error) {}
  };

  const confirmDelete = async () => {
    const id = noteToDelete;
    setNotes(notes.filter(n => n.id !== id));
    setNoteToDelete(null); 
    if (selectedNote?.id === id) setSelectedNote(null);
    try { await api.delete(`/notes/${id}`); } catch (error) {}
  };

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (n.pages[0] && n.pages[0].toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="notes-layout">
      
      {/* --- LEFT SIDEBAR (Sticky & Glowing Button) --- */}
      <aside className="notes-sidebar">
        <div className="sidebar-header">
           <h2 className="text-2xl font-bold" style={{ color: "var(--text)" }}>My Notes</h2>
           <p className="text-xs font-medium opacity-60" style={{ color: "var(--subtext)" }}>
             {notes.length} ideas collected
           </p>
        </div>

        {/* GLOWING AMBER BUTTON */}
        <motion.button 
           whileHover={{ scale: 1.02 }}
           whileTap={{ scale: 0.98 }}
           className="amber-glow-btn"
           onClick={() => setIsCreateOpen(true)}
        >
           <Plus size={24} strokeWidth={3} />
           <span>New Note</span>
        </motion.button>

        <div className="sidebar-search-wrapper">
           <Search size={16} className="search-icon"/>
           <input 
              placeholder="Search notes..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="sidebar-search-input"
           />
        </div>
      </aside>

      {/* --- RIGHT CONTENT (Scrollable Grid) --- */}
      <main className="notes-main-area custom-scrollbar">
        <div className="notes-masonry-grid">
          <AnimatePresence>
            {filteredNotes.map((note) => (
              <NoteCard 
                key={note.id} 
                note={note} 
                onClick={() => setSelectedNote(note)}
                onDeleteRequest={() => setNoteToDelete(note.id)} 
              />
            ))}
          </AnimatePresence>

          {!loading && filteredNotes.length === 0 && (
            <div className="empty-placeholder">
               <div className="opacity-20 text-6xl mb-4">📝</div>
               <p>No notes found.</p>
            </div>
          )}
        </div>
      </main>

      {/* --- MODALS (Functionality Preserved) --- */}
      
      {/* 1. EXPANDED NOTE (VIEW/EDIT) */}
      <AnimatePresence>
        {selectedNote && (
          <ExpandedNote 
            note={selectedNote} 
            close={() => setSelectedNote(null)} 
            updateNote={handleUpdate} 
            onDeleteRequest={() => setNoteToDelete(selectedNote.id)}
          />
        )}
      </AnimatePresence>

      {/* 2. DELETE CONFIRMATION */}
      <AnimatePresence>
        {noteToDelete && (
          <ConfirmModal 
            close={() => setNoteToDelete(null)}
            confirm={confirmDelete} 
          />
        )}
      </AnimatePresence>

      {/* 3. CREATE NOTE (With Big Input & Size Selector) */}
      <AnimatePresence>
        {isCreateOpen && (
          <CreateModal 
            close={() => setIsCreateOpen(false)}
            submit={handleSave} 
            data={newNoteData}
            setData={setNewNoteData}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// --- SUB COMPONENTS ---

function NoteCard({ note, onClick, onDeleteRequest }) {
  return (
    <motion.div
      layoutId={`note-${note.id}`}
      className={`note-card ${note.size}`} // Size logic retained
      onClick={onClick}
      whileHover={{ y: -4 }}
    >
      <div className="note-card-header">
         <h3 className="note-title-text line-clamp-1">{note.title}</h3>
         <button className="mini-delete-btn" onClick={(e) => { e.stopPropagation(); onDeleteRequest(); }}>
            <Trash2 size={14} />
         </button>
      </div>

      <div className="note-body-preview custom-scrollbar">
        {note.pages && note.pages[0] ? note.pages[0] : <span className="opacity-40 italic">Empty...</span>}
      </div>
      
      <div className="note-card-footer">
        <span className="flex items-center gap-1 opacity-60"><Calendar size={10}/> {note.date}</span>
        {note.pages?.length > 1 && <span className="page-badge">{note.pages.length} Pages</span>}
      </div>
    </motion.div>
  );
}

function CreateModal({ close, submit, data, setData }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [error, setError] = useState("");

  const handleCreate = (e) => {
    e.preventDefault();
    if (!data.title.trim()) { setError("Title is required"); return; }
    submit(e);
  };

  // Logic for Pages from your code
  const handlePageContentChange = (val) => {
    const updatedPages = [...data.pages];
    updatedPages[currentPage] = val;
    setData({ ...data, pages: updatedPages });
  };
  
  const addNewPage = () => {
    const updatedPages = [...data.pages, ""];
    setData({ ...data, pages: updatedPages });
    setCurrentPage(updatedPages.length - 1);
  };
  
  const handleDeletePage = () => {
    if (data.pages.length <= 1) { setData({ ...data, pages: [""] }); return; }
    const updatedPages = data.pages.filter((_, idx) => idx !== currentPage);
    setData({ ...data, pages: updatedPages });
    if (currentPage >= updatedPages.length) setCurrentPage(updatedPages.length - 1);
  };

  return (
    <div className="modal-overlay" onClick={close}>
      <motion.div 
        className="create-modal-card"
        initial={{ scale: 0.95, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header-row">
           <h3>Create Note</h3>
           <button onClick={close} className="icon-btn-close"><X size={20}/></button>
        </div>
        
        <form onSubmit={handleCreate} className="create-form">
          <input 
             className="create-title-input" 
             placeholder="Note Title..." 
             value={data.title} 
             onChange={(e) => setData({ ...data, title: e.target.value })} 
             autoFocus 
          />
          
          {/* BIG TEXT AREA FOR CONTENT */}
          <textarea 
             className="create-content-area custom-scrollbar" 
             placeholder={`Writing on Page ${currentPage + 1}...`} 
             value={data.pages[currentPage]} 
             onChange={(e) => handlePageContentChange(e.target.value)} 
          />

          {/* Pagination Controls inside Create Modal */}
          <div className="pagination-bar">
             <button type="button" onClick={() => setCurrentPage(c => c - 1)} disabled={currentPage === 0}><ChevronLeft size={16}/></button>
             <span className="text-xs font-bold uppercase tracking-wider opacity-60">Page {currentPage + 1}</span>
             <button type="button" onClick={() => setCurrentPage(c => c + 1)} disabled={currentPage === data.pages.length - 1}><ChevronRight size={16}/></button>
             
             <div className="flex gap-2 ml-4">
                 <button type="button" className="small-action-btn" onClick={addNewPage}><Plus size={14}/> Add Page</button>
                 {data.pages.length > 1 && (
                     <button type="button" className="small-action-btn delete" onClick={handleDeletePage}><Trash2 size={14}/></button>
                 )}
             </div>
          </div>

          <div className="modal-footer-row">
             {/* Size Selector Logic Retained */}
             <div className="size-options">
               <span className="text-[10px] uppercase font-bold opacity-50 mr-2">Size:</span>
               {['square', 'wide', 'tall', 'big'].map(size => (
                 <button 
                    type="button" 
                    key={size} 
                    onClick={() => setData({...data, size})} 
                    className={`size-chip ${size} ${data.size === size ? 'active' : ''}`}
                 >
                   {size}
                 </button>
               ))}
             </div>
             
             <button type="submit" className="create-submit-btn">
                Save Note
             </button>
          </div>
          {error && <p className="error-text">{error}</p>}
        </form>
      </motion.div>
    </div>
  );
}

// Logic same as your ExpandedNote, just styled
function ExpandedNote({ note, close, updateNote, onDeleteRequest }) {
  const [pageIndex, setPageIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const pages = note.pages || [""];

  const handlePageChange = (val) => {
    const newPages = [...pages];
    newPages[pageIndex] = val;
    updateNote({ ...note, pages: newPages });
  };

  return (
    <div className="modal-overlay" onClick={close}>
      <motion.div layoutId={`note-${note.id}`} className="expanded-card-glass" onClick={(e) => e.stopPropagation()}>
        <div className="expanded-top-bar">
          {isEditing ? (
             <input className="expanded-title-input" value={note.title} onChange={(e) => updateNote({...note, title: e.target.value})} />
          ) : (
             <h2 className="text-xl font-bold">{note.title}</h2>
          )}
          <div className="actions">
             <button onClick={() => setIsEditing(!isEditing)} className={`action-icon ${isEditing ? 'active':''}`}>
               {isEditing ? <Check size={18}/> : <Edit3 size={18}/>}
             </button>
             <button onClick={onDeleteRequest} className="action-icon delete"><Trash2 size={18}/></button>
             <button onClick={close} className="action-icon"><X size={18}/></button>
          </div>
        </div>

        <div className="expanded-body">
           {isEditing ? (
             <textarea className="expanded-textarea custom-scrollbar" value={pages[pageIndex]} onChange={(e) => handlePageChange(e.target.value)} autoFocus />
           ) : (
             <div className="expanded-view custom-scrollbar">{pages[pageIndex] || <span className="opacity-50">Empty page</span>}</div>
           )}
        </div>

        <div className="pagination-bar">
           <button onClick={()=>setPageIndex(p=>p-1)} disabled={pageIndex===0}><ChevronLeft size={18}/></button>
           <span className="text-xs font-bold uppercase opacity-60">Page {pageIndex + 1} of {pages.length}</span>
           <button onClick={()=>setPageIndex(p=>p+1)} disabled={pageIndex===pages.length-1}><ChevronRight size={18}/></button>
           
           {isEditing && (
             <button className="small-action-btn ml-4" onClick={() => {
                const newPages = [...pages, ""];
                updateNote({...note, pages: newPages});
                setPageIndex(newPages.length - 1);
                setIsEditing(true);
             }}>+ Add Page</button>
           )}
        </div>
      </motion.div>
    </div>
  );
}

function ConfirmModal({ close, confirm }) {
  return (
    <div className="modal-overlay" style={{zIndex: 9999}}>
      <motion.div className="confirm-box" initial={{scale:0.9}} animate={{scale:1}}>
        <h3 className="font-bold text-lg mb-2 text-[var(--text)]">Delete Note?</h3>
        <p className="text-sm opacity-60 mb-6 text-[var(--text)]">This action cannot be undone.</p>
        <div className="flex gap-4 justify-center">
          <button className="cancel-btn" onClick={close}>Cancel</button>
          <button className="delete-btn-confirm" onClick={confirm}>Delete</button>
        </div>
      </motion.div>
    </div>
  );
}