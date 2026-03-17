import { AdminLayout } from "@/components/AdminLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

export default function SettingsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-2xl font-display font-bold">Settings</h1>
          <p className="text-sm text-muted-foreground">Configure chatbot and admin settings</p>
        </div>

        <Tabs defaultValue="ai" className="space-y-4">
          <TabsList>
            <TabsTrigger value="ai">AI Configuration</TabsTrigger>
            <TabsTrigger value="products">Product Recommendations</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="ai">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="stat-card space-y-6">
              <div className="space-y-2">
                <Label>System Prompt</Label>
                <Textarea rows={5} defaultValue="You are a helpful skincare assistant for Aura Skincare. Help customers find the right products for their skin type and concerns. Be friendly, knowledgeable, and recommend products from our catalog." />
              </div>
              <div className="space-y-2">
                <Label>AI Temperature</Label>
                <Slider defaultValue={[0.7]} max={1} step={0.1} className="w-full" />
                <p className="text-xs text-muted-foreground">Controls creativity. Lower = more focused, Higher = more creative</p>
              </div>
              <div className="space-y-2">
                <Label>Max Response Length</Label>
                <Input type="number" defaultValue="500" />
              </div>
              <Button>Save Changes</Button>
            </motion.div>
          </TabsContent>

          <TabsContent value="products">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="stat-card space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Product Recommendations</Label>
                  <p className="text-xs text-muted-foreground">AI will suggest products during conversations</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Personalized Recommendations</Label>
                  <p className="text-xs text-muted-foreground">Use purchase history for tailored suggestions</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Label>Max Products per Chat</Label>
                <Input type="number" defaultValue="3" />
              </div>
              <Button>Save Changes</Button>
            </motion.div>
          </TabsContent>

          <TabsContent value="alerts">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="stat-card space-y-6">
              <div className="space-y-2">
                <Label>Negative Sentiment Threshold</Label>
                <Slider defaultValue={[3]} max={10} step={0.5} className="w-full" />
                <p className="text-xs text-muted-foreground">Alert when sentiment drops below this score</p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-Escalate Negative Chats</Label>
                  <p className="text-xs text-muted-foreground">Automatically flag chats with low sentiment</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Button>Save Changes</Button>
            </motion.div>
          </TabsContent>

          <TabsContent value="notifications">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="stat-card space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-xs text-muted-foreground">Receive daily summary via email</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Real-time Alerts</Label>
                  <p className="text-xs text-muted-foreground">Push notifications for critical events</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Label>Alert Email</Label>
                <Input type="email" defaultValue="admin@auraskincare.com" />
              </div>
              <Button>Save Changes</Button>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
