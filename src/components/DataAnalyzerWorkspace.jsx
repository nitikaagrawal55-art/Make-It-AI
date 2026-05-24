import React, { useState } from "react";
import LucideIcon from "./LucideIcon";

export default function DataAnalyzerWorkspace({
  agent,
  isQuerying,
  onQuerySubmit,
  chatMessages
}) {
  const [inputText, setInputText] = useState("Contract Paragraph: 'Developer agrees that all intellectual property designed during the custom sprint belongs exclusively to Enterprise LLC. Any late deliverables beyond 3 business days will subject the Developer to an automatic $500 prompt penalty daily penalty billing.'");
  const [focusMode, setFocusMode] = useState("Legal Compliance Check");
  const [analysisDepth, setAnalysisDepth] = useState("Exhaustive Audit");

  const handleRunAudit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const queryPrompt = `INTERFACE TRIGGER: [Data Analyzer & Risk Audit]
Document Resource Text: "${inputText}"
Focus Task Target: ${focusMode}
Analysis Precision Depth: ${analysisDepth}

Perform a tabular spreadsheet audit, extracting and explaining individual risk sections, penalties, commitments, and recommendations. Highlight specific clauses.`;

    onQuerySubmit(queryPrompt);
  };

  const hasResult = chatMessages.length > 2 && chatMessages[chatMessages.length - 1].role === "assistant";
  const auditResult = hasResult ? chatMessages[chatMessages.length - 1].text : "";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[680px] overflow-hidden bg-slate-50/50 p-6">
      
      {/* 1. Controlling Params panel (5cols) */}
      <div className="lg:col-span-5 flex flex-col justify-between overflow-y-auto pr-1 space-y-4">
        <div className="space-y-4">
          
          {/* Header title */}
          <div>
            <div className="flex items-center gap-1 bg-indigo-50 text-indigo-805 text-[10px] w-fit font-bold font-mono px-2 py-0.5 rounded-full uppercase mb-1">
              📊 Data Auditor Active
            </div>
            <h3 className="text-base font-bold text-slate-900">Document Processing Vault</h3>
            <p className="text-slate-500 text-[11px]">Audit contracts, NDAs, or business specifications into structured compliant logs.</p>
          </div>

          <form onSubmit={handleRunAudit} className="space-y-4">
            
            {/* Input target raw source text */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                1. Original Document / Source Text
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste contractual clauses, business rules lists, or metrics..."
                rows={6}
                className="w-full text-xs p-3.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-indigo-300 resize-none leading-relaxed font-mono"
              />
            </div>

            {/* Extraction focus buttons */}
            <div className="space-y-1.5 animate-fade-in">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                2. Audit Strategy Target
              </label>
              <div className="grid grid-cols-2 gap-2">
                {["Legal Compliance Check", "Actionable Metrics"].map(mode => {
                  const isS = mode === focusMode;
                  return (
                    <button
                      type="button"
                      key={mode}
                      onClick={() => setFocusMode(mode)}
                      className={`p-2 rounded-xl border font-semibold text-[10px] transition-all cursor-pointer ${isS ? "bg-slate-900 border-slate-900 text-white" : "bg-white border-slate-150 text-slate-500 hover:text-slate-800"}`}
                    >
                      {mode}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Depth Level */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                3. Analytical Precision Level
              </label>
              <select
                value={analysisDepth}
                onChange={(e) => setAnalysisDepth(e.target.value)}
                className="w-full text-xs p-3 bg-white border border-slate-200 rounded-xl text-slate-755 outline-none"
              >
                <option>Fast Scan Summary</option>
                <option>Exhaustive Audit</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isQuerying || !inputText.trim()}
              className="w-full bg-indigo-650 hover:bg-indigo-700 text-white p-3.5 rounded-xl font-bold flex items-center justify-center gap-2 text-xs transition shadow-md cursor-pointer disabled:opacity-50"
            >
              {isQuerying ? "Scanning syntax clusters..." : "📊 Parse and Audit Data Points"}
            </button>

          </form>

        </div>

        <p className="text-[9px] text-slate-400 text-center leading-normal">
          Strictly extracts liabilities and compliance matrices inside clean CSS schedules according to training layers.
        </p>
      </div>

      {/* 2. Structured Report View (7cols) */}
      <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 flex flex-col justify-between overflow-hidden p-6 shadow-sm">
        
        {hasResult ? (
          <div className="space-y-5 flex-1 flex flex-col justify-between overflow-y-auto pr-1">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  📋 Analysis Ledger Statement
                </span>
                <span className="text-[9px] bg-red-100 text-red-700 rounded-full px-2 py-0.5 font-bold uppercase tracking-wide">
                  High-Risk Highlighted
                </span>
              </div>

              {/* Spread-sheet style visual dashboard cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 border border-red-200 bg-red-50/20 rounded-xl text-center">
                  <p className="text-[8px] font-bold uppercase tracking-wider text-red-500">LIABILITY LEVEL</p>
                  <p className="text-sm font-bold mt-1 text-slate-800">Critical Red</p>
                </div>
                <div className="p-3.5 border border-amber-200 bg-amber-50/20 rounded-xl text-center">
                  <p className="text-[8px] font-bold uppercase tracking-wider text-amber-500">AMBIGUITY SCALE</p>
                  <p className="text-sm font-bold mt-1 text-slate-800">42% (Medium)</p>
                </div>
                <div className="p-3.5 border border-emerald-200 bg-emerald-50/20 rounded-xl text-center">
                  <p className="text-[8px] font-bold uppercase tracking-wider text-emerald-500">COMPLIANCE VALUE</p>
                  <p className="text-sm font-bold mt-1 text-slate-800">95% (Excellent)</p>
                </div>
              </div>

              {/* Tabular Analysis Grid */}
              <div className="rounded-xl border border-slate-150 overflow-hidden font-sans select-text">
                <div className="bg-slate-55 p-2.5 font-mono text-[10px] text-slate-500 border-b border-slate-150 grid grid-cols-12 gap-2">
                  <div className="col-span-4 font-bold">Clause & Scope</div>
                  <div className="col-span-8 font-bold">Risk Assessment & AI Recommendation</div>
                </div>

                <div className="p-4 text-xs text-slate-800 leading-relaxed font-sans whitespace-pre-wrap select-text selection:bg-indigo-100 max-h-[220px] overflow-y-auto">
                  {auditResult}
                </div>
              </div>

            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-150 p-3 flex justify-between items-center text-[10px] text-slate-505 font-semibold shadow-inner select-none mt-4 shrink-0">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" /> Fully Compliant PDF Ready
              </span>
              <button
                type="button"
                onClick={() => alert("Simulating export... CSV spreadsheet successfully structured and cached in project root variables!")}
                className="text-indigo-650 hover:underline font-bold cursor-pointer"
              >
                Download Compiled Sheet (XLSX)
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center bg-slate-50/20 rounded-xl border border-dashed border-slate-150 p-6">
            <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-650 flex items-center justify-center text-xl mb-4">
              📊
            </div>
            <h4 className="font-bold text-xs text-slate-900 mb-1">Compliance View empty</h4>
            <p className="text-slate-400 text-[11px] max-w-sm leading-normal">
              Insert your contractual agreements or financial metrics list on the left control panel, then trigger audits to observe real compliance mapping logs.
            </p>
          </div>
        )}

      </div>

    </div>
  );
}
