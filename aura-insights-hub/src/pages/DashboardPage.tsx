import { Users, MessageSquare, MessagesSquare, SmilePlus, ShoppingCart } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { AdminLayout } from "@/components/AdminLayout";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

const chatVolumeData = [
  { hour: "6am", chats: 12 }, { hour: "8am", chats: 34 }, { hour: "10am", chats: 78 },
  { hour: "12pm", chats: 92 }, { hour: "2pm", chats: 105 }, { hour: "4pm", chats: 88 },
  { hour: "6pm", chats: 67 }, { hour: "8pm", chats: 45 }, { hour: "10pm", chats: 23 },
];

const topProducts = [
  { name: "Glow Serum", searches: 342 }, { name: "Rose Moisturizer", searches: 289 },
  { name: "Vitamin C Cream", searches: 234 }, { name: "Hyaluronic Acid", searches: 198 },
  { name: "Night Repair", searches: 167 },
];

const sentimentData = [
  { name: "Positive", value: 62, color: "hsl(160, 50%, 45%)" },
  { name: "Neutral", value: 28, color: "hsl(270, 50%, 70%)" },
  { name: "Negative", value: 10, color: "hsl(0, 72%, 60%)" },
];

const recentChats = [
  { user: "Sarah M.", message: "Looking for anti-aging products", sentiment: "positive", time: "2m ago" },
  { user: "Anonymous", message: "What's the best moisturizer?", sentiment: "neutral", time: "5m ago" },
  { user: "Emily R.", message: "Issue with my order #4521", sentiment: "negative", time: "8m ago" },
  { user: "Lisa K.", message: "Love the glow serum!", sentiment: "positive", time: "12m ago" },
];

const trendingProducts = [
  { name: "Radiance Glow Serum", trend: "+24%", sales: 156 },
  { name: "Rose Petal Moisturizer", trend: "+18%", sales: 132 },
  { name: "Vitamin C Brightener", trend: "+12%", sales: 98 },
];

export default function DashboardPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back! Here's your overview.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard title="Total Users" value="12,847" change="+8.2% from last month" icon={Users} delay={0} />
          <StatCard title="Active Sessions" value="142" change="+12 from last hour" icon={MessageSquare} delay={0.05} />
          <StatCard title="Conversations Today" value="1,284" change="+5.4% from yesterday" icon={MessagesSquare} delay={0.1} />
          <StatCard title="Avg Sentiment" value="8.4/10" change="+0.3 from last week" icon={SmilePlus} delay={0.15} />
          <StatCard title="Chat → Purchase" value="23.5%" change="+2.1% from last month" icon={ShoppingCart} delay={0.2} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="lg:col-span-2 stat-card">
            <h3 className="font-display font-semibold mb-4">Chat Volume by Hour</h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chatVolumeData}>
                <defs>
                  <linearGradient id="chatGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(330, 60%, 65%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(330, 60%, 65%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(270, 20%, 92%)" />
                <XAxis dataKey="hour" fontSize={12} stroke="hsl(270, 10%, 50%)" />
                <YAxis fontSize={12} stroke="hsl(270, 10%, 50%)" />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(270, 20%, 92%)", fontSize: 13 }} />
                <Area type="monotone" dataKey="chats" stroke="hsl(330, 60%, 65%)" fill="url(#chatGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="stat-card">
            <h3 className="font-display font-semibold mb-4">Sentiment Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={sentimentData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                  {sentimentData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 13 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2">
              {sentimentData.map((s) => (
                <div key={s.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                  {s.name} ({s.value}%)
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="stat-card">
            <h3 className="font-display font-semibold mb-4">Top Searched Products</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={topProducts} layout="vertical">
                <XAxis type="number" fontSize={12} stroke="hsl(270, 10%, 50%)" />
                <YAxis type="category" dataKey="name" fontSize={11} stroke="hsl(270, 10%, 50%)" width={100} />
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 13 }} />
                <Bar dataKey="searches" fill="hsl(270, 50%, 70%)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="stat-card">
            <h3 className="font-display font-semibold mb-4">Recently Active Chats</h3>
            <div className="space-y-3">
              {recentChats.map((chat, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/30">
                  <div className={`h-2 w-2 rounded-full flex-shrink-0 ${chat.sentiment === "positive" ? "bg-success" : chat.sentiment === "negative" ? "bg-destructive" : "bg-accent"}`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{chat.user}</p>
                    <p className="text-xs text-muted-foreground truncate">{chat.message}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground flex-shrink-0">{chat.time}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="stat-card">
            <h3 className="font-display font-semibold mb-4">Trending Products</h3>
            <div className="space-y-3">
              {trendingProducts.map((p, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30">
                  <div>
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.sales} sales this week</p>
                  </div>
                  <span className="text-xs font-medium text-success">{p.trend}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
}
