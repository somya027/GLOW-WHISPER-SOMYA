import { AdminLayout } from "@/components/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Flag, Download, StickyNote } from "lucide-react";
import { useState } from "react";

const messages = [
  { sender: "user", text: "Hi! I'm looking for a good moisturizer for combination skin.", sentiment: 7.5 },
  { sender: "ai", text: "Hello! Great question. For combination skin, I'd recommend our Rose Petal Moisturizer. It hydrates dry areas without making oily zones greasy. Would you like to know more?", sentiment: 8.0 },
  { sender: "user", text: "Yes please! Does it have any fragrances? I have sensitive skin too.", sentiment: 7.0 },
  { sender: "ai", text: "The Rose Petal Moisturizer is fragrance-free and hypoallergenic! It's also dermatologist tested. Perfect for sensitive combination skin.", sentiment: 8.5 },
  { sender: "user", text: "That sounds perfect! What about SPF? I need sun protection too.", sentiment: 7.8 },
  { sender: "ai", text: "Great thinking! While the moisturizer doesn't include SPF, I'd recommend pairing it with our Sheer Shield SPF 50. Together, they provide complete hydration and sun protection.", sentiment: 8.2 },
  { sender: "user", text: "My last order was damaged though, I'm a bit hesitant to order again.", sentiment: 3.2 },
  { sender: "ai", text: "I'm so sorry about that experience! I can assure you we've improved our packaging. Plus, we offer free returns if anything arrives damaged. Would you like me to add both products to your cart?", sentiment: 7.0 },
  { sender: "user", text: "Okay, let's try it. Add both to my cart please!", sentiment: 8.5 },
];

export default function ConversationViewerPage() {
  const [note, setNote] = useState("");
  const [showNote, setShowNote] = useState(false);

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold">Conversation CS-4521</h1>
            <p className="text-sm text-muted-foreground">Sarah Mitchell · Started 10:24 AM · Duration: 12 min</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><Flag className="h-3.5 w-3.5 mr-1" /> Flag</Button>
            <Button variant="outline" size="sm" onClick={() => setShowNote(!showNote)}><StickyNote className="h-3.5 w-3.5 mr-1" /> Note</Button>
            <Button variant="outline" size="sm"><Download className="h-3.5 w-3.5 mr-1" /> Export</Button>
          </div>
        </div>

        {showNote && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="stat-card">
            <Textarea placeholder="Add a note about this conversation..." value={note} onChange={(e) => setNote(e.target.value)} rows={3} />
            <Button size="sm" className="mt-2">Save Note</Button>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="stat-card">
          <div className="space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] space-y-1 ${m.sender === "user" ? "items-end" : "items-start"}`}>
                  <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                    m.sender === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-muted rounded-bl-md"
                  } ${m.sentiment < 4 ? "ring-2 ring-destructive/30" : ""}`}>
                    {m.text}
                  </div>
                  <div className="flex items-center gap-2 px-1">
                    <span className={`text-[10px] font-medium ${
                      m.sentiment >= 7 ? "text-success" : m.sentiment >= 4 ? "text-warning" : "text-destructive"
                    }`}>
                      Sentiment: {m.sentiment}
                    </span>
                    {m.sentiment < 4 && <Badge variant="destructive" className="text-[9px] h-4">Low</Badge>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
