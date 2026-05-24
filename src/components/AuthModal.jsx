import React, { useState } from "react";
import LucideIcon from "./LucideIcon";

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [emailInput, setEmailInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!emailInput.trim() || !nameInput.trim()) return;

    setLoading(true);
    setTimeout(() => {
      onLoginSuccess(emailInput.trim(), nameInput.trim());
      setLoading(false);
      onClose();
    }, 1200);
  };

  const handleOAuthLogin = (provider) => {
    setLoading(true);
    setTimeout(() => {
      onLoginSuccess(`${provider.toLowerCase()}@example.com`, `Partner Developer (${provider})`);
      setLoading(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/65 backdrop-blur-sm animate-fade-in p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl relative animate-[scaleIn_0.2s_ease-out]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          <span className="text-lg font-bold">✕</span>
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 mb-3">
            <LucideIcon name="Users" size={24} />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Sign In to Make It AI</h2>
          <p className="text-xs text-slate-500 mt-1">
            Access secure sandboxes, manage subscriber balances, and deploy micro-agents.
          </p>
        </div>

        {loading ? (
          <div className="py-8 text-center space-y-3">
            <div className="h-6 w-6 border-2 border-indigo-600 border-t-transparent animate-spin rounded-full mx-auto" />
            <p className="text-xs text-slate-500">Authenticating developer token...</p>
          </div>
        ) : (
          <div className="space-y-4">
            
            {/* Custom Google/GitHub Auth Option */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleOAuthLogin("Google")}
                className="flex items-center justify-center gap-2 p-3 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer transition-all"
              >
                <div className="w-4 h-4 bg-red-100 text-red-650 flex items-center justify-center rounded-sm text-[10px] font-bold">G</div>
                Google Sign In
              </button>
              <button
                type="button"
                onClick={() => handleOAuthLogin("GitHub")}
                className="flex items-center justify-center gap-2 p-3 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer transition-all"
              >
                <div className="w-3.5 h-3.5 bg-slate-900 text-white flex items-center justify-center rounded-full text-[8px] font-mono">G</div>
                GitHub Account
              </button>
            </div>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-slate-150"></div>
              <span className="flex-shrink mx-3 text-[10px] text-slate-400 font-bold uppercase tracking-widest bg-white px-2">OR ENTER EMAIL</span>
              <div className="flex-grow border-t border-slate-150"></div>
            </div>

            {/* Email form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nitika Agrawal"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-150"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">
                  Developer Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@agency.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-150"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl text-xs font-bold transition-all shadow-md mt-4 cursor-pointer"
              >
                Initialize Sign In
              </button>
            </form>

            <p className="text-[10px] text-center text-slate-403 pt-2">
              No real verification required. All sessions remain locally sandboxed inside your local client framework storage context.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
