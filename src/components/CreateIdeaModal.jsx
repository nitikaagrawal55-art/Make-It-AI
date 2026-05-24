import React, { useState } from "react";
import LucideIcon from "./LucideIcon";

export default function CreateIdeaModal({
  isOpen,
  onClose,
  onSubmit,
  userEmail,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState(4.99);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    onSubmit(title.trim(), description.trim(), budget);
    setTitle("");
    setDescription("");
    setBudget(4.99);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-gray-100 animate-slide-up">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between border-b border-gray-50 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <LucideIcon name="Brain" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Request a Custom AI Solution</h3>
              <p className="text-xs text-gray-400">Share your friction points so the team or users can build it</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition"
          >
            <LucideIcon name="X" size={18} />
          </button>
        </div>

        {/* Suggestion Info */}
        <div className="mb-4 rounded-xl bg-orange-50/50 p-3.5 border border-orange-100/50 text-xs leading-relaxed text-orange-900">
          <div className="flex gap-2 items-start">
            <LucideIcon name="Sparkles" size={14} className="mt-0.5 text-orange-600 shrink-0" />
            <span>
              <strong>Passive Commission Benefit:</strong> If your suggested problem concept is selected and built as an agent by another creator, you will automatically receive an <strong>initial 30% revenue-share commission</strong> of every subscription paid by active premium library users!
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
              Title of Problem Concept
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Real-time Twitch Chat Sentiment Indexer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-violet-300 focus:bg-white focus:ring-2 focus:ring-violet-100"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
              Detailed Description of Problem Faced
            </label>
            <textarea
              required
              rows={4}
              placeholder="Explain the tedious task, what apps you currently juggle, and exactly what output filters or workflow templates you expect an AI Agent to automate for you..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-violet-300 focus:bg-white focus:ring-2 focus:ring-violet-100 resize-none"
            />
          </div>

          {/* Budget Limit Slider */}
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
                Target Subscription Fee Limit
              </label>
              <span className="font-mono text-xs font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded">
                ${budget.toFixed(2)}/mo
              </span>
            </div>
            <input
              type="range"
              min="1.99"
              max="19.99"
              step="0.50"
              value={budget}
              onChange={(e) => setBudget(parseFloat(e.target.value))}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-100 accent-violet-600"
            />
            <div className="flex justify-between text-[10px] text-gray-400 font-mono mt-1">
              <span>$1.99/mo (Cheap)</span>
              <span>$19.99/mo (Value-Rich Pro)</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 justify-end border-t border-gray-50 pt-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-100 px-4 py-2.5 text-xs font-semibold text-gray-500 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-violet-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-violet-700 transition shadow-sm"
            >
              Pitch Idea Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
