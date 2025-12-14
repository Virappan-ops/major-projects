import { useState } from "react";
import { Check, Star, CreditCard, Loader2, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

const Subscription = () => {
  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const navigate = useNavigate();

  // Fake Form State
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1. Simulate API Delay (Processing Card...)
    setTimeout(async () => {
      try {
        // 2. Call Backend to Upgrade User
        const { data } = await api.put("/users/premium");
        
        // 3. Update Local Data
        localStorage.setItem("userInfo", JSON.stringify(data));
        
        setLoading(false);
        window.location.href = "/dashboard"; // Redirect to Dashboard
      } catch (error) {
        console.error("Payment failed");
        setLoading(false);
      }
    }, 2500);
  };

  // Auto-format Credit Card (Spaces every 4 digits)
  const handleCardInput = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    val = val.replace(/(.{4})/g, '$1 ').trim();
    setCardNumber(val.substring(0, 19));
  };

  return (
    <div className="h-full w-full overflow-y-auto p-8 flex flex-col items-center justify-center relative">
      
      <div className="text-center mb-10">
        <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-wider border border-indigo-500/20">
            Premium Plan
        </span>
        <h1 className="text-4xl font-bold text-white mt-4">Upgrade to Pro</h1>
        <p className="text-slate-400 mt-2">Unlock the full power of Ionix AI.</p>
      </div>

      {/* PRICING CARD */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-gradient-to-b from-white/10 to-white/5 border border-white/10 rounded-2xl p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-orange-500 text-black text-xs font-bold px-3 py-1 rounded-bl-xl">
          BEST VALUE
        </div>

        <div className="flex items-end gap-1 mb-6">
            <h2 className="text-4xl font-bold text-white">$9</h2>
            <span className="text-slate-400 mb-1">/ month</span>
        </div>

        <ul className="space-y-4 mb-8">
            <FeatureItem text="Unlimited AI Chat (Gemini)" />
            <FeatureItem text="Unlimited Cloud Storage" />
            <FeatureItem text="Advanced Analytics Dashboard" />
            <FeatureItem text="Priority Support" />
            <FeatureItem text="Custom Themes (Midnight/Light)" />
        </ul>

        <button 
            onClick={() => setShowPaymentModal(true)}
            className="w-full py-4 rounded-xl bg-white text-black font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
        >
            <Star size={18} className="text-amber-500" fill="currentColor"/> Upgrade Now
        </button>

        <p className="text-center text-xs text-slate-500 mt-4 flex items-center justify-center gap-1">
            <Lock size={10}/> Secure SSL Encryption
        </p>
      </motion.div>

      {/* FAKE PAYMENT MODAL */}
      <AnimatePresence>
        {showPaymentModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-[#18181b] border border-white/10 p-8 rounded-2xl max-w-sm w-full shadow-2xl relative"
                >
                    <button 
                        onClick={() => setShowPaymentModal(false)}
                        className="absolute top-4 right-4 text-slate-500 hover:text-white"
                    >
                        ✕
                    </button>

                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <CreditCard className="text-indigo-400"/> Checkout
                    </h3>

                    <form onSubmit={handlePayment} className="space-y-4">
                        <div>
                            <label className="block text-xs text-slate-400 mb-1">Card Number</label>
                            <input 
                                type="text" 
                                placeholder="0000 0000 0000 0000" 
                                value={cardNumber}
                                onChange={handleCardInput}
                                className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-indigo-500 outline-none font-mono"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Expiry</label>
                                <input 
                                    type="text" 
                                    placeholder="MM/YY" 
                                    maxLength="5"
                                    value={expiry}
                                    onChange={(e) => setExpiry(e.target.value)}
                                    className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-indigo-500 outline-none font-mono"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">CVC</label>
                                <input 
                                    type="text" 
                                    placeholder="123" 
                                    maxLength="3"
                                    value={cvc}
                                    onChange={(e) => setCvc(e.target.value)}
                                    className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-indigo-500 outline-none font-mono"
                                    required
                                />
                            </div>
                        </div>

                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 mt-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin"/> : "Pay $9.00"}
                        </button>
                    </form>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

    </div>
  );
};

const FeatureItem = ({ text }) => (
    <li className="flex items-center gap-3 text-sm text-slate-300">
        <div className="p-1 rounded-full bg-indigo-500/20 text-indigo-400">
            <Check size={12} />
        </div>
        {text}
    </li>
);

export default Subscription;