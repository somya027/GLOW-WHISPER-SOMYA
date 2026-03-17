import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useWishlist } from "@/hooks/useStore";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/ProductCard";
import { Link } from "react-router-dom";

export default function WishlistPage() {
  const { wishlist } = useWishlist();
  const { data: allData } = useProducts({ page_size: "50" });
  const allProducts = allData?.products ?? [];
  const wishlistProducts = allProducts.filter((p) => wishlist.includes(p.id));

  return (
    <div className="container py-8 md:py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-semibold text-foreground mb-2">My Wishlist</h1>
        <p className="font-body text-muted-foreground mb-8">{wishlistProducts.length} saved item{wishlistProducts.length !== 1 ? "s" : ""}</p>
      </motion.div>

      {wishlistProducts.length === 0 ? (
        <div className="text-center py-20">
          <Heart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <p className="font-display text-2xl text-muted-foreground mb-2">Your wishlist is empty</p>
          <p className="font-body text-sm text-muted-foreground mb-6">Save your favorite products for later</p>
          <Link to="/products" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-cta text-primary-foreground font-body font-medium text-sm">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {wishlistProducts.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
