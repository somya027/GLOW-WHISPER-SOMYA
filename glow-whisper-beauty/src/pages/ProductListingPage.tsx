import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X, Loader2 } from "lucide-react";
import { useProducts, useCategories } from "@/hooks/useProducts";
import ProductCard from "@/components/ProductCard";

export default function ProductListingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const activeCategory = searchParams.get("category") || "";
  const [priceRange, setPriceRange] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("popular");

  // Fetch from API
  const { data: apiData, isLoading: loadingProducts } = useProducts({
    ...(activeCategory ? { category: activeCategory } : {}),
    ...(search ? { search } : {}),
    ...(sortBy === "price-low" ? { sort_by: "price_asc" } : {}),
    ...(sortBy === "price-high" ? { sort_by: "price_desc" } : {}),
    ...(sortBy === "rating" ? { sort_by: "rating" } : {}),
    page_size: "50",
  });
  const { data: apiCategories } = useCategories();

  const products = apiData?.products ?? [];
  const categories = apiCategories ?? [];

  const filtered = useMemo(() => {
    let result = [...products];
    // Client-side price range filter (not in API)
    if (priceRange === "under999") result = result.filter((p) => p.price < 999);
    else if (priceRange === "999to2999") result = result.filter((p) => p.price >= 999 && p.price <= 2999);
    else if (priceRange === "over2999") result = result.filter((p) => p.price > 2999);
    // Sorting is handled by API, but keep client sort for popular (default)
    if (sortBy === "popular") result.sort((a, b) => b.reviews - a.reviews);
    return result;
  }, [products, priceRange, sortBy]);

  return (
    <div className="container py-8 md:py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-2">
          {activeCategory || "All Products"}
        </h1>
        <p className="font-body text-muted-foreground mb-8">{filtered.length} products</p>
      </motion.div>

      {/* Search & filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border text-sm font-body text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="sm:hidden flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border bg-card text-sm font-body text-foreground"
        >
          <SlidersHorizontal className="w-4 h-4" /> Filters
        </button>
      </div>

      <div className="flex gap-8">
        {/* Sidebar filters */}
        <div className={`${showFilters ? "block" : "hidden"} sm:block w-full sm:w-56 shrink-0 space-y-6`}>
          {/* Category */}
          <div>
            <h3 className="font-body text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">Category</h3>
            <div className="space-y-2">
              <button
                onClick={() => { searchParams.delete("category"); setSearchParams(searchParams); }}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-body transition-colors ${!activeCategory ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground"}`}
              >
                All Products
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { searchParams.set("category", cat); setSearchParams(searchParams); }}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-body transition-colors ${activeCategory === cat ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price */}
          <div>
            <h3 className="font-body text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">Price Range</h3>
            <div className="space-y-2">
              {[
                { label: "All Prices", value: "" },
                { label: "Under ₹999", value: "under999" },
                { label: "₹999 - ₹2,999", value: "999to2999" },
                { label: "Over ₹2,999", value: "over2999" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setPriceRange(opt.value)}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-body transition-colors ${priceRange === opt.value ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div>
            <h3 className="font-body text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">Sort By</h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-card border border-border text-sm font-body text-foreground outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="popular">Popularity</option>
              <option value="rating">Rating</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {showFilters && (
            <button onClick={() => setShowFilters(false)} className="sm:hidden flex items-center gap-1 text-sm font-body text-primary">
              <X className="w-4 h-4" /> Close Filters
            </button>
          )}
        </div>

        {/* Product grid */}
        <div className="flex-1">
          {loadingProducts ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filtered.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
              {filtered.length === 0 && (
                <div className="text-center py-20">
                  <p className="font-display text-2xl text-muted-foreground mb-2">No products found</p>
                  <p className="font-body text-sm text-muted-foreground">Try adjusting your filters</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
