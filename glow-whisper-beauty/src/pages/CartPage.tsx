import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Minus, Plus, X, ShoppingBag, ArrowLeft } from "lucide-react";
import { useCart } from "@/hooks/useStore";

export default function CartPage() {
  const { cart, total, count, updateQuantity, removeFromCart } = useCart();

  if (count === 0) {
    return (
      <div className="container py-20 text-center">
        <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
        <h1 className="font-display text-3xl text-foreground mb-2">Your Cart is Empty</h1>
        <p className="font-body text-sm text-muted-foreground mb-6">Add some beautiful products to get started!</p>
        <Link to="/products" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-cta text-primary-foreground font-body font-medium text-sm">
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-12 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link to="/products" className="inline-flex items-center gap-1.5 font-body text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </Link>
        <h1 className="font-display text-3xl font-semibold text-foreground mb-8">Shopping Cart ({count})</h1>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {cart.map((item) => (
            <motion.div
              key={item.product.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-4 bg-card rounded-2xl p-4 shadow-soft"
            >
              <Link to={`/product/${item.product.id}`} className="w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-secondary/30">
                <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/product/${item.product.id}`} className="font-display text-lg font-medium text-foreground hover:text-primary transition-colors line-clamp-1">
                  {item.product.name}
                </Link>
                <p className="font-body text-xs text-muted-foreground mb-2">{item.product.category}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 border border-border rounded-lg px-1">
                    <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="p-1 text-muted-foreground hover:text-foreground">
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center font-body text-xs font-medium text-foreground">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="p-1 text-muted-foreground hover:text-foreground">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="font-body font-semibold text-foreground">₹{(item.product.price * item.quantity).toFixed(0)}</span>
                </div>
              </div>
              <button onClick={() => removeFromCart(item.product.id)} className="self-start p-1 text-muted-foreground hover:text-destructive">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-card rounded-2xl p-6 shadow-soft h-fit sticky top-24">
          <h2 className="font-display text-xl font-semibold text-foreground mb-4">Order Summary</h2>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between font-body text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-foreground">₹{total.toFixed(0)}</span>
            </div>
            <div className="flex justify-between font-body text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span className="text-foreground">Free</span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between font-body font-semibold">
              <span className="text-foreground">Total</span>
              <span className="text-foreground">₹{total.toFixed(0)}</span>
            </div>
          </div>
          <Link
            to="/checkout"
            className="block w-full text-center py-3 rounded-xl gradient-cta text-primary-foreground font-body font-medium text-sm hover:opacity-90 transition-opacity"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
