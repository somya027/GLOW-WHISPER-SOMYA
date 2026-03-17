import React, { useState, useRef } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Brain,
  Database,
  FlaskConical,
  Save,
  RotateCcw,
  Upload,
  Trash2,
  RefreshCw,
  Info,
  FileText,
  BookOpen,
  HelpCircle,
  Leaf,
  Headset,
  CheckCircle2,
  Clock,
  AlertCircle,
  SendHorizonal,
  ChevronDown,
  ShieldCheck,
  Cpu,
  KeyRound,
  Eye,
  EyeOff,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────
// Label helpers
// ─────────────────────────────────────────────────────────────
function getTempLabel(value: number): string {
  if (value <= 0.3) return "Deterministic — consistent, factual answers";
  if (value <= 0.6) return "Balanced — natural and on-point";
  if (value <= 0.8) return "Creative — varied, engaging responses";
  return "High variance — experimental outputs";
}

function getTopPLabel(value: number): string {
  if (value <= 0.5) return "Low diversity — tightly scoped tokens";
  if (value <= 0.8) return "Moderate diversity — balanced sampling";
  return "High diversity — wide token sampling";
}

// ─────────────────────────────────────────────────────────────
// Mock data
// ─────────────────────────────────────────────────────────────
const DEFAULT_SYSTEM_PROMPT =
  "You are Aura Skincare's AI beauty assistant. Help users find skincare and haircare products, recommend routines, answer product questions, and assist with orders. Always be warm, professional, and knowledgeable. Prioritize product recommendations from the Aura catalog.";

const mockDocuments = [
  {
    id: "1",
    name: "Aura Product Catalog Q1 2026.pdf",
    type: "PDF",
    uploadDate: "Mar 1, 2026",
    status: "Indexed" as const,
    size: "4.2 MB",
  },
  {
    id: "2",
    name: "Customer FAQ v3.pdf",
    type: "FAQ",
    uploadDate: "Feb 20, 2026",
    status: "Indexed" as const,
    size: "1.1 MB",
  },
  {
    id: "3",
    name: "Ingredient Knowledge Base.csv",
    type: "Product Catalog",
    uploadDate: "Mar 7, 2026",
    status: "Processing" as const,
    size: "892 KB",
  },
  {
    id: "4",
    name: "Support Articles Bundle.pdf",
    type: "FAQ",
    uploadDate: "Mar 9, 2026",
    status: "Indexed" as const,
    size: "2.8 MB",
  },
];

const versionHistory = [
  "v1.4 – Mar 9, 2026 (current)",
  "v1.3 – Mar 5, 2026",
  "v1.2 – Feb 28, 2026",
  "v1.1 – Feb 14, 2026",
  "v1.0 – Jan 30, 2026",
];

// ─────────────────────────────────────────────────────────────
// Helper sub-components
// ─────────────────────────────────────────────────────────────
function SectionHeader({
  icon: Icon,
  title,
  description,
}: Readonly<{
  icon: React.ElementType;
  title: string;
  description: string;
}>) {
  return (
    <div className="flex items-start gap-3 mb-5">
      <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="h-4.5 w-4.5 text-primary" style={{ height: 18, width: 18 }} />
      </div>
      <div>
        <h2 className="text-base font-display font-semibold text-foreground">{title}</h2>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
    </div>
  );
}

function ParamTooltip({ text }: Readonly<{ text: string }>) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help ml-1.5 inline-block" />
      </TooltipTrigger>
      <TooltipContent side="right" className="max-w-[220px] text-xs">
        {text}
      </TooltipContent>
    </Tooltip>
  );
}

function StatusBadge({ status }: Readonly<{ status: "Indexed" | "Processing" }>) {
  if (status === "Indexed") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 border border-emerald-200">
        <CheckCircle2 className="h-3 w-3" /> Indexed
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 border border-amber-200 animate-pulse">
      <Clock className="h-3 w-3" /> Processing
    </span>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────
export default function AgentConfigPage() {
  // System Prompt
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT);
  const [isDirty, setIsDirty] = useState(false);

  // Model Parameters
  const [temperature, setTemperature] = useState([0.7]);
  const [maxTokens, setMaxTokens] = useState(512);
  const [topP, setTopP] = useState([0.9]);

  // Knowledge docs
  const [documents, setDocuments] = useState(mockDocuments);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Knowledge toggles
  const [productCatalog, setProductCatalog] = useState(true);
  const [faqDatabase, setFaqDatabase] = useState(true);
  const [supportArticles, setSupportArticles] = useState(false);
  const [ingredientKnowledge, setIngredientKnowledge] = useState(true);

  // OpenAI Key
  const [openAiKey, setOpenAiKey] = useState("sk-proj-••••••••••••••••••••••••••••••••");
  const [showKey, setShowKey] = useState(false);
  const [showKeyDialog, setShowKeyDialog] = useState(false);

  // Testing console
  const [testInput, setTestInput] = useState("");
  const [testResponse, setTestResponse] = useState("");
  const [isTesting, setIsTesting] = useState(false);

  // Save meta
  const [selectedVersion, setSelectedVersion] = useState(versionHistory[0]);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // ── Handlers ──
  const handlePromptChange = (val: string) => {
    setSystemPrompt(val);
    setIsDirty(true);
  };

  const handleReset = () => {
    setSystemPrompt(DEFAULT_SYSTEM_PROMPT);
    setIsDirty(false);
  };

  const handleDeleteDoc = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const markAllIndexed = () => {
    setDocuments((prev) => prev.map((d) => ({ ...d, status: "Indexed" as const })));
  };

  const handleReindex = () => {
    setDocuments((prev) => prev.map((d) => ({ ...d, status: "Processing" as const })));
    setTimeout(markAllIndexed, 2500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const newId = String(Date.now());
    const newDoc = {
      id: newId,
      name: file.name,
      type: file.name.endsWith(".pdf") ? "PDF" : "Product Catalog",
      uploadDate: "Mar 9, 2026",
      status: "Processing" as const,
      size: `${(file.size / 1024).toFixed(0)} KB`,
    };
    setDocuments((prev) => [newDoc, ...prev]);
    const markDocIndexed = () => {
      setDocuments((prev) =>
        prev.map((d) => (d.id === newId ? { ...d, status: "Indexed" as const } : d))
      );
    };
    setTimeout(markDocIndexed, 2500);
    e.target.value = "";
  };

  const handleTestResponse = async () => {
    if (!testInput.trim()) return;
    setIsTesting(true);
    setTestResponse("");
    await new Promise((res) => setTimeout(res, 1400));
    setTestResponse(
      `Based on your query "${testInput}", I'd recommend our **Radiance Glow Serum** — packed with Vitamin C and hyaluronic acid for brightening and deep hydration. For your routine, apply 2–3 drops after cleansing, morning and night. Would you like to explore more options tailored to your skin type?`
    );
    setIsTesting(false);
  };

  const handleSave = () => {
    setSaveSuccess(true);
    setIsDirty(false);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const indexedCount = documents.filter((d) => d.status === "Indexed").length;
  const totalEmbeddings = indexedCount * 1240 + 876;

  const cardClass = "bg-card border border-border/60 rounded-2xl p-6 shadow-sm";

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl">
        {/* ── Page Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start justify-between"
        >
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-display font-bold">AI Agent Configuration</h1>
              {isDirty && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 border border-amber-300">
                  <AlertCircle className="h-3 w-3" /> Unsaved changes
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Control your AI chatbot's behavior, model parameters, and knowledge base.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-muted-foreground">Agent Online</span>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════
            SECTION 1 — System Prompt
        ═══════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className={cardClass}
        >
          <SectionHeader
            icon={Bot}
            title="System Prompt"
            description="Define how the AI agent introduces itself and behaves across all conversations."
          />

          <div className="space-y-3">
            <div className="relative">
              <Textarea
                value={systemPrompt}
                onChange={(e) => handlePromptChange(e.target.value)}
                rows={7}
                className={cn(
                  "font-mono text-sm resize-none leading-relaxed transition-all",
                  "bg-muted/40 focus:bg-background border-border/60",
                  isDirty && "border-amber-400 ring-1 ring-amber-300"
                )}
                placeholder="Enter the system prompt…"
              />
              <span className="absolute bottom-2.5 right-3 text-[11px] text-muted-foreground tabular-nums">
                {systemPrompt.length} / 2000 chars
              </span>
            </div>

            {/* character bar */}
            <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{ width: `${Math.min((systemPrompt.length / 2000) * 100, 100)}%` }}
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Button size="sm" onClick={handleSave} className="gap-1.5">
                <Save className="h-3.5 w-3.5" />
                Save Prompt
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleReset}
                className="gap-1.5"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset to Default
              </Button>
            </div>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════
            SECTION 1b — API Keys
        ═══════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className={cardClass}
        >
          <SectionHeader
            icon={KeyRound}
            title="API Keys"
            description="Manage the OpenAI API key used by the AI agent. Keys are stored securely and never logged."
          />

          <div className="space-y-3">
            <Label className="text-sm">OpenAI API Key</Label>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Input
                  type={showKey ? "text" : "password"}
                  value={openAiKey}
                  onChange={(e) => { setOpenAiKey(e.target.value); setIsDirty(true); }}
                  className="font-mono text-sm pr-10 bg-muted/40"
                  placeholder="sk-proj-..."
                  autoComplete="off"
                  spellCheck={false}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (showKey) {
                      setShowKey(false);
                    } else {
                      setShowKeyDialog(true);
                    }
                  }}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showKey ? "Hide API key" : "Show API key"}
                >
                  {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowKey(false)}
                className="flex-shrink-0 gap-1.5"
              >
                <Save className="h-3.5 w-3.5" />
                Save Key
              </Button>
            </div>

            <div className="flex items-center gap-1.5 rounded-lg bg-muted/30 px-3 py-2 text-xs text-muted-foreground border border-border/30">
              <ShieldCheck className="h-3.5 w-3.5 flex-shrink-0 text-emerald-600" />
              Your API key is encrypted at rest. It is never exposed in logs or client-side responses.
            </div>
          </div>
        </motion.div>

        {/* Confirm reveal dialog */}
        <AlertDialog open={showKeyDialog} onOpenChange={setShowKeyDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-primary" />
                Reveal OpenAI Key?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to show your OpenAI API key? Make sure no one else can see your screen. Your key grants full access to your OpenAI account.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  setShowKey(true);
                  setShowKeyDialog(false);
                }}
              >
                Yes, show key
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* ═══════════════════════════════════════════════
            SECTION 2 — Model Parameters
        ═══════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={cardClass}
        >
          <SectionHeader
            icon={Cpu}
            title="Model Parameters"
            description="Fine-tune LLM behavior. Changes apply to all new conversations."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Temperature */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm">
                  Temperature
                  <ParamTooltip text="Controls creativity of responses. 0 = deterministic/focused, 1 = highly creative/varied." />
                </Label>
                <span className="font-mono text-sm font-semibold text-primary tabular-nums">
                  {temperature[0].toFixed(1)}
                </span>
              </div>
              <Slider
                value={temperature}
                onValueChange={(v) => { setTemperature(v); setIsDirty(true); }}
                min={0}
                max={1}
                step={0.05}
                className="w-full"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>Focused</span>
                <span>Creative</span>
              </div>
              <div className="rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
                {getTempLabel(temperature[0])}
              </div>
            </div>

            {/* Max Tokens */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm">
                  Max Tokens
                  <ParamTooltip text="Maximum number of tokens in the AI response. 1 token ≈ 0.75 words." />
                </Label>
                <span className="font-mono text-sm font-semibold text-primary tabular-nums">
                  {maxTokens}
                </span>
              </div>
              <Slider
                value={[maxTokens]}
                onValueChange={(v) => { setMaxTokens(v[0]); setIsDirty(true); }}
                min={64}
                max={2048}
                step={64}
                className="w-full"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>64</span>
                <span>2048</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {[128, 256, 512, 1024].map((v) => (
                  <button
                    key={v}
                    onClick={() => { setMaxTokens(v); setIsDirty(true); }}
                    className={cn(
                      "rounded-md px-2 py-0.5 text-[11px] border transition-all",
                      maxTokens === v
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Top P */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm">
                  Top P
                  <ParamTooltip text="Nucleus sampling. Controls diversity by limiting tokens to top cumulative probability mass." />
                </Label>
                <span className="font-mono text-sm font-semibold text-primary tabular-nums">
                  {topP[0].toFixed(2)}
                </span>
              </div>
              <Slider
                value={topP}
                onValueChange={(v) => { setTopP(v); setIsDirty(true); }}
                min={0.1}
                max={1}
                step={0.05}
                className="w-full"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>Narrow</span>
                <span>Broad</span>
              </div>
              <div className="rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
                {getTopPLabel(topP[0])}
              </div>
            </div>
          </div>

          {/* Summary strip */}
          <div className="mt-5 flex items-center gap-4 rounded-xl bg-muted/40 px-4 py-3 border border-border/40">
            <Brain className="h-4 w-4 text-primary flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              Current config:{" "}
              <span className="font-medium text-foreground">
                temp={temperature[0].toFixed(2)}, max_tokens={maxTokens}, top_p={topP[0].toFixed(2)}
              </span>
            </p>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════
            SECTION 3 — Knowledge Base (RAG)
        ═══════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className={cardClass}
        >
          <SectionHeader
            icon={Database}
            title="Knowledge Base"
            description="Manage documents used for Retrieval Augmented Generation (RAG)."
          />

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label: "Documents Indexed", value: indexedCount },
              { label: "Total Embeddings", value: totalEmbeddings.toLocaleString() },
              { label: "Last Updated", value: "Mar 9, 2026" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl bg-muted/50 border border-border/40 px-4 py-3 text-center"
              >
                <p className="text-lg font-display font-bold text-foreground">{s.value}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Document list */}
          <div className="rounded-xl border border-border/60 overflow-hidden mb-4">
            <div className="grid grid-cols-[1fr_100px_110px_90px_40px] gap-2 bg-muted/50 px-4 py-2 text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
              <span>Document</span>
              <span>Type</span>
              <span>Uploaded</span>
              <span>Status</span>
              <span />
            </div>
            <AnimatePresence>
              {documents.map((doc, i) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8, height: 0, marginBottom: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={cn(
                    "grid grid-cols-[1fr_100px_110px_90px_40px] gap-2 items-center px-4 py-3 text-sm",
                    i < documents.length - 1 && "border-b border-border/40"
                  )}
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <FileText className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                    <span className="truncate font-medium text-foreground text-xs">{doc.name}</span>
                    <span className="text-[10px] text-muted-foreground flex-shrink-0">{doc.size}</span>
                  </span>
                  <span>
                    <Badge variant="secondary" className="text-[10px] px-2 py-0.5">
                      {doc.type}
                    </Badge>
                  </span>
                  <span className="text-xs text-muted-foreground">{doc.uploadDate}</span>
                  <span>
                    <StatusBadge status={doc.status} />
                  </span>
                  <span>
                    <button
                      onClick={() => handleDeleteDoc(doc.id)}
                      className="h-7 w-7 rounded-md flex items-center justify-center hover:bg-destructive/10 hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.csv,.txt,.json"
              className="hidden"
              onChange={handleFileUpload}
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="gap-1.5"
            >
              <Upload className="h-3.5 w-3.5" />
              Upload Document
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleReindex}
              className="gap-1.5"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Re-index Knowledge Base
            </Button>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════
            SECTION 4 — Product Knowledge Sources
        ═══════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={cardClass}
        >
          <SectionHeader
            icon={BookOpen}
            title="Product Knowledge Sources"
            description="Toggle which knowledge sources are active for AI-assisted responses."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                icon: FileText,
                label: "Product Catalog",
                description: "Full catalog of Aura Skincare products, prices & details",
                value: productCatalog,
                set: setProductCatalog,
              },
              {
                icon: HelpCircle,
                label: "FAQ Database",
                description: "Commonly asked questions and curated answers",
                value: faqDatabase,
                set: setFaqDatabase,
              },
              {
                icon: Headset,
                label: "Customer Support Articles",
                description: "Help center articles for orders, returns & policies",
                value: supportArticles,
                set: setSupportArticles,
              },
              {
                icon: Leaf,
                label: "Ingredient Knowledge Base",
                description: "Scientific ingredient info and skin compatibility data",
                value: ingredientKnowledge,
                set: setIngredientKnowledge,
              },
            ].map(({ icon: Icon, label, description, value, set }) => (
              <div
                key={label}
                className={cn(
                  "flex items-start justify-between gap-3 rounded-xl border px-4 py-3.5 transition-all",
                  value
                    ? "border-primary/30 bg-primary/5"
                    : "border-border/50 bg-muted/20"
                )}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5",
                      value ? "bg-primary/15" : "bg-muted"
                    )}
                  >
                    <Icon
                      className={cn("h-4 w-4", value ? "text-primary" : "text-muted-foreground")}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
                  </div>
                </div>
                <Switch
                  checked={value}
                  onCheckedChange={(v) => { set(v); setIsDirty(true); }}
                  className="flex-shrink-0 mt-0.5"
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════
            SECTION 5 — Testing Console
        ═══════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className={cardClass}
        >
          <SectionHeader
            icon={FlaskConical}
            title="Testing Console"
            description="Send a test message to verify how the agent responds with the current configuration."
          />

          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                placeholder="e.g. I have dry skin. What moisturizer do you recommend?"
                onKeyDown={(e) => e.key === "Enter" && handleTestResponse()}
                className="text-sm"
              />
              <Button
                onClick={handleTestResponse}
                disabled={isTesting || !testInput.trim()}
                className="gap-1.5 flex-shrink-0"
              >
                {isTesting ? (
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <SendHorizonal className="h-3.5 w-3.5" />
                )}
                {isTesting ? "Testing…" : "Test Response"}
              </Button>
            </div>

            <AnimatePresence>
              {(testResponse || isTesting) && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="rounded-xl border border-border/50 bg-muted/40 p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                      <Bot className="h-3 w-3 text-primary-foreground" />
                    </div>
                    <span className="text-xs font-medium text-foreground">Aura AI</span>
                    <span className="text-[10px] text-muted-foreground">— live preview</span>
                  </div>
                  {isTesting ? (
                    <div className="flex gap-1 py-1">
                      {[0, 0.15, 0.3].map((d) => (
                        <span
                          key={d}
                          className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce"
                          style={{ animationDelay: `${d}s` }}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                      {testResponse}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center gap-1.5 rounded-lg bg-muted/30 px-3 py-2 text-xs text-muted-foreground border border-border/30">
              <ShieldCheck className="h-3.5 w-3.5 flex-shrink-0" />
              Test responses use saved configuration. Unsaved changes are not reflected.
            </div>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════
            SECTION 6 — Save Configuration
        ═══════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={cn(
            cardClass,
            "border-2 transition-colors",
            isDirty ? "border-amber-300" : "border-border/60"
          )}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-foreground">Save Configuration</p>
                <AnimatePresence>
                  {saveSuccess && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-200"
                    >
                      <CheckCircle2 className="h-3 w-3" /> Saved successfully
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Last updated: <strong className="text-foreground">Mar 9, 2026 at 11:24 AM</strong>
                </span>
                <span>Updated by: <strong className="text-foreground">admin@auraskincare.com</strong></span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Version history */}
              <Select value={selectedVersion} onValueChange={setSelectedVersion}>
                <SelectTrigger className="text-xs h-9 w-[200px] gap-1">
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                  <SelectValue placeholder="Version history" />
                </SelectTrigger>
                <SelectContent>
                  {versionHistory.map((v) => (
                    <SelectItem key={v} value={v} className="text-xs">
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                onClick={handleSave}
                className="gap-1.5"
                size="default"
                disabled={!isDirty}
              >
                <Save className="h-4 w-4" />
                Save Configuration
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
