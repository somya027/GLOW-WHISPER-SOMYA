import { AdminLayout } from "@/components/AdminLayout";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line } from "recharts";

const chatsPerDay = [
  { day: "Mon", chats: 845 }, { day: "Tue", chats: 932 }, { day: "Wed", chats: 1102 },
  { day: "Thu", chats: 987 }, { day: "Fri", chats: 1284 }, { day: "Sat", chats: 756 }, { day: "Sun", chats: 623 },
];

const latencyData = [
  { hour: "6am", latency: 1.2 }, { hour: "8am", latency: 1.8 }, { hour: "10am", latency: 2.1 },
  { hour: "12pm", latency: 2.4 }, { hour: "2pm", latency: 1.9 }, { hour: "4pm", latency: 1.6 },
  { hour: "6pm", latency: 1.4 }, { hour: "8pm", latency: 1.1 },
];

const completionData = [
  { name: "Completed", value: 78, color: "hsl(160, 50%, 45%)" },
  { name: "Abandoned", value: 15, color: "hsl(40, 90%, 55%)" },
  { name: "Escalated", value: 7, color: "hsl(270, 50%, 70%)" },
];

const interventionData = [
  { day: "Mon", ai: 92, human: 8 }, { day: "Tue", ai: 89, human: 11 }, { day: "Wed", ai: 94, human: 6 },
  { day: "Thu", ai: 91, human: 9 }, { day: "Fri", ai: 88, human: 12 }, { day: "Sat", ai: 95, human: 5 }, { day: "Sun", ai: 96, human: 4 },
];

const sentimentTrend = [
  { day: "Mon", positive: 58, neutral: 30, negative: 12 },
  { day: "Tue", positive: 62, neutral: 27, negative: 11 },
  { day: "Wed", positive: 65, neutral: 25, negative: 10 },
  { day: "Thu", positive: 60, neutral: 28, negative: 12 },
  { day: "Fri", positive: 68, neutral: 23, negative: 9 },
  { day: "Sat", positive: 70, neutral: 22, negative: 8 },
  { day: "Sun", positive: 64, neutral: 26, negative: 10 },
];

const Card = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => (
  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} className={`stat-card ${className}`}>
    {children}
  </motion.div>
);

export default function ChatAnalyticsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Chat Analytics</h1>
          <p className="text-sm text-muted-foreground">Chatbot performance insights</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card delay={0.05}>
            <h3 className="font-display font-semibold mb-4">Total Chats Per Day</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chatsPerDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(270, 20%, 92%)" />
                <XAxis dataKey="day" fontSize={12} stroke="hsl(270, 10%, 50%)" />
                <YAxis fontSize={12} stroke="hsl(270, 10%, 50%)" />
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 13 }} />
                <Bar dataKey="chats" fill="hsl(330, 60%, 65%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card delay={0.1}>
            <h3 className="font-display font-semibold mb-4">Average Response Latency (s)</h3>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={latencyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(270, 20%, 92%)" />
                <XAxis dataKey="hour" fontSize={12} stroke="hsl(270, 10%, 50%)" />
                <YAxis fontSize={12} stroke="hsl(270, 10%, 50%)" />
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 13 }} />
                <Line type="monotone" dataKey="latency" stroke="hsl(270, 50%, 70%)" strokeWidth={2} dot={{ fill: "hsl(270, 50%, 70%)" }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card delay={0.15}>
            <h3 className="font-display font-semibold mb-4">Conversation Completion</h3>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={completionData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                  {completionData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 13 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4">
              {completionData.map((s) => (
                <div key={s.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                  {s.name} ({s.value}%)
                </div>
              ))}
            </div>
          </Card>

          <Card delay={0.2}>
            <h3 className="font-display font-semibold mb-4">AI vs Human Intervention (%)</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={interventionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(270, 20%, 92%)" />
                <XAxis dataKey="day" fontSize={12} stroke="hsl(270, 10%, 50%)" />
                <YAxis fontSize={12} stroke="hsl(270, 10%, 50%)" />
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 13 }} />
                <Bar dataKey="ai" stackId="a" fill="hsl(330, 60%, 65%)" radius={[0, 0, 0, 0]} />
                <Bar dataKey="human" stackId="a" fill="hsl(270, 50%, 70%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <Card delay={0.25}>
          <h3 className="font-display font-semibold mb-4">Sentiment Analysis Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={sentimentTrend}>
              <defs>
                <linearGradient id="posGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(160, 50%, 45%)" stopOpacity={0.3} /><stop offset="100%" stopColor="hsl(160, 50%, 45%)" stopOpacity={0} /></linearGradient>
                <linearGradient id="neuGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(270, 50%, 70%)" stopOpacity={0.3} /><stop offset="100%" stopColor="hsl(270, 50%, 70%)" stopOpacity={0} /></linearGradient>
                <linearGradient id="negGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(0, 72%, 60%)" stopOpacity={0.3} /><stop offset="100%" stopColor="hsl(0, 72%, 60%)" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(270, 20%, 92%)" />
              <XAxis dataKey="day" fontSize={12} stroke="hsl(270, 10%, 50%)" />
              <YAxis fontSize={12} stroke="hsl(270, 10%, 50%)" />
              <Tooltip contentStyle={{ borderRadius: 12, fontSize: 13 }} />
              <Area type="monotone" dataKey="positive" stroke="hsl(160, 50%, 45%)" fill="url(#posGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="neutral" stroke="hsl(270, 50%, 70%)" fill="url(#neuGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="negative" stroke="hsl(0, 72%, 60%)" fill="url(#negGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </AdminLayout>
  );
}
