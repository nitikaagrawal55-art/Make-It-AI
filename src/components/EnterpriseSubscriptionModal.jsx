import React, { useState } from "react";
import LucideIcon from "./LucideIcon";

export default function EnterpriseSubscriptionModal({
  isOpen,
  onClose,
  onSubscribeSuccess,
  currentSubscriptionStatus,
  onCancelSubscription,
}) {
  const [cardNumber, setCardNumber] = useState("4111 2222 3333 4444");
  const [expiry, setExpiry] = useState("12/29");
  const [cvc, setCvc] = useState("329");
  const [cardName, setCardName] = useState("MAKE IT ENTERPRISES LTD");
  const [checkingOut, setCheckingOut] = useState(false);
  const [successState, setSuccessState] = useState(false);

  if (!isOpen) return null;

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    setCheckingOut(true);
    setTimeout(() => {
      onSubscribeSuccess();
      setCheckingOut(false);
      setSuccessState(true);
      setTimeout(() => {
        setSuccessState(false);
        onClose();
      }, 1500);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/65 backdrop-blur-sm animate-fade-in p-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-xl relative animate-[scaleIn_0.2s_ease-out] overflow-hidden">
        
        {/* Colorful Gradient Border top */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-indigo-600" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 cursor-pointer text-sm"
        >
          ✕
        </button>

        {successState ? (
          <div className="py-12 text-center space-y-4 animate-fade-in">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <LucideIcon name="ShieldCheck" size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Enterprise Subscription Active</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Your billing credential token was successful. You have officially unlocked <strong>Make It AI Ultra-Cluster access at $2,000/mo</strong>!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Header info */}
            <div className="flex gap-4 items-start pb-4 border-b border-slate-100">
              <div className="h-12 w-12 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center text-xl font-bold shrink-0 shadow-md">
                👑
              </div>
              <div>
                <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Make It AI Premium Tier</span>
                <h2 className="text-lg font-bold text-slate-900 mt-1">Enterprise Supercluster Plan</h2>
                <p className="text-slate-600 text-xs mt-0.5">High-availability neural routing and dynamic interfaces for fast business scaling.</p>
              </div>
            </div>

            {/* Price section */}
            <div className="rounded-xl bg-slate-900 p-5 text-white flex justify-between items-center shadow-inner">
              <div>
                <p className="text-[10px] text-amber-400 uppercase tracking-widest font-bold font-mono">Total Subscription Outflow</p>
                <p className="text-sm text-slate-300 mt-0.5">Supercluster Compute Access Limit</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold font-mono text-white">$2,000.00/mo</p>
                <p className="text-[10px] text-indigo-200">Billed monthly in sandbox mode</p>
              </div>
            </div>

            {/* Subscription toggle or checkout */}
            {currentSubscriptionStatus ? (
              <div className="space-y-4 pt-2">
                <div className="rounded-xl bg-emerald-50 border border-emerald-150 p-4 text-xs text-emerald-800 flex gap-3">
                  <span className="text-lg">✔️</span>
                  <div>
                    <h4 className="font-bold">Subscription Status: ACTIVE</h4>
                    <p className="mt-0.5">Your Enterprise cluster token is currently online and active on this sandbox environment.</p>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-xs font-semibold rounded-xl text-slate-600 cursor-pointer"
                  >
                    Keep subscription
                  </button>
                  <button
                    onClick={() => {
                      onCancelSubscription();
                      onClose();
                    }}
                    className="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 hover:text-red-800 text-xs font-semibold rounded-xl cursor-pointer"
                  >
                    Cancel $2000/mo subscription
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Simulated Billing Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wide">Cardholder Organization</label>
                    <input
                      type="text"
                      required
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-300"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wide">Card Format</label>
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wide">Expiration</label>
                    <input
                      type="text"
                      required
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wide">CVC</label>
                    <input
                      type="text"
                      required
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                      className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={checkingOut}
                  className="w-full bg-indigo-650 text-white p-3.5 rounded-xl font-bold hover:bg-indigo-700 shadow-md transition-all flex items-center justify-center gap-2 text-xs cursor-pointer disabled:opacity-50"
                >
                  {checkingOut ? (
                    <>
                      <div className="h-3 w-3 border-2 border-white border-t-transparent animate-spin rounded-full" />
                      Securing cluster assets...
                    </>
                  ) : (
                    <>
                      <LucideIcon name="ShieldCheck" size={14} />
                      Activate Enterprise License ($2,000/mo)
                    </>
                  )}
                </button>
              </form>
            )}

            <div className="rounded-xl border border-dashed border-slate-200 p-4 text-[10px] text-slate-400 leading-normal bg-slate-50">
              <strong>Enterprise Advantage:</strong> Unlimited AI token usage, immediate access to all interface types (Virtual Fitting, Document extraction compliance grids, Social mock post generators), and supercharged real-time Google search grounding pipelines. Simulated within local environment.
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
