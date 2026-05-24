import React, { useState } from "react";
import LucideIcon from "./LucideIcon";

export default function MarketingWorkspace({
  agent,
  isQuerying,
  onQuerySubmit,
  chatMessages
}) {
  const [productDetails, setProductDetails] = useState("A secure digital vault that automatically stores your physical receipt photos and categorizes them for instant tax auditing.");
  const [selectedPlatform, setSelectedPlatform] = useState("Twitter");
  const [selectedTone, setSelectedTone] = useState("Professional");
  const [copiedText, setCopiedText] = useState(false);
  const [likes, setLikes] = useState(482);
  const [reposts, setReposts] = useState(72);
  const [liked, setLiked] = useState(false);

  const handleCreateCopy = (e) => {
    e.preventDefault();
    if (!productDetails.trim()) return;

    const requestPrompt = `INTERFACE TRIGGER: [Marketing Copy Generator]
Product/Service under Focus: "${productDetails}"
Target Platform/Format: ${selectedPlatform}
Communication Tone/Persona: ${selectedTone}

Generate a highly localized sales hook, high-interest body paragraphs, proper tags, and alternative options fully matching your expert training system prompts.`;

    onQuerySubmit(requestPrompt);
    setLiked(false);
    // Randomize engagement metrics for realism
    setLikes(Math.floor(Math.random() * 600) + 120);
    setReposts(Math.floor(Math.random() * 120) + 20);
  };

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  // Extract assistant text for pre-rendering
  const hasResult = chatMessages.length > 2 && chatMessages[chatMessages.length - 1].role === "assistant";
  const rawCopy = hasResult ? chatMessages[chatMessages.length - 1].text : "";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[680px] overflow-hidden bg-slate-50/50 p-6">
      
      {/* 1. Left Control column (6cols) */}
      <div className="lg:col-span-6 flex flex-col justify-between overflow-y-auto pr-1 space-y-4">
        <div className="space-y-4">
          
          {/* Header */}
          <div>
            <div className="flex items-center gap-1 bg-indigo-50 text-indigo-850 text-[10px] w-fit font-bold font-mono px-2 py-0.5 rounded-full uppercase mb-1">
              📣 Marketing Catalyst Active
            </div>
            <h3 className="text-base font-bold text-slate-900">Copy Strategy Launchpad</h3>
            <p className="text-slate-500 text-[11px]">Dial in platforms and tones to generate high-converting text hooks and outlines.</p>
          </div>

          <form onSubmit={handleCreateCopy} className="space-y-4">
            
            {/* Platform selection slider tabs */}
            <div className="space-y-1.5 animate-fade-in">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                1. Select Platform Outlet
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["Twitter", "LinkedIn", "Outbound Email"].map(plat => {
                  const isSelect = plat === selectedPlatform;
                  return (
                    <button
                      type="button"
                      key={plat}
                      onClick={() => setSelectedPlatform(plat)}
                      className={`p-2.5 rounded-xl border font-semibold text-xs transition-all cursor-pointer ${isSelect ? "bg-slate-900 border-slate-900 text-white" : "bg-white border-slate-150 text-slate-500 hover:text-slate-800"}`}
                    >
                      {plat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Campaign details */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                2. Explain Value Proposition
              </label>
              <textarea
                value={productDetails}
                onChange={(e) => setProductDetails(e.target.value)}
                placeholder="What product characteristics or features should we pitch?"
                rows={4}
                className="w-full text-xs p-3.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-indigo-300 resize-none leading-relaxed"
              />
            </div>

            {/* Tone Selector */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                3. Choose Pitch Persona
              </label>
              <select
                value={selectedTone}
                onChange={(e) => setSelectedTone(e.target.value)}
                className="w-full text-xs p-3 bg-white border border-slate-200 rounded-xl text-slate-700 outline-none"
              >
                <option>Professional</option>
                <option>Witty & Cheeky</option>
                <option>High Urgency & Hype</option>
                <option>Educational Storyteller</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isQuerying || !productDetails.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-3.5 rounded-xl font-bold flex items-center justify-center gap-2 text-xs transition shadow-md cursor-pointer disabled:opacity-50"
            >
              {isQuerying ? "Tuning copy elements..." : "🚀 Pitch & Generate Content Stream"}
            </button>

          </form>

        </div>

        <p className="text-[9px] text-slate-400 text-center">
          Pitches are structured natively based on the instructions stored inside `activeAgent.customInstructions`.
        </p>
      </div>

      {/* 2. Right Mockup Frame Area (6cols) */}
      <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 flex flex-col justify-between overflow-y-auto p-6 shadow-sm">
        
        {hasResult ? (
          <div className="space-y-6 flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  📱 Generated Social Mockup
                </span>
                
                <button
                  onClick={() => handleCopyToClipboard(rawCopy)}
                  className="px-2.5 py-1 text-[10px] font-bold text-indigo-600 border border-indigo-100 hover:border-indigo-250 bg-indigo-50/20 rounded-lg cursor-pointer transition"
                >
                  {copiedText ? "✓ Copied!" : "📋 Copy raw text"}
                </button>
              </div>

              {/* Pixel-perfect platform mockup card */}
              <div className="rounded-xl border border-slate-150 bg-white p-5 shadow-sm space-y-3.5 select-text">
                
                {/* Simulated profile */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-mono font-bold flex items-center justify-center text-xs shrink-0 select-none">
                    AI
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 inline-flex items-center gap-1.5">
                      Your Business Profile
                      <span className="h-3 w-3 inline-flex bg-blue-500 text-[8px] text-white rounded-full items-center justify-center">✓</span>
                    </h4>
                    <p className="text-[9px] text-slate-400 font-mono">@brandoutcomes · Sponsored</p>
                  </div>
                </div>

                {/* Main output text */}
                <div className="text-xs text-slate-800 leading-relaxed font-sans whitespace-pre-wrap select-text selection:bg-indigo-100">
                  {rawCopy}
                </div>

                {/* Simulated Platform Actions bar */}
                <div className="flex items-center gap-6 border-t border-slate-100 pt-3 text-[10px] text-slate-400 select-none">
                  <button
                    onClick={() => {
                      if (!liked) {
                        setLikes(prev => prev + 1);
                        setLiked(true);
                      } else {
                        setLikes(prev => prev - 1);
                        setLiked(false);
                      }
                    }}
                    className={`inline-flex items-center gap-1 transition ${liked ? "text-red-500" : "hover:text-red-500"}`}
                  >
                    <span>❤️</span>
                    <strong>{likes}</strong>
                  </button>

                  <button
                    onClick={() => setReposts(prev => prev + 1)}
                    className="inline-flex items-center gap-1 hover:text-green-500 transition"
                  >
                    <span>🔄</span>
                    <strong>{reposts}</strong>
                  </button>

                  <span className="inline-flex items-center gap-1">
                    <span>💬</span>
                    <strong>{Math.floor(likes / 10)}</strong>
                  </span>
                </div>

              </div>
            </div>

            <p className="text-[9px] text-slate-400 italic text-center w-full">
              Mockup models preview exactly how generated outputs map relative to Standard feeds sizes.
            </p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center bg-slate-50/20 rounded-xl border border-dashed border-slate-150 p-6">
            <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl mb-4">
              📝
            </div>
            <h4 className="font-bold text-xs text-slate-900 mb-1">Social Feed Template Empty</h4>
            <p className="text-slate-400 text-[11px] max-w-sm leading-normal">
              Enter details and launch the content stream. The structured text outputs will render into a simulated smartphone platform feed layout.
            </p>
          </div>
        )}

      </div>

    </div>
  );
}
