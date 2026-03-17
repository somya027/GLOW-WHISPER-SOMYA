import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Star, Sparkles, Mail, Loader2 } from "lucide-react";
import { testimonials } from "@/data/products";
import { useFeaturedProducts, useCategories, useProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/ProductCard";
import heroImage from "@/assets/hero-beauty.jpg";

export default function HomePage() {
  const { data: apiFeatured, isLoading: loadingFeatured } = useFeaturedProducts();
  const { data: apiCategories, isLoading: loadingCategories } = useCategories();
  const { data: allData } = useProducts({ page_size: "50" });

  const allProducts = allData?.products ?? [];
  const featured = apiFeatured ?? [];
  const categories = apiCategories ?? [];

  // Build category images from first product in each category
  const categoryImages: Record<string, string> = {};
  for (const cat of categories) {
    const p = allProducts.find((prod) => prod.category === cat);
    categoryImages[cat] = p?.image || "";
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[70vh] md:min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Luxury beauty products" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent" />
        </div>
        <div className="container relative z-10 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-xl"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-body font-medium mb-6">
              <Sparkles className="w-3.5 h-3.5" /> New Collection
            </span>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-semibold text-foreground leading-tight mb-6">
              Glow Naturally with Premium Care
            </h1>
            <p className="font-body text-lg text-muted-foreground mb-8 leading-relaxed max-w-md">
              Discover our curated collection of premium beauty essentials, crafted with the finest natural ingredients.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-cta text-primary-foreground font-body font-medium text-sm hover:opacity-90 transition-opacity"
              >
                Shop Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-card text-foreground font-body font-medium text-sm hover:bg-secondary transition-colors"
              >
                Explore Collection
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="container py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-3">Shop by Category</h2>
          <p className="font-body text-muted-foreground">Find exactly what your beauty routine needs</p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {loadingCategories ? (
            <div className="col-span-full flex justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : categories.length === 0 ? (
            <p className="col-span-full text-center font-body text-muted-foreground py-8">No categories found</p>
          ) : categories.map((cat, i) => (
            <motion.div
              key={cat}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={`/products?category=${cat}`}
                className="group block relative aspect-[3/4] rounded-2xl overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-500"
              >
                <img
                  src={categoryImages[cat]}
                  alt={cat}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-display text-xl text-card font-medium">{cat}</h3>
                  <span className="font-body text-xs text-card/80">Shop now →</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="gradient-rose py-16 md:py-24">
        <div className="container">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-3">Featured Products</h2>
              <p className="font-body text-muted-foreground">Handpicked favorites our customers love</p>
            </div>
            <Link to="/products" className="hidden md:inline-flex items-center gap-1.5 text-primary font-body text-sm font-medium hover:underline">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {loadingFeatured ? (
              <div className="col-span-full flex justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : featured.length === 0 ? (
              <p className="col-span-full text-center font-body text-muted-foreground py-8">No featured products yet</p>
            ) : featured.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link to="/products" className="inline-flex items-center gap-1.5 text-primary font-body text-sm font-medium">
              View All Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-3">What Our Customers Say</h2>
          <p className="font-body text-muted-foreground">Real reviews from real beauty lovers</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-2xl p-6 shadow-soft"
            >
              <div className="flex gap-1 mb-3">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>
              <p className="font-body text-sm text-foreground leading-relaxed mb-4">"{t.text}"</p>
              <div>
                <p className="font-body text-sm font-medium text-foreground">{t.name}</p>
                <p className="font-body text-xs text-muted-foreground">{t.product}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Promo Banner */}
      <section className="container pb-16 md:pb-24">
        <div className="gradient-lavender rounded-2xl p-8 md:p-12 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-3">Spring Collection is Here</h2>
          <p className="font-body text-muted-foreground mb-6 max-w-md mx-auto">
            Enjoy 20% off our new spring arrivals. Limited time offer on all skincare essentials.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-cta text-primary-foreground font-body font-medium text-sm hover:opacity-90 transition-opacity"
          >
            Shop the Sale <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-secondary/50 py-16 md:py-20">
        <div className="container text-center max-w-lg">
          <Mail className="w-8 h-8 text-primary mx-auto mb-4" />
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-3">Stay in the Glow</h2>
          <p className="font-body text-sm text-muted-foreground mb-6">
            Subscribe for exclusive offers, beauty tips, and new product launches.
          </p>
          <div className="flex gap-2">
            <input
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-xl bg-card border border-border text-sm font-body text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button className="px-6 py-3 rounded-xl gradient-cta text-primary-foreground font-body font-medium text-sm hover:opacity-90 transition-opacity">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
