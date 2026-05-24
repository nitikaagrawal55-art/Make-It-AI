import React from "react";
import LucideIcon from "./LucideIcon";

export default function IdeaRequestCard({
  idea,
  isCurrentUserTheSuggester,
  onUpvote,
  onSelectDevelop,
}) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-gray-50/50 p-6 transition-all hover:border-gray-200 hover:bg-white">
      <div>
        {/* Header containing name, submitter */}
        <div className="mb-3 flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <LucideIcon name="Brain" size={16} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900">{idea.title}</h4>
              <p className="text-[11px] text-gray-400">
                Pitched by {idea.suggestedByName} {isCurrentUserTheSuggester ? "(You)" : ""}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 rounded bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-800">
            <span className="font-mono">Budget</span>
            <span>{idea.priceBudget ? `$${idea.priceBudget.toFixed(2)}` : "Any"}</span>
          </div>
        </div>

        {/* Content text */}
        <p className="mb-5 text-xs leading-relaxed text-gray-600">
          {idea.problemDescription}
        </p>
      </div>

      {/* Footer containing Upvote backing count and action button to start development */}
      <div className="flex items-center justify-between border-t border-gray-100/60 pt-4">
        <button
          onClick={() => onUpvote(idea.id)}
          className="group flex items-center gap-1.5 rounded-lg border border-gray-100 bg-white px-2.5 py-1.5 text-xs text-gray-500 transition hover:border-indigo-100 hover:bg-indigo-50/50 hover:text-indigo-600"
        >
          <LucideIcon name="Flame" size={12} className="text-gray-400 transition group-hover:text-amber-500 fill-transparent group-hover:fill-amber-500" />
          <span className="font-mono font-medium">{idea.subscribersInterestsCount} Backing Interest</span>
        </button>

        <button
          onClick={() => onSelectDevelop(idea)}
          className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-indigo-700 hover:shadow-sm"
        >
          <LucideIcon name="Zap" size={12} />
          Develop Solution
        </button>
      </div>
    </div>
  );
}
