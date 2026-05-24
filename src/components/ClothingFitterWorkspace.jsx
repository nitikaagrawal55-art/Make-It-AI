import React, { useState } from "react";
import LucideIcon from "./LucideIcon";

const PRESET_MODELS = [
  { id: "model-m1", name: "Sleek Male Athlete", desc: "Athletic-proportions mannequin", gender: "male" },
  { id: "model-f1", name: "Minimalist Female Presenter", desc: "Slim-fit classic style mannequin", gender: "female" },
  { id: "model-u1", name: "Relaxed Gender-Neutral Frame", desc: "Medium-height standard drape mannequin", gender: "unisex" }
];

const PRESET_GARMENTS = [
  { id: "g1", name: "Sherpa Denim Jacket", category: "Tops", color: "Indigo Slate", style: "Sherpa lining wool collar, utility side chest pockets." },
  { id: "g2", name: "Fine Tweed Outer Blanket Coat", category: "Outwear", color: "Oatmeal Melange", style: "Heavy brushed tweed, wide lapel, relaxed double-breasted drape." },
  { id: "g3", name: "AuraSilk Slip Midi Dress", category: "Full Outfits", color: "Emerald Forest", style: "Fine bias cut mulberry silk, delicate cowl neck, spaghetti shoulder cords." },
  { id: "g4", name: "Brushed Cotton Cargo Pants", category: "Bottoms", color: "Sage Khaki", style: "Tapered hem with adjust drawstrings, tactical cargo utility bags." },
];

export default function ClothingFitterWorkspace({
  agent,
  isQuerying,
  onQuerySubmit,
  chatMessages
}) {
  const [selectedModelId, setSelectedModelId] = useState("model-f1");
  const [garmentInput, setGarmentInput] = useState("Tweed coat with sherpa collar and dark buttons");
  const [selectedCategory, setSelectedCategory] = useState("Tops");
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedFit, setSelectedFit] = useState("Oversized");
  const [isSimulatingDrape, setIsSimulatingDrape] = useState(false);
  const [renderLogs, setRenderLogs] = useState([]);
  const [fittedSuccessResponse, setFittedSuccessResponse] = useState(null);

  const handleSimulateFitting = (e) => {
    e.preventDefault();
    if (!garmentInput.trim()) return;

    setIsSimulatingDrape(true);
    setFittedSuccessResponse(null);
    setRenderLogs([]);

    // Step-by-step scanner progression simulations
    const logs = [
      "📷 Analyzing reference model skin tone & chest proportions...",
      "📐 Estimating structural outline layout and drape limits...",
      "🧵 Simulating garment fabric elasticity & gravity coefficients...",
      "✨ Projecting textile colors & light shading coefficients...",
      "🧠 Prompting neural engine for style recommendations..."
    ];

    let current = 0;
    const interval = setInterval(() => {
      if (current < logs.length) {
        setRenderLogs(prev => [...prev, logs[current]]);
        current++;
      } else {
        clearInterval(interval);
        
        // Finalize query triggers to proper AI
        const promptString = `INTERFACE TRIGGER: [Virtual Try On Fitting]
Model Physique: ${PRESET_MODELS.find(m => m.id === selectedModelId)?.name} (${PRESET_MODELS.find(m => m.id === selectedModelId)?.desc})
Garment Category: ${selectedCategory}
Garment Described: "${garmentInput}"
Sizing: ${selectedSize} (Fit Type: ${selectedFit})

Perform a full styling drape critique, structural fit assessment, and secondary matching recommendations.`;
        
        onQuerySubmit(promptString);
        setIsSimulatingDrape(false);
        setFittedSuccessResponse({
          gName: garmentInput,
          gCategory: selectedCategory,
          gSize: selectedSize,
          gFit: selectedFit,
          model: PRESET_MODELS.find(m => m.id === selectedModelId)?.name
        });
      }
    }, 850);
  };

  const activeModel = PRESET_MODELS.find(m => m.id === selectedModelId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[680px] overflow-hidden bg-slate-50/50 p-6">
      
      {/* 1. Left Control Panel: Upload / Presets & Form Controls (6cols) */}
      <div className="lg:col-span-6 flex flex-col justify-between overflow-y-auto pr-1 space-y-4">
        <div className="space-y-4">
          
          {/* Header Title */}
          <div>
            <div className="flex items-center gap-1 bg-indigo-50 text-indigo-800 text-[10px] w-fit font-bold font-mono px-2 py-0.5 rounded-full uppercase mb-1">
              👗 AuraFit Layout Active
            </div>
            <h3 className="text-base font-bold text-slate-900">Virtual Fitting Dashboard</h3>
            <p className="text-slate-500 text-[11px]">Map garment elements onto avatars to preview layout, sizing, and style critique.</p>
          </div>

          {/* Model selection */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              1. Choose Physique Template
            </span>
            <div className="grid grid-cols-3 gap-2">
              {PRESET_MODELS.map(model => {
                const isSelected = model.id === selectedModelId;
                return (
                  <button
                    key={model.id}
                    onClick={() => {
                      setSelectedModelId(model.id);
                      setFittedSuccessResponse(null);
                    }}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${isSelected ? "bg-indigo-50 border-indigo-200 text-indigo-900 shadow-sm" : "bg-white border-slate-150 text-slate-600 hover:bg-slate-50"}`}
                  >
                    <p className="font-bold text-[10px] truncate">{model.name}</p>
                    <p className="text-[8px] text-slate-400 mt-0.5 line-clamp-2 leading-tight">{model.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Garment styling inputs */}
          <div className="space-y-3 p-4 bg-white border border-slate-200 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              2. Describe Garment Design
            </span>
            
            <div className="grid grid-cols-2 gap-2">
              {PRESET_GARMENTS.map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    setGarmentInput(item.name + " (" + item.style + ")");
                    setSelectedCategory(item.category);
                  }}
                  className="p-2 border border-slate-100 hover:border-slate-300 text-slate-600 rounded-lg text-left text-[10px] bg-slate-50/50 truncate cursor-pointer transition-all"
                  type="button"
                >
                  ✨ <strong className="text-slate-700">{item.name}</strong> ({item.category})
                </button>
              ))}
            </div>

            <div className="space-y-1 pt-1">
              <input
                type="text"
                value={garmentInput}
                onChange={(e) => setGarmentInput(e.target.value)}
                placeholder="Describe your clothes to try on (e.g., Red flannel coat...)"
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-indigo-300"
              />
            </div>

            {/* Params options */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <div>
                <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full text-[10px] p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600"
                >
                  <option>Tops</option>
                  <option>Bottoms</option>
                  <option>Outwear</option>
                  <option>Full Outfits</option>
                </select>
              </div>

              <div>
                <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Target Size</label>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full text-[10px] p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600"
                >
                  <option>S</option>
                  <option>M</option>
                  <option>L</option>
                  <option>XL</option>
                </select>
              </div>

              <div>
                <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Fitting Style</label>
                <select
                  value={selectedFit}
                  onChange={(e) => setSelectedFit(e.target.value)}
                  className="w-full text-[10px] p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600"
                >
                  <option>Slim</option>
                  <option>Regular</option>
                  <option>Oversized</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleSimulateFitting}
          disabled={isSimulatingDrape || !garmentInput.trim() || isQuerying}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-3.5 rounded-xl font-bold flex items-center justify-center gap-2 text-xs transition shadow-md cursor-pointer disabled:opacity-50"
        >
          {isSimulatingDrape ? "Projecting textile layers..." : "👗 Generate fitted clothing layout & critique"}
        </button>

      </div>

      {/* 2. Right Interactive Canvas Section (6cols) */}
      <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 flex flex-col overflow-hidden relative shadow-sm">
        
        {isSimulatingDrape ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-900 text-slate-100">
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 border-4 border-indigo-505 rounded-full animate-ping opacity-25" />
              <div className="absolute inset-2 border-2 border-dashed border-indigo-400 rounded-full animate-spin duration-3000" />
              <div className="absolute inset-4 rounded-full bg-indigo-800 flex items-center justify-center text-xl">🧘</div>
            </div>
            
            <h4 className="font-bold text-sm mb-2 animate-pulse">Running Neural Textile Simulation</h4>
            <div className="w-full max-w-xs bg-slate-800 border border-slate-700 p-3 rounded-lg font-mono text-[9px] text-emerald-400 space-y-1">
              {renderLogs.map((log, index) => (
                <div key={index} className="animate-fade-in">{log}</div>
              ))}
              <div className="text-slate-500 animate-pulse">▋ Rendering pixels...</div>
            </div>
          </div>
        ) : fittedSuccessResponse ? (
          <div className="flex-1 flex flex-col justify-between p-6 overflow-y-auto">
            
            {/* Custom Interactive Avatar Mannequin preview */}
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-500 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-505" />
                  Model: {fittedSuccessResponse.model}
                </span>
                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] rounded font-bold uppercase">
                  ACTIVE PREVIEW
                </span>
              </div>

              {/* Graphical representation board */}
              <div className="rounded-xl border border-slate-200 aspect-[16/9] w-full bg-slate-50/50 flex flex-col items-center justify-center p-4 shadow-inner relative overflow-hidden group">
                
                {/* Horizontal Scanline Overlay */}
                <div className="absolute inset-x-0 top-0 h-0.5 bg-indigo-400/40 shadow-md animate-[bounce_4.5s_infinite] pointer-events-none" />

                <div className="text-center space-y-2">
                  <div className="text-4xl">🧥</div>
                  <h4 className="font-bold text-xs text-slate-800">{fittedSuccessResponse.gName}</h4>
                  <p className="text-[10px] text-slate-505 max-w-xs mx-auto leading-normal">
                    Estimated size <strong>{fittedSuccessResponse.gSize}</strong> with <strong>{fittedSuccessResponse.gFit}</strong> draper metrics correctly simulated around the model physique skeleton.
                  </p>
                </div>

                {/* Diagnostics Badge Overlay */}
                <div className="absolute bottom-3 left-3 text-[10px] bg-slate-900 text-white rounded-lg p-2 font-mono flex flex-col gap-0.5 shadow">
                  <div>📏 Alignment: 98% Good</div>
                  <div>🧶 Wrinkle: Elastic Relaxed</div>
                </div>

                <div className="absolute bottom-3 right-3 text-[10px] bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg p-2 font-semibold flex items-center gap-1 shadow">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Matching Outfit Loaded
                </div>
              </div>

              {/* Real critique section from chatMessages */}
              <div className="space-y-2">
                <h4 className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Neural Critique & Fit Analysis</h4>
                
                <div className="border border-indigo-150 rounded-xl p-4 bg-indigo-50/15 max-h-[160px] overflow-y-auto text-xs leading-relaxed text-slate-700 select-text">
                  {chatMessages.length > 2 && chatMessages[chatMessages.length - 1].role === "assistant" ? (
                    chatMessages[chatMessages.length - 1].text.split("\n").map((line, i) => (
                      <p key={i} className="my-1.5">{line}</p>
                    ))
                  ) : (
                    <p className="italic text-slate-400 py-4 text-center">Your AuraFit custom fashion parameters were successfully matched! Read the detailed layout logs and suggestions on the general chat thread.</p>
                  )}
                </div>
              </div>

            </div>

            <button
              onClick={() => setFittedSuccessResponse(null)}
              className="mt-4 text-[11px] font-bold text-slate-450 hover:text-slate-600 block text-center cursor-pointer uppercase tracking-wider"
            >
              ← Reset mannequin blueprint viewport
            </button>

          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/15">
            <div className="h-14 w-14 rounded-full bg-slate-105 border border-slate-200 flex items-center justify-center text-2xl mb-4 text-slate-450">
              👕
            </div>
            <h4 className="font-bold text-xs text-slate-900 mb-1">Interactive Mannequin Screen Empty</h4>
            <p className="text-slate-400 text-[11px] max-w-sm leading-normal mb-1">
              Specify your try-on garment specifications on the left panel, and click calculate to render clothing projects onto custom model proportion structures.
            </p>
          </div>
        )}

      </div>

    </div>
  );
}
