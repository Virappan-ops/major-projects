import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, Layers, Zap, UploadCloud, RotateCw, 
  CheckCircle, Copy, Sparkles, X, Loader2, Download, Trash2, GripVertical 
} from "lucide-react";
import { PDFDocument } from 'pdf-lib'; // For Client-side PDF Magic
import api from "../lib/api";
import "../styles/PdfTools.css";

export default function PdfTools() {
  const [activeTool, setActiveTool] = useState(null);
  const [files, setFiles] = useState([]); // Array for Merge
  const [loading, setLoading] = useState(false);
  
  // Results
  const [aiResult, setAiResult] = useState(""); // For Text/Summary
  const [downloadUrl, setDownloadUrl] = useState(null); // For Merged/Rotated PDF
  
  const fileInputRef = useRef(null);

  // --- TOOLS CONFIG ---
  const tools = [
    {
      id: "ocr",
      title: "AI OCR (Image to Text)",
      desc: "Extract text from Images/PDFs using AI.",
      icon: <Sparkles size={24} className="text-amber-400" />,
      type: "ai", 
      accept: "image/*",
      multiple: false
    },
    {
      id: "summarize",
      title: "AI Summarizer",
      desc: "Get insights from document images.",
      icon: <Zap size={24} className="text-indigo-400" />,
      type: "ai",
      accept: "image/*", 
      multiple: false
    },
    {
      id: "merge",
      title: "Merge PDFs",
      desc: "Combine multiple PDFs into one.",
      icon: <Layers size={24} className="text-emerald-400" />,
      type: "utility",
      accept: "application/pdf",
      multiple: true
    },
    {
      id: "rotate",
      title: "Rotate PDF",
      desc: "Rotate all pages 90 degrees.",
      icon: <RotateCw size={24} className="text-blue-400" />,
      type: "utility",
      accept: "application/pdf",
      multiple: false
    }
  ];

  // --- 1. FILE HANDLING (Drag & Drop + Select) ---
  const handleFiles = (newFiles) => {
    const currentTool = tools.find(t => t.id === activeTool);
    if (!currentTool) return;

    let validFiles = Array.from(newFiles);

    // Filter logic based on tool
    if (!currentTool.multiple) {
        validFiles = [validFiles[0]]; // Take only the first one
    }

    setFiles(prev => currentTool.multiple ? [...prev, ...validFiles] : validFiles);
    setAiResult("");
    setDownloadUrl(null);
  };

  const onDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  // --- 2. UTILITY FUNCTIONS (Merge/Rotate - Client Side) ---
  const processUtility = async () => {
    if (files.length === 0) return;
    setLoading(true);

    try {
        const doc = await PDFDocument.create();

        if (activeTool === "merge") {
            for (const file of files) {
                const arrayBuffer = await file.arrayBuffer();
                const srcDoc = await PDFDocument.load(arrayBuffer);
                const copiedPages = await doc.copyPages(srcDoc, srcDoc.getPageIndices());
                copiedPages.forEach((page) => doc.addPage(page));
            }
        } 
        else if (activeTool === "rotate") {
            const arrayBuffer = await files[0].arrayBuffer();
            const srcDoc = await PDFDocument.load(arrayBuffer);
            const pages = srcDoc.getPages();
            pages.forEach(page => {
                const rotation = page.getRotation().angle;
                page.setRotation({ type: 'degrees', angle: rotation + 90 });
            });
            // Rotate logic needs to copy back to new doc or save srcDoc
            // Simpler: Just save srcDoc for rotate
            const pdfBytes = await srcDoc.save();
            const blob = new Blob([pdfBytes], { type: "application/pdf" });
            setDownloadUrl(window.URL.createObjectURL(blob));
            setLoading(false);
            return; 
        }

        const pdfBytes = await doc.save();
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        setDownloadUrl(window.URL.createObjectURL(blob));

    } catch (error) {
        console.error("PDF Error:", error);
        alert("Failed to process PDF. Make sure files are not password protected.");
    } finally {
        setLoading(false);
    }
  };

  // --- 3. AI FUNCTIONS (OCR/Summarize - Server Side) ---
  const processAI = async () => {
    if (files.length === 0) return;
    setLoading(true);
    setAiResult("");

    try {
        const file = files[0];
        const reader = new FileReader();
        
        reader.onload = async () => {
            const base64Data = reader.result; // Data URL
            
            let prompt = "";
            if (activeTool === "ocr") prompt = "Extract text from this image accurately.";
            if (activeTool === "summarize") prompt = "Summarize this document image in bullet points.";

            try {
                const { data } = await api.post("/chat", {
                    prompt: prompt,
                    image: base64Data 
                });
                setAiResult(data.reply);
            } catch (err) {
                setAiResult("Error: Backend connection failed or file too large.");
            } finally {
                setLoading(false);
            }
        };
        reader.readAsDataURL(file);

    } catch (error) {
        setLoading(false);
    }
  };

  // --- RENDER HELPERS ---
  const currentToolConfig = tools.find(t => t.id === activeTool);

  return (
    <div className="pdf-page custom-scrollbar">
      
      {/* HEADER */}
      <div className="pdf-header">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-emerald-400">
           PDF & AI Studio
        </h1>
        <p className="opacity-70 mt-2">Merge, Rotate, or Ask AI to read your documents.</p>
      </div>

      <div className="pdf-layout">
        
        {/* --- LEFT: TOOLS MENU --- */}
        <div className={`tools-section ${activeTool ? 'shrink' : ''}`}>
          <div className="bento-grid">
            {tools.map((tool) => (
              <motion.div
                key={tool.id}
                layoutId={`tool-${tool.id}`}
                onClick={() => { 
                    setActiveTool(tool.id); 
                    setFiles([]); 
                    setAiResult(""); 
                    setDownloadUrl(null); 
                }}
                className={`bento-card ${activeTool === tool.id ? 'active' : ''}`}
                whileHover={{ y: -4 }}
              >
                <div className="flex justify-between items-start">
                    <div className="bg-white/5 p-3 rounded-xl">{tool.icon}</div>
                    {tool.type === 'ai' && <span className="ai-badge">AI</span>}
                </div>
                <div>
                    <h3 className="font-bold text-lg">{tool.title}</h3>
                    <p className="text-sm opacity-60">{tool.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* --- RIGHT: WORKSPACE --- */}
        <AnimatePresence>
          {activeTool && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="workspace-section"
            >
              {/* Toolbar Header */}
              <div className="workspace-header">
                 <div className="flex items-center gap-3">
                    <button onClick={() => setActiveTool(null)} className="back-btn"><X/></button>
                    <h2 className="text-xl font-bold">{currentToolConfig.title}</h2>
                 </div>
                 {currentToolConfig.multiple && <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded">Multi-file supported</span>}
              </div>

              <div className="workspace-body custom-scrollbar">
                 
                 {/* 1. DROP ZONE */}
                 {files.length === 0 || currentToolConfig.multiple ? (
                    <div 
                        className="drop-zone"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={onDrop}
                        onClick={() => fileInputRef.current.click()}
                    >
                        <UploadCloud size={40} className="mb-4 opacity-50"/>
                        <h3>Click or Drop files here</h3>
                        <p className="text-xs opacity-50 mt-2">
                           Supports {currentToolConfig.accept === 'image/*' ? 'Images (JPG, PNG)' : 'PDFs'}
                        </p>
                        <input 
                           type="file" 
                           ref={fileInputRef} 
                           onChange={(e) => handleFiles(e.target.files)} 
                           accept={currentToolConfig.accept} 
                           multiple={currentToolConfig.multiple} 
                           hidden 
                        />
                    </div>
                 ) : null}

                 {/* 2. FILE LIST (For Merge/Utility) */}
                 {files.length > 0 && (
                     <div className="file-list-container">
                        {files.map((f, i) => (
                            <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} key={i} className="file-item-card">
                                <div className="flex items-center gap-3">
                                    <GripVertical size={16} className="opacity-30 cursor-grab"/>
                                    <div className="p-2 bg-white/5 rounded-lg"><FileText size={20}/></div>
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-bold truncate w-40">{f.name}</p>
                                        <p className="text-xs opacity-50">{(f.size/1024/1024).toFixed(2)} MB</p>
                                    </div>
                                </div>
                                <button onClick={() => removeFile(i)} className="p-2 hover:bg-red-500/20 text-red-500 rounded-lg"><Trash2 size={16}/></button>
                            </motion.div>
                        ))}
                     </div>
                 )}

                 {/* 3. ACTION BUTTONS */}
                 {files.length > 0 && !loading && !aiResult && !downloadUrl && (
                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="primary-action-btn"
                        onClick={currentToolConfig.type === 'ai' ? processAI : processUtility}
                    >
                        <Sparkles size={18}/> 
                        {currentToolConfig.type === 'ai' ? 'Analyze with AI' : 'Process Files'}
                    </motion.button>
                 )}

                 {loading && (
                    <div className="loading-state">
                        <Loader2 size={30} className="animate-spin text-indigo-500"/>
                        <p>Processing...</p>
                    </div>
                 )}

                 {/* 4. RESULTS (Download or Text) */}
                 
                 {/* UTILITY RESULT (Download) */}
                 {downloadUrl && (
                     <motion.div initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} className="success-box">
                        <CheckCircle size={40} className="text-emerald-400 mb-2"/>
                        <h3>Ready to Download!</h3>
                        <a href={downloadUrl} download={`processed_ionix_${Date.now()}.pdf`} className="download-btn">
                            <Download size={18}/> Download File
                        </a>
                        <button onClick={() => {setFiles([]); setDownloadUrl(null);}} className="text-xs mt-4 opacity-50 hover:opacity-100 underline">Start Over</button>
                     </motion.div>
                 )}

                 {/* AI RESULT (Text) */}
                 {aiResult && (
                     <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="ai-result-box">
                        <div className="result-header">
                            <span className="font-bold flex items-center gap-2 text-amber-400"><Sparkles size={14}/> AI Result</span>
                            <button onClick={() => navigator.clipboard.writeText(aiResult)} className="copy-icon-btn"><Copy size={14}/></button>
                        </div>
                        <div className="result-text custom-scrollbar">{aiResult}</div>
                     </motion.div>
                 )}

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}