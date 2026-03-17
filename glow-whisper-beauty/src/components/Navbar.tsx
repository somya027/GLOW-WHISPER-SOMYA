import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, Heart, Search, Menu, X, LogIn } from "lucide-react";
import { useCart, useWishlist } from "@/hooks/useStore";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Shop" },
  { to: "/products?category=Skin Care", label: "Skin Care" },
  { to: "/products?category=Hair Care", label: "Hair Care" },
  { to: "/products?category=Face Cream", label: "Face Cream" },
];

export default function Navbar() {
  const { count } = useCart();
  const { wishlist } = useWishlist();
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-card/90 backdrop-blur-lg border-b border-border/50">
      <div className="container flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="font-display text-2xl md:text-3xl font-semibold tracking-wide text-foreground">
          Aura
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`font-body text-sm tracking-wide transition-colors hover:text-primary ${
                location.pathname === link.to ? "text-primary font-medium" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          <Link to="/products" className="p-2 text-muted-foreground hover:text-primary transition-colors">
            <Search className="w-5 h-5" />
          </Link>
          <Link to="/wishlist" className="p-2 text-muted-foreground hover:text-primary transition-colors relative">
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-medium">
                {wishlist.length}
              </span>
            )}
          </Link>
          <Link to="/cart" className="p-2 text-muted-foreground hover:text-primary transition-colors relative">
            <ShoppingBag className="w-5 h-5" />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-medium">
                {count}
              </span>
            )}
          </Link>
          {isAuthenticated && user ? (
            <Link to="/account" className="p-1 text-muted-foreground hover:text-primary transition-colors hidden md:flex items-center">
              <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </Link>
          ) : (
            <Link to="/login" className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-body font-medium hover:bg-primary/20 transition-colors">
              <LogIn className="w-4 h-4" /> Login
            </Link>
          )}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-muted-foreground md:hidden"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-border/50 bg-card"
          >
            <div className="container py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="font-body text-sm py-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="font-body text-sm py-2 text-primary font-medium hover:text-primary/80 transition-colors"
                >
                  Login / Sign Up
                </Link>
              )}
              <Link
                to="/account"
                onClick={() => setMobileOpen(false)}
                className="font-body text-sm py-2 text-muted-foreground hover:text-primary transition-colors"
              >
                My Account
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
