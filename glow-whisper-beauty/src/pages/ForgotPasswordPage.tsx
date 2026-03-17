import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-card rounded-2xl p-8 shadow-card border border-border/50">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-semibold text-foreground mb-2">Reset Password</h1>
            <p className="font-body text-sm text-muted-foreground">Enter your email and we'll send you a reset link</p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="font-body text-sm text-foreground mb-1.5 block">Email Address</label>
              <input type="email" placeholder="Enter your email" className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-sm font-body text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <button className="w-full py-3 rounded-xl gradient-cta text-primary-foreground font-body font-medium text-sm hover:opacity-90 transition-opacity">
              Send Reset Link
            </button>
          </div>
          <Link to="/login" className="flex items-center justify-center gap-1.5 mt-6 font-body text-sm text-primary hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
