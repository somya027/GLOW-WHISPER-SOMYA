import { motion } from "framer-motion";
import { User, MapPin, CreditCard, Package, Heart, LogOut } from "lucide-react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const menuItems = [
  { icon: User, label: "Profile Information", desc: "Update your name, email, and phone" },
  { icon: MapPin, label: "Saved Addresses", desc: "Manage your shipping addresses" },
  { icon: CreditCard, label: "Payment Methods", desc: "Add or remove payment methods" },
  { icon: Package, label: "Order History", desc: "View your past orders", to: "/orders" },
  { icon: Heart, label: "Wishlist", desc: "Your saved favorite products", to: "/wishlist" },
];

export default function AccountPage() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="container py-20 text-center">
        <p className="font-body text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const displayName = user?.name ?? "User";
  const displayEmail = user?.email ?? "";
  const initials = displayName.charAt(0).toUpperCase();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="container py-8 md:py-12 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-semibold text-foreground mb-8">My Account</h1>

        {/* Profile Card */}
        <div className="bg-card rounded-2xl p-6 shadow-soft mb-6 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full gradient-rose flex items-center justify-center">
            <span className="font-display text-2xl font-semibold text-foreground">{initials}</span>
          </div>
          <div>
            <h2 className="font-display text-xl font-medium text-foreground">{displayName}</h2>
            <p className="font-body text-sm text-muted-foreground">{displayEmail}</p>
          </div>
        </div>

        {/* Menu */}
        <div className="space-y-3">
          {menuItems.map((item) => {
            const content = (
              <div className="flex items-center gap-4 bg-card rounded-2xl p-5 shadow-soft hover:shadow-card transition-shadow cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-body text-sm font-medium text-foreground">{item.label}</p>
                  <p className="font-body text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            );
            return item.to ? <Link key={item.label} to={item.to}>{content}</Link> : <div key={item.label}>{content}</div>;
          })}

          <button onClick={handleLogout} className="flex items-center gap-4 w-full bg-card rounded-2xl p-5 shadow-soft hover:shadow-card transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
              <LogOut className="w-5 h-5 text-destructive" />
            </div>
            <p className="font-body text-sm font-medium text-destructive">Log Out</p>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
