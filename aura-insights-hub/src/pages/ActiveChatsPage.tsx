import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { X } from "lucide-react";

const sessions = [
  { id: "CS-4521", userType: "Logged In", name: "Sarah Mitchell", message: "Can you recommend a serum for dry skin?", sentiment: 8.5, startTime: "10:24 AM", status: "Active" },
  { id: "CS-4522", userType: "Anonymous", name: "—", message: "What's the return policy?", sentiment: 6.2, startTime: "10:31 AM", status: "Active" },
  { id: "CS-4523", userType: "Logged In", name: "Emily Roberts", message: "My order hasn't arrived yet", sentiment: 3.1, startTime: "10:35 AM", status: "Active" },
  { id: "CS-4524", userType: "Logged In", name: "Jessica Lee", message: "Love the new moisturizer!", sentiment: 9.2, startTime: "10:42 AM", status: "Active" },
  { id: "CS-4525", userType: "Anonymous", name: "—", message: "Do you have vegan products?", sentiment: 7.0, startTime: "10:48 AM", status: "Active" },
  { id: "CS-4526", userType: "Logged In", name: "Maria Garcia", message: "Need help choosing a gift set", sentiment: 7.8, startTime: "9:15 AM", status: "Closed" },
  { id: "CS-4527", userType: "Anonymous", name: "—", message: "Is the vitamin C serum in stock?", sentiment: 6.5, startTime: "9:02 AM", status: "Closed" },
];

const chatMessages = [
  { sender: "user", text: "Hi! Can you recommend a serum for dry skin?" },
  { sender: "ai", text: "Of course! For dry skin, I'd recommend our Radiance Glow Serum with hyaluronic acid. It provides deep hydration and leaves your skin feeling plump and refreshed." },
  { sender: "user", text: "That sounds great! Does it work well with sensitive skin too?" },
  { sender: "ai", text: "Absolutely! The Radiance Glow Serum is formulated for all skin types, including sensitive skin. It's fragrance-free and dermatologist tested." },
  { sender: "user", text: "Perfect, I'll add it to my cart!" },
];

export default function ActiveChatsPage() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Active Chat Sessions</h1>
          <p className="text-sm text-muted-foreground">Live monitoring of chatbot conversations</p>
        </div>

        <div className="flex gap-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`flex-1 stat-card overflow-auto ${selected ? "hidden lg:block" : ""}`}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Session ID</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Type</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Name</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Current Message</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Sentiment</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Start</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((s) => (
                    <tr key={s.id} onClick={() => setSelected(s.id)} className="border-b border-border/30 hover:bg-muted/30 cursor-pointer transition-colors">
                      <td className="py-3 px-2 font-mono text-xs">{s.id}</td>
                      <td className="py-3 px-2"><Badge variant={s.userType === "Logged In" ? "default" : "secondary"} className="text-[10px]">{s.userType}</Badge></td>
                      <td className="py-3 px-2">{s.name}</td>
                      <td className="py-3 px-2 max-w-[200px] truncate text-muted-foreground">{s.message}</td>
                      <td className="py-3 px-2">
                        <span className={`font-medium ${s.sentiment >= 7 ? "text-success" : s.sentiment >= 5 ? "text-warning" : "text-destructive"}`}>{s.sentiment}</span>
                      </td>
                      <td className="py-3 px-2 text-muted-foreground">{s.startTime}</td>
                      <td className="py-3 px-2"><Badge variant={s.status === "Active" ? "default" : "outline"} className="text-[10px]">{s.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {selected && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full lg:w-96 stat-card flex-shrink-0">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold">Chat Viewer</h3>
                <button onClick={() => setSelected(null)} className="p-1 hover:bg-muted rounded"><X className="h-4 w-4" /></button>
              </div>
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {chatMessages.map((m, i) => (
                  <div key={i} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] px-3 py-2 rounded-xl text-sm ${m.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
