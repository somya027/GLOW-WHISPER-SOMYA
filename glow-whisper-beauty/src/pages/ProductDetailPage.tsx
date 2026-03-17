import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, ShoppingBag, Heart, ArrowLeft, Minus, Plus, Check } from "lucide-react";
import { useState } from "react";
import { useProduct, useProducts } from "@/hooks/useProducts";
import { useCart, useWishlist } from "@/hooks/useStore";
import { toast } from "sonner";
import ProductCard from "@/components/ProductCard";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { data: apiProduct, isLoading } = useProduct(id);
  const product = apiProduct ?? null;
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();

  // Fetch related products by same category
  const { data: relatedData } = useProducts(
    product ? { category: product.category, page_size: "5" } : undefined,
  );

  if (isLoading) {
    return (
      <div className="container py-20 text-center">
        <p className="font-body text-muted-foreground">Loading product…</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-20 text-center">
        <h1 className="font-display text-3xl text-foreground mb-4">Product Not Found</h1>
        <Link to="/products" className="text-primary font-body text-sm hover:underline">← Back to Shop</Link>
      </div>
    );
  }

  const isWished = wishlist.includes(product.id);
  const related = (relatedData?.products ?? [])
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addToCart(product);
    toast.success(`${quantity}x ${product.name} added to cart`);
  };

  return (
    <div className="container py-8 md:py-12">
      <Link to="/products" className="inline-flex items-center gap-1.5 font-body text-sm text-muted-foreground hover:text-primary mb-8">
        <ArrowLeft className="w-4 h-4" /> Back to Shop
      </Link>

      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        {/* Image */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="relative">
          <div className="aspect-square rounded-2xl overflow-hidden bg-secondary/30 shadow-card">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
          {product.badge && (
            <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium font-body">
              {product.badge}
            </span>
          )}
        </motion.div>

        {/* Info */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col">
          <p className="text-sm text-muted-foreground font-body mb-1">{product.category}</p>
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-3">{product.name}</h1>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-gold text-gold" : "text-border"}`} />
              ))}
            </div>
            <span className="font-body text-sm text-muted-foreground">{product.rating} ({product.reviews} reviews)</span>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <span className="font-display text-3xl font-semibold text-foreground">₹{product.price.toFixed(0)}</span>
            {product.originalPrice && (
              <span className="font-body text-lg text-muted-foreground line-through">₹{product.originalPrice.toFixed(0)}</span>
            )}
          </div>

          <p className="font-body text-sm text-muted-foreground leading-relaxed mb-6">{product.description}</p>

          {/* Benefits */}
          <div className="mb-6">
            <h3 className="font-body text-sm font-semibold text-foreground mb-2 uppercase tracking-wide">Benefits</h3>
            <div className="grid grid-cols-2 gap-2">
              {product.benefits.map((b) => (
                <div key={b} className="flex items-center gap-2 font-body text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-primary shrink-0" /> {b}
                </div>
              ))}
            </div>
          </div>

          {/* Ingredients */}
          <div className="mb-8">
            <h3 className="font-body text-sm font-semibold text-foreground mb-2 uppercase tracking-wide">Key Ingredients</h3>
            <div className="flex flex-wrap gap-2">
              {product.ingredients.map((ing) => (
                <span key={ing} className="px-3 py-1 rounded-full bg-secondary text-xs font-body text-secondary-foreground">{ing}</span>
              ))}
            </div>
          </div>

          {/* Quantity & Actions */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2 border border-border rounded-xl px-1">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 text-muted-foreground hover:text-foreground">
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-body text-sm font-medium text-foreground">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="p-2 text-muted-foreground hover:text-foreground">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={() => { toggleWishlist(product.id); toast(isWished ? "Removed from wishlist" : "Added to wishlist"); }}
              className={`p-3 rounded-xl border ${isWished ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:text-primary"} transition-colors`}
            >
              <Heart className={`w-5 h-5 ${isWished ? "fill-primary" : ""}`} />
            </button>
          </div>

          <div className="flex gap-3">
            <button onClick={handleAddToCart} className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl border border-primary text-primary font-body font-medium text-sm hover:bg-primary/5 transition-colors">
              <ShoppingBag className="w-4 h-4" /> Add to Cart
            </button>
            <Link
              to="/checkout"
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl gradient-cta text-primary-foreground font-body font-medium text-sm hover:opacity-90 transition-opacity"
            >
              Buy Now
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16 md:mt-24">
          <h2 className="font-display text-2xl font-semibold text-foreground mb-8">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </section>
      )}
    </div>
  );
}
