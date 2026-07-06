import React, { useState } from 'react';
import { useWebsiteData } from '../context/WebsiteContext';
import { X, Lock, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminLoginModal() {
  const { isAdminLoginOpen, setAdminLoginOpen, login } = useWebsiteData();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  if (!isAdminLoginOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = login(password);
    if (success) {
      setPassword('');
    } else {
      setError('ভুল পাসওয়ার্ড! অনুগ্রহ করে আবার চেষ্টা করুন। (পাসওয়ার্ডটি হলো: admin)');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setAdminLoginOpen(false)}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 text-left z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-600/20 text-violet-400">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Admin Portal Login</h3>
                <p className="text-xs text-slate-400">এডিট প্যানেলে প্রবেশ করতে পাসওয়ার্ড দিন</p>
              </div>
            </div>
            <button
              onClick={() => setAdminLoginOpen(false)}
              className="rounded-full p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="admin-password" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                পাসওয়ার্ড (Password)
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="পাসওয়ার্ডটি লিখুন..."
                  className="w-full rounded-xl bg-slate-950/60 border border-slate-800 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-colors"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-400"
              >
                <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Helper Hint */}
            <div className="rounded-xl bg-slate-950/30 border border-slate-800/50 p-3 text-xs text-slate-400 space-y-1">
              <span className="font-semibold text-slate-300 block">💡 পাসওয়ার্ড ইঙ্গিত:</span>
              <p>ওয়েবসাইট এডিট করতে পাসওয়ার্ড হিসেবে <code className="bg-slate-950 px-1 py-0.5 rounded text-violet-400 font-mono text-[11px]">admin</code> ব্যবহার করুন।</p>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 px-4 text-sm tracking-wide shadow-lg shadow-violet-900/20 transition-all hover:scale-[1.01] active:scale-98"
            >
              লগইন করুন
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
