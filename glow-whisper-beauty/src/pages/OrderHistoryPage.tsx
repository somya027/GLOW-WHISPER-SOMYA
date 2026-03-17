import { motion } from "framer-motion";
import { Package, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ordersApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

const statusColor: Record<string, string> = {
  Delivered: "bg-sage/30 text-sage",
  Shipped: "bg-lavender text-lavender-deep",
  Processing: "bg-gold/20 text-gold",
  Cancelled: "bg-destructive/10 text-destructive",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });
}

export default function OrderHistoryPage() {
  const { isAuthenticated, loading } = useAuth();

  const { data: apiOrders, isLoading } = useQuery({
    queryKey: ["orders"],
    enabled: isAuthenticated,          // reactive — re-runs when user logs in
    queryFn: async () => {
      const res = await ordersApi.list();
      const items = res.data.items ?? [];
      return items.map((o) => ({
        id: o.order_number,
        date: formatDate(o.created_at),
        total: o.total_price,
        status: o.order_status,
        items: o.items?.length ?? 0,
      }));
    },
  });

  if (loading || isLoading) {
    return (
      <div className="container py-20 text-center">
        <p className="font-body text-muted-foreground">Loading orders…</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container py-20 text-center">
        <Package className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
        <p className="font-display text-2xl text-muted-foreground mb-2">Sign in to view your orders</p>
        <Link to="/login" className="text-primary font-body text-sm hover:underline">Login →</Link>
      </div>
    );
  }

  const orders = apiOrders ?? [];
  return (
    <div className="container py-8 md:py-12 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-semibold text-foreground mb-8">Order History</h1>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="font-display text-2xl text-muted-foreground mb-2">No orders yet</p>
            <Link to="/products" className="text-primary font-body text-sm hover:underline">Start Shopping →</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-card rounded-2xl p-5 shadow-soft flex items-center justify-between">
                <div>
                  <p className="font-body text-sm font-semibold text-foreground">{order.id}</p>
                  <p className="font-body text-xs text-muted-foreground">{order.date} · {order.items} item{order.items > 1 ? "s" : ""}</p>
                  <span className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-body font-medium ${statusColor[order.status] || ""}`}>
                    {order.status}
                  </span>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <span className="font-body font-semibold text-foreground">₹{order.total.toFixed(0)}</span>
                  <button className="flex items-center gap-1 text-xs text-primary font-body hover:underline">
                    <Eye className="w-3.5 h-3.5" /> Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
