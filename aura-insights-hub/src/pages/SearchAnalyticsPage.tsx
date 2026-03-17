import { AdminLayout } from "@/components/AdminLayout";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const topSearched = [
  { keyword: "moisturizer", searches: 1245 }, { keyword: "serum", searches: 987 },
  { keyword: "vitamin c", searches: 856 }, { keyword: "anti-aging", searches: 734 },
  { keyword: "sunscreen", searches: 678 },
];

const trendingKeywords = [
  { keyword: "retinol", searches: 456, trend: "+34%" },
  { keyword: "niacinamide", searches: 389, trend: "+28%" },
  { keyword: "peptides", searches: 312, trend: "+22%" },
  { keyword: "bakuchiol", searches: 245, trend: "+45%" },
];

const failedSearches = [
  { keyword: "foundation", searches: 89, note: "Not in catalog" },
  { keyword: "mascara", searches: 67, note: "Not in catalog" },
  { keyword: "hair serum", searches: 54, note: "Wrong category" },
];

const searchTable = [
  { keyword: "moisturizer for dry skin", searches: 456, clicked: "Yes", conversion: "12.3%" },
  { keyword: "best vitamin c serum", searches: 389, clicked: "Yes", conversion: "15.7%" },
  { keyword: "anti-aging cream", searches: 312, clicked: "Yes", conversion: "9.8%" },
  { keyword: "organic sunscreen", searches: 245, clicked: "Yes", conversion: "11.2%" },
  { keyword: "sensitive skin cleanser", searches: 198, clicked: "No", conversion: "—" },
  { keyword: "hyaluronic acid benefits", searches: 167, clicked: "Yes", conversion: "8.4%" },
];

const Card = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => (
  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} className={`stat-card ${className}`}>{children}</motion.div>
);

export default function SearchAnalyticsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Search Analytics</h1>
          <p className="text-sm text-muted-foreground">What customers are searching for</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card delay={0.05}>
            <h3 className="font-display font-semibold mb-4">Top Searched Products</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={topSearched}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(270, 20%, 92%)" />
                <XAxis dataKey="keyword" fontSize={11} stroke="hsl(270, 10%, 50%)" />
                <YAxis fontSize={12} stroke="hsl(270, 10%, 50%)" />
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 13 }} />
                <Bar dataKey="searches" fill="hsl(330, 60%, 65%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card delay={0.1}>
            <h3 className="font-display font-semibold mb-4">Trending Keywords</h3>
            <div className="space-y-3">
              {trendingKeywords.map((k, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div>
                    <p className="font-medium text-sm capitalize">{k.keyword}</p>
                    <p className="text-xs text-muted-foreground">{k.searches} searches</p>
                  </div>
                  <span className="text-sm font-medium text-success">{k.trend}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card delay={0.15}>
          <h3 className="font-display font-semibold mb-4">Failed Searches</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {failedSearches.map((f, i) => (
              <div key={i} className="p-3 rounded-lg bg-destructive/5 border border-destructive/10">
                <p className="font-medium text-sm capitalize">{f.keyword}</p>
                <p className="text-xs text-muted-foreground">{f.searches} searches · {f.note}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card delay={0.2}>
          <h3 className="font-display font-semibold mb-4">Search Details</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-3 px-2 text-muted-foreground font-medium">Search Keyword</th>
                  <th className="text-left py-3 px-2 text-muted-foreground font-medium">Searches</th>
                  <th className="text-left py-3 px-2 text-muted-foreground font-medium">Result Clicked</th>
                  <th className="text-left py-3 px-2 text-muted-foreground font-medium">Conversion</th>
                </tr>
              </thead>
              <tbody>
                {searchTable.map((s, i) => (
                  <tr key={i} className="border-b border-border/30">
                    <td className="py-3 px-2 font-medium">{s.keyword}</td>
                    <td className="py-3 px-2 text-muted-foreground">{s.searches}</td>
                    <td className="py-3 px-2 text-muted-foreground">{s.clicked}</td>
                    <td className="py-3 px-2 text-muted-foreground">{s.conversion}</td>
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
