import { Heart, Minus, Plus, ShoppingBag, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Product } from "@/data/products";
import { useCart, useWishlist } from "@/hooks/useStore";
import { toast } from "sonner";

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { cart, addToCart, updateQuantity } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  const isWished = wishlist.includes(product.id);
  const cartItem = cart.find((i) => i.product.id === product.id);
  const qty = cartItem?.quantity ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group relative bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-500"
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-secondary/30">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          {product.badge && (
            <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium font-body">
              {product.badge}
            </span>
          )}
        </div>
      </Link>

      <button
        onClick={() => {
          toggleWishlist(product.id);
          toast(isWished ? "Removed from wishlist" : "Added to wishlist");
        }}
        className="absolute top-3 right-3 p-2 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card transition-colors"
      >
        <Heart className={`w-4 h-4 ${isWished ? "fill-primary text-primary" : "text-muted-foreground"}`} />
      </button>

      <div className="p-4">
        <p className="text-xs text-muted-foreground font-body mb-1">{product.category}</p>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-display text-lg font-medium text-foreground leading-tight mb-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? "fill-gold text-gold" : "text-border"}`} />
          ))}
          <span className="text-xs text-muted-foreground font-body ml-1">({product.reviews})</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-body font-semibold text-foreground">₹{product.price.toFixed(0)}</span>
            {product.originalPrice && (
              <span className="font-body text-sm text-muted-foreground line-through">₹{product.originalPrice.toFixed(0)}</span>
            )}
          </div>
          {qty > 0 ? (
            <div className="flex items-center gap-1 bg-primary rounded-xl px-1">
              <button
                onClick={() => updateQuantity(product.id, qty - 1)}
                className="p-1.5 text-primary-foreground hover:opacity-80 transition-opacity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-5 text-center text-xs font-semibold text-primary-foreground font-body">{qty}</span>
              <button
                onClick={() => {
                  addToCart(product);
                }}
                className="p-1.5 text-primary-foreground hover:opacity-80 transition-opacity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                addToCart(product);
                toast.success(`${product.name} added to cart`);
              }}
              className="p-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
