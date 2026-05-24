import React from "react";
import LucideIcon from "./LucideIcon";

export default function AgentCard({
  agent,
  isSubscribed,
  isOwner,
  onSubscribe,
  onLaunch,
}) {
  // Determine accent color theme based on icon handle
  const getAccentGradient = (icon) => {
    switch (icon) {
      case "Search":
        return "from-sky-500/10 to-blue-500/10 border-sky-200/40 text-sky-700";
      case "Wrench":
        return "from-amber-500/10 to-orange-500/10 border-amber-200/40 text-amber-700";
      case "TrendingUp":
        return "from-emerald-500/10 to-green-500/10 border-emerald-200/40 text-emerald-700";
      case "Globe":
        return "from-teal-500/10 to-cyan-500/10 border-teal-200/40 text-teal-700";
      case "PenTool":
        return "from-fuchsia-500/10 to-pink-500/10 border-fuchsia-200/40 text-fuchsia-700";
      case "Code":
        return "from-indigo-500/10 to-violet-500/10 border-indigo-200/40 text-indigo-700";
      case "Briefcase":
        return "from-slate-500/10 to-zinc-500/10 border-slate-200/40 text-slate-700";
      default:
        return "from-violet-500/10 to-purple-500/10 border-violet-200/40 text-violet-700";
    }
  };

  const gradientClasses = getAccentGradient(agent.iconName);

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-gray-200/80 hover:shadow-md">
      {/* Top Banner Accent */}
      <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${getAccentGradient(agent.iconName).includes("emerald") ? "from-emerald-500 to-green-500" : getAccentGradient(agent.iconName).includes("sky") ? "from-sky-500 to-blue-500" : getAccentGradient(agent.iconName).includes("amber") ? "from-amber-500 to-orange-500" : "from-violet-500 to-indigo-500"}`} />

      <div>
        {/* Header containing Name and Icon */}
        <div className="mb-4 flex items-start justify-between">
          <div className={`rounded-xl border p-3 bg-gradient-to-br ${gradientClasses}`}>
            <LucideIcon name={agent.iconName} className="h-6 w-6" />
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs font-mono font-medium tracking-wide uppercase text-gray-400">
              {agent.category}
            </span>
            <div className="mt-1 flex items-center gap-1">
              <LucideIcon name="Star" className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="text-sm font-medium text-gray-700">{(agent.rating ?? 5.0).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Title and Description */}
        <h3 className="mb-2 text-lg font-semibold tracking-tight text-gray-900 group-hover:text-gray-900">
          {agent.name}
        </h3>
        <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-gray-500">
          {agent.description}
        </p>

        {/* Creator Attribution */}
        <div className="mb-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-400 border-t border-gray-50 pt-4">
          <span>Created by:</span>
          <span className="font-medium text-gray-600 truncate max-w-[150px]" title={agent.author}>
            {agent.author}
          </span>
          {agent.ideaAuthorEmail && (
            <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-1.5 py-0.5 font-medium text-amber-800 text-[10px]">
              Commission-Share Split
            </span>
          )}
        </div>
      </div>

      {/* Pricing and Action Footer */}
      <div className="flex items-center justify-between border-t border-gray-50 pt-4 mt-auto">
        <div className="flex flex-col">
          <span className="text-xs text-gray-400">Subscription API Fee</span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold font-mono text-gray-900">
              {(agent.price ?? 0) === 0 ? "Free" : `$${(agent.price ?? 5.99).toFixed(2)}`}
            </span>
            {(agent.price ?? 0) !== 0 && <span className="text-xs text-gray-400">/mo</span>}
          </div>
        </div>

        <div className="flex gap-2">
          {isOwner ? (
            <button
              onClick={() => onLaunch(agent)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gray-900 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-gray-800"
            >
              <LucideIcon name="Cpu" size={14} />
              Manage
            </button>
          ) : isSubscribed ? (
            <button
              onClick={() => onLaunch(agent)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-700 shadow-sm"
            >
              <LucideIcon name="Play" size={14} className="fill-white text-white" />
              Open AI
            </button>
          ) : (
            <button
              onClick={() => onSubscribe(agent.id)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-violet-700 shadow-sm hover:shadow-md"
            >
              <LucideIcon name="ShieldCheck" size={14} />
              Subscribe
            </button>
          )}
        </div>
      </div>

      {/* Commission split indicator logic on overlay top */}
      <div className="absolute top-2 right-3 flex items-center gap-1 text-[10px] text-gray-400">
        <LucideIcon name="Users" size={10} />
        <span className="font-mono">{agent.subscribers} subs</span>
      </div>
    </div>
  );
}
