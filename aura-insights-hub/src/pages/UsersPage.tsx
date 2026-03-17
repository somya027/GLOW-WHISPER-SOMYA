import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Search, X, ArrowLeft } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const usersData = [
  { id: "U-1001", name: "Sarah Mitchell", email: "sarah@email.com", mobile: "+1 555-0101", type: "Premium", signup: "Jan 12, 2025", purchases: 24, chats: 18 },
  { id: "U-1002", name: "Emily Roberts", email: "emily@email.com", mobile: "+1 555-0102", type: "Standard", signup: "Feb 3, 2025", purchases: 12, chats: 8 },
  { id: "U-1003", name: "Jessica Lee", email: "jessica@email.com", mobile: "+1 555-0103", type: "Premium", signup: "Mar 15, 2025", purchases: 31, chats: 22 },
  { id: "U-1004", name: "Maria Garcia", email: "maria@email.com", mobile: "+1 555-0104", type: "Standard", signup: "Apr 8, 2025", purchases: 7, chats: 5 },
  { id: "U-1005", name: "Lisa Kim", email: "lisa@email.com", mobile: "+1 555-0105", type: "Premium", signup: "May 21, 2025", purchases: 19, chats: 14 },
  { id: "U-1006", name: "Anonymous", email: "—", mobile: "—", type: "Anonymous", signup: "—", purchases: 0, chats: 3 },
  { id: "U-1007", name: "Anonymous", email: "—", mobile: "—", type: "Anonymous", signup: "—", purchases: 0, chats: 1 },
];

const sentimentTrend = [
  { month: "Jan", score: 7.2 }, { month: "Feb", score: 7.8 }, { month: "Mar", score: 8.1 },
  { month: "Apr", score: 7.9 }, { month: "May", score: 8.4 }, { month: "Jun", score: 8.6 },
];

const orderHistory = [
  { id: "#ORD-4521", product: "Radiance Glow Serum", date: "Mar 1, 2025", amount: "$48.00", status: "Delivered" },
  { id: "#ORD-4498", product: "Rose Petal Moisturizer", date: "Feb 14, 2025", amount: "$35.00", status: "Delivered" },
  { id: "#ORD-4467", product: "Vitamin C Brightener", date: "Jan 28, 2025", amount: "$42.00", status: "Delivered" },
];

export default function UsersPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<typeof usersData[0] | null>(null);

  const filtered = usersData.filter(u => {
    if (filter === "logged-in" && u.type === "Anonymous") return false;
    if (filter === "anonymous" && u.type !== "Anonymous") return false;
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (selectedUser) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <button onClick={() => setSelectedUser(null)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Users
          </button>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="stat-card">
              <h3 className="font-display font-semibold mb-3">Profile</h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-muted-foreground">Name:</span> {selectedUser.name}</p>
                <p><span className="text-muted-foreground">Email:</span> {selectedUser.email}</p>
                <p><span className="text-muted-foreground">Mobile:</span> {selectedUser.mobile}</p>
                <p><span className="text-muted-foreground">Account:</span> <Badge variant="secondary" className="text-[10px]">{selectedUser.type}</Badge></p>
                <p><span className="text-muted-foreground">Signup:</span> {selectedUser.signup}</p>
                <p><span className="text-muted-foreground">Purchases:</span> {selectedUser.purchases}</p>
                <p><span className="text-muted-foreground">Chat Sessions:</span> {selectedUser.chats}</p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }} className="stat-card lg:col-span-2">
              <h3 className="font-display font-semibold mb-3">Sentiment Trend</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={sentimentTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(270, 20%, 92%)" />
                  <XAxis dataKey="month" fontSize={12} stroke="hsl(270, 10%, 50%)" />
                  <YAxis fontSize={12} stroke="hsl(270, 10%, 50%)" domain={[0, 10]} />
                  <Tooltip contentStyle={{ borderRadius: 12, fontSize: 13 }} />
                  <Line type="monotone" dataKey="score" stroke="hsl(330, 60%, 65%)" strokeWidth={2} dot={{ fill: "hsl(330, 60%, 65%)" }} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="stat-card">
            <h3 className="font-display font-semibold mb-3">Order History</h3>
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border/50">
                <th className="text-left py-2 px-2 text-muted-foreground font-medium">Order ID</th>
                <th className="text-left py-2 px-2 text-muted-foreground font-medium">Product</th>
                <th className="text-left py-2 px-2 text-muted-foreground font-medium">Date</th>
                <th className="text-left py-2 px-2 text-muted-foreground font-medium">Amount</th>
                <th className="text-left py-2 px-2 text-muted-foreground font-medium">Status</th>
              </tr></thead>
              <tbody>
                {orderHistory.map((o) => (
                  <tr key={o.id} className="border-b border-border/30">
                    <td className="py-2 px-2 font-mono text-xs">{o.id}</td>
                    <td className="py-2 px-2">{o.product}</td>
                    <td className="py-2 px-2 text-muted-foreground">{o.date}</td>
                    <td className="py-2 px-2">{o.amount}</td>
                    <td className="py-2 px-2"><Badge variant="secondary" className="text-[10px]">{o.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Users</h1>
          <p className="text-sm text-muted-foreground">Manage website users</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="logged-in">Logged In</SelectItem>
              <SelectItem value="anonymous">Anonymous</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="stat-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border/50">
                <th className="text-left py-3 px-2 text-muted-foreground font-medium">User ID</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-medium">Name</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-medium">Email</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-medium">Mobile</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-medium">Type</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-medium">Signup</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-medium">Purchases</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-medium">Chats</th>
              </tr></thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id} onClick={() => u.type !== "Anonymous" && setSelectedUser(u)} className={`border-b border-border/30 transition-colors ${u.type !== "Anonymous" ? "hover:bg-muted/30 cursor-pointer" : ""}`}>
                    <td className="py-3 px-2 font-mono text-xs">{u.id}</td>
                    <td className="py-3 px-2">{u.name}</td>
                    <td className="py-3 px-2 text-muted-foreground">{u.email}</td>
                    <td className="py-3 px-2 text-muted-foreground">{u.mobile}</td>
                    <td className="py-3 px-2"><Badge variant={u.type === "Premium" ? "default" : "secondary"} className="text-[10px]">{u.type}</Badge></td>
                    <td className="py-3 px-2 text-muted-foreground">{u.signup}</td>
                    <td className="py-3 px-2">{u.purchases}</td>
                    <td className="py-3 px-2">{u.chats}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
