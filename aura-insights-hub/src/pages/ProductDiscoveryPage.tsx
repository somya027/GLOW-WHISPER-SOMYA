import { AdminLayout } from "@/components/AdminLayout";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const topRecommended = [
  { name: "Radiance Glow Serum", recs: 487, clicks: 342, purchases: 89 },
  { name: "Rose Petal Moisturizer", recs: 412, clicks: 298, purchases: 76 },
  { name: "Vitamin C Brightener", recs: 356, clicks: 234, purchases: 62 },
  { name: "Hyaluronic Hydrator", recs: 298, clicks: 198, purchases: 54 },
  { name: "Night Repair Cream", recs: 267, clicks: 178, purchases: 48 },
];

const recFrequency = [
  { day: "Mon", recs: 245 }, { day: "Tue", recs: 312 }, { day: "Wed", recs: 389 },
  { day: "Thu", recs: 356 }, { day: "Fri", recs: 421 }, { day: "Sat", recs: 278 }, { day: "Sun", recs: 198 },
];

const conversionRate = [
  { name: "Glow Serum", rate: 18.3 }, { name: "Moisturizer", rate: 18.4 },
  { name: "Vitamin C", rate: 17.4 }, { name: "Hydrator", rate: 18.1 }, { name: "Night Cream", rate: 18.0 },
];

const Card = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => (
  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} className={`stat-card ${className}`}>{children}</motion.div>
);

export default function ProductDiscoveryPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Product Discovery</h1>
          <p className="text-sm text-muted-foreground">Products discovered through AI chat</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[{ label: "Most Recommended", product: "Radiance Glow Serum", value: "487 recs" },
            { label: "Most Clicked", product: "Radiance Glow Serum", value: "342 clicks" },
            { label: "Top Post-Chat Purchase", product: "Radiance Glow Serum", value: "89 purchases" }
          ].map((w, i) => (
            <Card key={i} delay={i * 0.05}>
              <p className="text-sm text-muted-foreground">{w.label}</p>
              <p className="text-lg font-display font-bold mt-1">{w.product}</p>
              <p className="text-xs text-primary mt-0.5">{w.value}</p>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card delay={0.15}>
            <h3 className="font-display font-semibold mb-4">Recommendation Frequency</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={recFrequency}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(270, 20%, 92%)" />
                <XAxis dataKey="day" fontSize={12} stroke="hsl(270, 10%, 50%)" />
                <YAxis fontSize={12} stroke="hsl(270, 10%, 50%)" />
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 13 }} />
                <Bar dataKey="recs" fill="hsl(330, 60%, 65%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card delay={0.2}>
            <h3 className="font-display font-semibold mb-4">Conversion Rate per Product (%)</h3>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={conversionRate}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(270, 20%, 92%)" />
                <XAxis dataKey="name" fontSize={11} stroke="hsl(270, 10%, 50%)" />
                <YAxis fontSize={12} stroke="hsl(270, 10%, 50%)" />
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 13 }} />
                <Line type="monotone" dataKey="rate" stroke="hsl(270, 50%, 70%)" strokeWidth={2} dot={{ fill: "hsl(270, 50%, 70%)", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <Card delay={0.25}>
          <h3 className="font-display font-semibold mb-4">Product Performance</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-3 px-2 text-muted-foreground font-medium">Product</th>
                  <th className="text-left py-3 px-2 text-muted-foreground font-medium">Recommendations</th>
                  <th className="text-left py-3 px-2 text-muted-foreground font-medium">Click Rate</th>
                  <th className="text-left py-3 px-2 text-muted-foreground font-medium">Purchase Rate</th>
                </tr>
              </thead>
              <tbody>
                {topRecommended.map((p) => (
                  <tr key={p.name} className="border-b border-border/30">
                    <td className="py-3 px-2 font-medium">{p.name}</td>
                    <td className="py-3 px-2 text-muted-foreground">{p.recs}</td>
                    <td className="py-3 px-2 text-muted-foreground">{((p.clicks / p.recs) * 100).toFixed(1)}%</td>
                    <td className="py-3 px-2 text-muted-foreground">{((p.purchases / p.recs) * 100).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
