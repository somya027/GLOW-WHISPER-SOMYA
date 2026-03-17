import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Package, ArrowRight } from "lucide-react";

export default function OrderConfirmationPage() {
  const location = useLocation();
  const stateOrderNumber = (location.state as { orderNumber?: string } | null)?.orderNumber;
  const orderNumber = stateOrderNumber || `AURA-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  return (
    <div className="container py-20 max-w-lg text-center">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}>
        <CheckCircle className="w-20 h-20 text-primary mx-auto mb-6" />
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-3">Thank You!</h1>
        <p className="font-body text-muted-foreground mb-8">Your order has been placed successfully</p>

        <div className="bg-card rounded-2xl p-6 shadow-soft mb-8 text-left space-y-4">
          <div className="flex justify-between">
            <span className="font-body text-sm text-muted-foreground">Order Number</span>
            <span className="font-body text-sm font-semibold text-foreground">{orderNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-body text-sm text-muted-foreground">Estimated Delivery</span>
            <span className="font-body text-sm font-medium text-foreground">5-7 business days</span>
          </div>
          <div className="flex items-center gap-2 pt-2 border-t border-border">
            <Package className="w-5 h-5 text-primary" />
            <span className="font-body text-sm text-muted-foreground">You'll receive a confirmation email shortly</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/orders" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border bg-card text-foreground font-body font-medium text-sm hover:bg-secondary transition-colors">
            View Orders
          </Link>
          <Link to="/products" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl gradient-cta text-primary-foreground font-body font-medium text-sm hover:opacity-90 transition-opacity">
            Continue Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
