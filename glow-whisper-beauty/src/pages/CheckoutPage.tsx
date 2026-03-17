import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, Truck, Shield } from "lucide-react";
import { useCart } from "@/hooks/useStore";
import { ordersApi } from "@/lib/api";
import { toast } from "sonner";

export default function CheckoutPage() {
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [delivery, setDelivery] = useState<"standard" | "express">("standard");
  const [placing, setPlacing] = useState(false);
  const [address, setAddress] = useState({ first: "", last: "", street: "", city: "", zip: "" });

  const shippingCost = delivery === "express" ? 149 : 0;
  const finalTotal = total + shippingCost;

  const handlePlaceOrder = async () => {
    setPlacing(true);
    try {
      const fullAddress = `${address.first} ${address.last}, ${address.street}, ${address.city} ${address.zip}`;
      const orderItems = cart.map((item) => ({
        product_id: Number(item.product.id),
        quantity: item.quantity,
      }));
      const res = await ordersApi.create(fullAddress, orderItems);
      const orderNum = (res.data as { order_number: string }).order_number;
      clearCart();
      navigate("/order-confirmation", { state: { orderNumber: orderNum } });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to place order";
      toast.error(msg);
    } finally {
      setPlacing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container py-20 text-center">
        <h1 className="font-display text-3xl text-foreground mb-4">Nothing to Checkout</h1>
        <Link to="/products" className="text-primary font-body text-sm hover:underline">← Shop Products</Link>
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-12 max-w-4xl">
      <Link to="/cart" className="inline-flex items-center gap-1.5 font-body text-sm text-muted-foreground hover:text-primary mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Cart
      </Link>
      <h1 className="font-display text-3xl font-semibold text-foreground mb-8">Checkout</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {/* Shipping */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl p-6 shadow-soft">
            <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5 text-primary" /> Shipping Address
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="font-body text-xs text-muted-foreground mb-1 block">First Name</label>
                <input value={address.first} onChange={(e) => setAddress({ ...address, first: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-sm font-body text-foreground outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="font-body text-xs text-muted-foreground mb-1 block">Last Name</label>
                <input value={address.last} onChange={(e) => setAddress({ ...address, last: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-sm font-body text-foreground outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="col-span-2">
                <label className="font-body text-xs text-muted-foreground mb-1 block">Address</label>
                <input value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-sm font-body text-foreground outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="font-body text-xs text-muted-foreground mb-1 block">City</label>
                <input value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-sm font-body text-foreground outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="font-body text-xs text-muted-foreground mb-1 block">PIN Code</label>
                <input value={address.zip} onChange={(e) => setAddress({ ...address, zip: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-sm font-body text-foreground outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>
          </motion.div>

          {/* Delivery */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-2xl p-6 shadow-soft">
            <h2 className="font-display text-xl font-semibold text-foreground mb-4">Delivery Options</h2>
            <div className="space-y-3">
              {[
                { id: "standard" as const, label: "Standard Delivery", desc: "5-7 business days", price: "Free" },
                { id: "express" as const, label: "Express Delivery", desc: "1-2 business days", price: "₹149" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setDelivery(opt.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border transition-colors ${
                    delivery === opt.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                  }`}
                >
                  <div className="text-left">
                    <p className="font-body text-sm font-medium text-foreground">{opt.label}</p>
                    <p className="font-body text-xs text-muted-foreground">{opt.desc}</p>
                  </div>
                  <span className="font-body text-sm font-medium text-foreground">{opt.price}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Payment */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-2xl p-6 shadow-soft">
            <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" /> Payment Method
            </h2>
            <div className="space-y-4">
              <div>
                <label className="font-body text-xs text-muted-foreground mb-1 block">Card Number</label>
                <input placeholder="1234 5678 9012 3456" className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-sm font-body text-foreground outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-xs text-muted-foreground mb-1 block">Expiry</label>
                  <input placeholder="MM/YY" className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-sm font-body text-foreground outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="font-body text-xs text-muted-foreground mb-1 block">CVV</label>
                  <input placeholder="123" className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-sm font-body text-foreground outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground font-body">
              <Shield className="w-4 h-4 text-sage" /> Your payment info is encrypted and secure
            </div>
          </motion.div>
        </div>

        {/* Order Summary */}
        <div className="bg-card rounded-2xl p-6 shadow-soft h-fit sticky top-24">
          <h2 className="font-display text-xl font-semibold text-foreground mb-4">Order Summary</h2>
          <div className="space-y-3 mb-4">
            {cart.map((item) => (
              <div key={item.product.id} className="flex justify-between font-body text-sm">
                <span className="text-muted-foreground">{item.product.name} x{item.quantity}</span>
                <span className="text-foreground">₹{(item.product.price * item.quantity).toFixed(0)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-3 space-y-2 mb-6">
            <div className="flex justify-between font-body text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-foreground">₹{total.toFixed(0)}</span>
            </div>
            <div className="flex justify-between font-body text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span className="text-foreground">{shippingCost === 0 ? "Free" : `₹${shippingCost}`}</span>
            </div>
            <div className="border-t border-border pt-2 flex justify-between font-body font-semibold">
              <span className="text-foreground">Total</span>
              <span className="text-foreground">₹{finalTotal.toFixed(0)}</span>
            </div>
          </div>
          <button
            onClick={handlePlaceOrder}
            disabled={placing}
            className="w-full py-3.5 rounded-xl gradient-cta text-primary-foreground font-body font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {placing ? "Placing Order…" : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
