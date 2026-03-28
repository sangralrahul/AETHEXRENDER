import { useState, useEffect } from "react";
import {
  X, Settings, Palette, Brain, Shield, Info, ChevronRight,
  Moon, Sun, Type, Clock, MessageSquare, Zap, Database,
  Download, Trash2, Activity, CheckCircle, Lock,
  Globe, BellRing, Volume2, RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Types ──────────────────────────────────────────────────────────────── */
export interface SynapseSettings {
  theme: "dark" | "auto";
  fontSize: "sm" | "md" | "lg";
  compactMode: boolean;
  showTimestamps: boolean;
  responseStyle: "concise" | "balanced" | "detailed";
  showThinking: boolean;
  autoTitleChats: boolean;
  streamResponses: boolean;
  researchSources: 5 | 10 | 15;
  defaultModel: "pulse45" | "flux36" | "nova46";
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  language: string;
}

export const DEFAULT_SETTINGS: SynapseSettings = {
  theme: "dark",
  fontSize: "md",
  compactMode: false,
  showTimestamps: true,
  responseStyle: "balanced",
  showThinking: true,
  autoTitleChats: true,
  streamResponses: true,
  researchSources: 10,
  defaultModel: "pulse45",
  soundEnabled: false,
  notificationsEnabled: false,
  language: "en",
};

const LS_KEY = "synapse-settings-v1";
export function loadSettings(): SynapseSettings {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch { return DEFAULT_SETTINGS; }
}
export function saveSettings(s: SynapseSettings) {
  localStorage.setItem(LS_KEY, JSON.stringify(s));
}

/* ── Props ──────────────────────────────────────────────────────────────── */
interface SettingsModalProps {
  settings: SynapseSettings;
  onSettingsChange: (s: SynapseSettings) => void;
  onClearAllChats: () => void;
  onClearCurrentChat: () => void;
  onExportChats: () => void;
  onClose: () => void;
}

type SectionId = "general" | "appearance" | "ai" | "data" | "about";

const NAV: { id: SectionId; label: string; icon: React.ElementType; badge?: string }[] = [
  { id: "general",    label: "General",      icon: Settings },
  { id: "appearance", label: "Appearance",   icon: Palette },
  { id: "ai",         label: "AI Behavior",  icon: Brain },
  { id: "data",       label: "Data Controls",icon: Shield },
  { id: "about",      label: "About",        icon: Info },
];

/* ── Sub-components ─────────────────────────────────────────────────────── */

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="relative inline-flex shrink-0 cursor-pointer transition-colors duration-200"
      style={{
        width: 44, height: 24, borderRadius: 12,
        background: checked ? "rgba(0,188,212,0.8)" : "rgba(255,255,255,0.1)",
        border: checked ? "1px solid rgba(0,229,255,0.5)" : "1px solid rgba(255,255,255,0.12)",
      }}
    >
      <span
        className="absolute top-0.5 transition-transform duration-200"
        style={{
          width: 20, height: 20, borderRadius: "50%",
          background: checked ? "white" : "rgba(150,180,220,0.6)",
          transform: checked ? "translateX(22px)" : "translateX(2px)",
          boxShadow: checked ? "0 0 8px rgba(0,229,255,0.4)" : "none",
        }}
      />
    </button>
  );
}

function Row({
  label, desc, children,
}: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <div className="min-w-0">
        <p className="text-sm font-medium" style={{ color: "rgba(200,230,255,0.9)" }}>{label}</p>
        {desc && <p className="text-xs mt-0.5" style={{ color: "rgba(120,170,220,0.5)" }}>{desc}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Select<T extends string>({
  value, options, onChange,
}: { value: T; options: { value: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      className="text-sm px-3 py-1.5 rounded-lg outline-none cursor-pointer"
      style={{
        background: "rgba(0,188,212,0.08)",
        border: "1px solid rgba(0,188,212,0.2)",
        color: "rgba(180,225,255,0.9)",
        minWidth: 120,
      }}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value} style={{ background: "#071030" }}>{o.label}</option>
      ))}
    </select>
  );
}

function RadioGroup<T extends string>({
  value, options, onChange,
}: { value: T; options: { value: T; label: string; desc?: string }[]; onChange: (v: T) => void }) {
  return (
    <div className="flex flex-col gap-2 w-full">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className="flex items-start gap-3 px-3 py-2.5 rounded-xl text-left transition-all"
          style={
            value === o.value
              ? { background: "rgba(0,188,212,0.12)", border: "1px solid rgba(0,229,255,0.3)" }
              : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }
          }
        >
          <div
            className="mt-0.5 w-4 h-4 rounded-full shrink-0 flex items-center justify-center"
            style={{
              border: value === o.value ? "2px solid #00E5FF" : "2px solid rgba(100,150,200,0.4)",
              background: value === o.value ? "rgba(0,229,255,0.15)" : "transparent",
            }}
          >
            {value === o.value && (
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#00E5FF" }} />
            )}
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: value === o.value ? "rgba(200,240,255,0.95)" : "rgba(140,185,230,0.7)" }}>
              {o.label}
            </p>
            {o.desc && <p className="text-xs mt-0.5" style={{ color: "rgba(100,150,200,0.5)" }}>{o.desc}</p>}
          </div>
        </button>
      ))}
    </div>
  );
}

function DangerButton({ label, desc, icon: Icon, onClick }: {
  label: string; desc?: string; icon: React.ElementType; onClick: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(248,113,113,0.2)" }}>
      <button
        type="button"
        onClick={() => { if (confirming) { onClick(); setConfirming(false); } else setConfirming(true); }}
        onBlur={() => setTimeout(() => setConfirming(false), 300)}
        className="w-full flex items-center gap-3 px-4 py-3 transition-colors text-left"
        style={{ background: confirming ? "rgba(239,68,68,0.15)" : "rgba(239,68,68,0.07)" }}
      >
        <Icon className="w-4 h-4 shrink-0 text-red-400" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-red-400">{label}</p>
          {desc && <p className="text-xs mt-0.5" style={{ color: "rgba(248,113,113,0.5)" }}>{desc}</p>}
        </div>
        {confirming
          ? <span className="text-xs font-bold text-red-400 shrink-0">Tap again to confirm</span>
          : <ChevronRight className="w-3.5 h-3.5 text-red-400/50 shrink-0" />}
      </button>
    </div>
  );
}

function ActionButton({ label, desc, icon: Icon, onClick }: {
  label: string; desc?: string; icon: React.ElementType; onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left"
      style={{ background: "rgba(0,188,212,0.07)", border: "1px solid rgba(0,188,212,0.15)" }}
    >
      <Icon className="w-4 h-4 shrink-0" style={{ color: "#00BCD4" }} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium" style={{ color: "rgba(180,225,255,0.9)" }}>{label}</p>
        {desc && <p className="text-xs mt-0.5" style={{ color: "rgba(100,160,210,0.5)" }}>{desc}</p>}
      </div>
      <ChevronRight className="w-3.5 h-3.5 shrink-0" style={{ color: "rgba(0,200,255,0.3)" }} />
    </button>
  );
}

/* ── Sections ───────────────────────────────────────────────────────────── */

function SectionGeneral({ s, set }: { s: SynapseSettings; set: (k: keyof SynapseSettings, v: any) => void }) {
  return (
    <div className="space-y-1">
      <Row label="Language" desc="Interface language">
        <Select value={s.language} onChange={(v) => set("language", v)}
          options={[
            { value: "en", label: "English" },
            { value: "hi", label: "हिंदी (Hindi)" },
            { value: "bn", label: "বাংলা (Bengali)" },
            { value: "ta", label: "தமிழ் (Tamil)" },
          ]} />
      </Row>
      <Row label="Auto-title chats" desc="Generate title from first message">
        <Toggle checked={s.autoTitleChats} onChange={(v) => set("autoTitleChats", v)} />
      </Row>
      <Row label="Show thinking animation" desc="Animated loader while AI is thinking">
        <Toggle checked={s.showThinking} onChange={(v) => set("showThinking", v)} />
      </Row>
      <Row label="Streaming responses" desc="Show response as it generates">
        <Toggle checked={s.streamResponses} onChange={(v) => set("streamResponses", v)} />
      </Row>
      <Row label="Show timestamps" desc="Display time on each message">
        <Toggle checked={s.showTimestamps} onChange={(v) => set("showTimestamps", v)} />
      </Row>
      <Row label="Sound effects" desc="Play subtle sounds for actions">
        <Toggle checked={s.soundEnabled} onChange={(v) => set("soundEnabled", v)} />
      </Row>
    </div>
  );
}

function SectionAppearance({ s, set }: { s: SynapseSettings; set: (k: keyof SynapseSettings, v: any) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(0,200,255,0.4)" }}>Theme</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: "dark",  label: "Dark",  icon: Moon,  desc: "SYNAPSE dark" },
            { value: "auto",  label: "System",icon: Sun,   desc: "Match device" },
          ].map((t) => (
            <button key={t.value} type="button" onClick={() => set("theme", t.value)}
              className="flex flex-col items-center gap-2 px-4 py-3 rounded-xl transition-all"
              style={s.theme === t.value
                ? { background: "rgba(0,188,212,0.15)", border: "1px solid rgba(0,229,255,0.4)" }
                : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <t.icon className="w-5 h-5" style={{ color: s.theme === t.value ? "#00E5FF" : "rgba(120,170,220,0.5)" }} />
              <div>
                <p className="text-sm font-medium" style={{ color: s.theme === t.value ? "rgba(200,240,255,0.95)" : "rgba(120,170,220,0.6)" }}>{t.label}</p>
                <p className="text-[10px]" style={{ color: "rgba(100,150,200,0.45)" }}>{t.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(0,200,255,0.4)" }}>Font Size</p>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: "sm", label: "Small",  sample: "Aa" },
            { value: "md", label: "Medium", sample: "Aa" },
            { value: "lg", label: "Large",  sample: "Aa" },
          ].map((f) => (
            <button key={f.value} type="button" onClick={() => set("fontSize", f.value)}
              className="flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all"
              style={s.fontSize === f.value
                ? { background: "rgba(0,188,212,0.15)", border: "1px solid rgba(0,229,255,0.35)" }
                : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <span style={{
                fontSize: f.value === "sm" ? 14 : f.value === "md" ? 18 : 24,
                color: s.fontSize === f.value ? "#00E5FF" : "rgba(120,170,220,0.55)",
                fontWeight: 600,
              }}>{f.sample}</span>
              <span className="text-[10px]" style={{ color: s.fontSize === f.value ? "rgba(180,225,255,0.8)" : "rgba(100,150,200,0.5)" }}>
                {f.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 12 }}>
        <Row label="Compact mode" desc="Reduce spacing between messages">
          <Toggle checked={s.compactMode} onChange={(v) => set("compactMode", v)} />
        </Row>
      </div>
    </div>
  );
}

function SectionAI({ s, set }: { s: SynapseSettings; set: (k: keyof SynapseSettings, v: any) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(0,200,255,0.4)" }}>Default Model</p>
        <RadioGroup value={s.defaultModel} onChange={(v) => set("defaultModel", v)}
          options={[
            { value: "pulse45", label: "Pulse 4.5", desc: "Vitals · Emergency · Critical Care" },
            { value: "flux36",  label: "Flux 3.6",  desc: "Pharmacology · Drug Interactions · Labs" },
            { value: "nova46",  label: "Nova 4.6 PRO", desc: "Advanced Diagnostics · Research · Multimodal" },
          ]} />
      </div>

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 8 }}>
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(0,200,255,0.4)" }}>Response Style</p>
        <RadioGroup value={s.responseStyle} onChange={(v) => set("responseStyle", v)}
          options={[
            { value: "concise",  label: "Concise",  desc: "Short, direct answers" },
            { value: "balanced", label: "Balanced", desc: "Thorough but not overwhelming" },
            { value: "detailed", label: "Detailed", desc: "Comprehensive with full context" },
          ]} />
      </div>

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 8 }}>
        <Row label="Deep Research sources" desc="Number of web sources to pull">
          <Select value={String(s.researchSources) as any}
            onChange={(v) => set("researchSources", Number(v))}
            options={[
              { value: "5",  label: "5 sources" },
              { value: "10", label: "10 sources" },
              { value: "15", label: "15 sources" },
            ]} />
        </Row>
      </div>
    </div>
  );
}

function SectionData({
  onClearAll, onClearCurrent, onExport, onClose,
}: { onClearAll: () => void; onClearCurrent: () => void; onExport: () => void; onClose: () => void }) {
  return (
    <div className="space-y-3">
      <ActionButton label="Export chat history" desc="Download all chats as JSON"
        icon={Download} onClick={onExport} />

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 12 }}>
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(248,113,113,0.5)" }}>
          Danger Zone
        </p>
        <div className="space-y-2">
          <DangerButton label="Clear current chat" desc="Remove messages from active session"
            icon={RotateCcw} onClick={onClearCurrent} />
          <DangerButton label="Clear all chats" desc="Permanently delete all conversation history"
            icon={Trash2} onClick={onClearAll} />
          <DangerButton label="Delete account" desc="This action cannot be undone"
            icon={Lock} onClick={() => {}} />
        </div>
      </div>
    </div>
  );
}

function SectionAbout() {
  const models = [
    { name: "Pulse 4.5",    color: "#10B981", desc: "Emergency & Critical Care" },
    { name: "Flux 3.6",     color: "#F59E0B", desc: "Pharmacology & Lab Analysis" },
    { name: "Nova 4.6 PRO", color: "#A855F7", desc: "Advanced Diagnostics & Research" },
  ];
  return (
    <div className="space-y-5">
      {/* Version card */}
      <div className="rounded-2xl p-4" style={{ background: "rgba(0,188,212,0.06)", border: "1px solid rgba(0,188,212,0.15)" }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(0,188,212,0.12)", border: "1px solid rgba(0,229,255,0.2)" }}>
            <Zap className="w-5 h-5" style={{ color: "#00E5FF" }} />
          </div>
          <div>
            <p className="font-bold text-sm" style={{ color: "rgba(200,240,255,0.95)", fontFamily: "'Orbitron', monospace", letterSpacing: "0.06em" }}>SYNAPSE</p>
            <p className="text-xs" style={{ color: "rgba(100,170,220,0.55)" }}>Medical AI Suite · v3.0.0</p>
          </div>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: "rgba(120,175,220,0.6)" }}>
          A product of nexrya technologies pvt ltd. Designed for Indian doctors and medical students. All medical information should be verified with qualified professionals.
        </p>
      </div>

      {/* Models */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(0,200,255,0.4)" }}>Available Models</p>
        <div className="space-y-2">
          {models.map((m) => (
            <div key={m.name} className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: m.color, boxShadow: `0 0 8px ${m.color}80` }} />
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: "rgba(180,225,255,0.85)" }}>{m.name}</p>
                <p className="text-xs" style={{ color: "rgba(100,155,210,0.5)" }}>{m.desc}</p>
              </div>
              <CheckCircle className="w-3.5 h-3.5" style={{ color: m.color + "99" }} />
            </div>
          ))}
        </div>
      </div>

      {/* System status */}
      <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
        style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}>
        <Activity className="w-4 h-4 text-emerald-400" />
        <p className="text-sm" style={{ color: "rgba(110,231,183,0.85)" }}>All systems operational</p>
        <div className="ml-auto w-2 h-2 rounded-full bg-emerald-400" style={{ animation: "synapse-breathe 2s ease-in-out infinite" }} />
      </div>

      {/* Links */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: "Privacy Policy", href: "#" },
          { label: "Terms of Service", href: "#" },
          { label: "aethex Store", href: "/" },
          { label: "nexrya technologies", href: "#" },
        ].map((l) => (
          <a key={l.label} href={l.href}
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors"
            style={{ color: "rgba(0,200,255,0.6)", border: "1px solid rgba(0,188,212,0.12)" }}>
            {l.label}
            <ChevronRight className="w-3 h-3 opacity-50" />
          </a>
        ))}
      </div>
    </div>
  );
}

/* ── Main Modal ─────────────────────────────────────────────────────────── */

export default function SettingsModal({
  settings, onSettingsChange, onClearAllChats, onClearCurrentChat, onExportChats, onClose,
}: SettingsModalProps) {
  const [activeSection, setActiveSection] = useState<SectionId>("general");

  const set = (key: keyof SynapseSettings, value: any) => {
    const next = { ...settings, [key]: value };
    onSettingsChange(next);
    saveSettings(next);
  };

  return (
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(12px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="flex overflow-hidden w-full"
        style={{
          maxWidth: 780,
          height: "min(85vh, 600px)",
          background: "rgba(3,9,24,0.97)",
          border: "1px solid rgba(0,188,212,0.2)",
          borderRadius: 20,
          boxShadow: "0 0 80px rgba(0,188,212,0.1), 0 40px 80px rgba(0,0,0,0.6)",
        }}
      >
        {/* ── Left nav ── */}
        <div
          className="flex flex-col shrink-0 py-5"
          style={{
            width: 200,
            background: "rgba(0,0,0,0.3)",
            borderRight: "1px solid rgba(0,188,212,0.1)",
          }}
        >
          {/* Modal title */}
          <div className="px-5 pb-4 mb-1" style={{ borderBottom: "1px solid rgba(0,188,212,0.08)" }}>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "rgba(0,200,255,0.45)" }}>
              Settings
            </p>
          </div>

          <nav className="flex-1 px-2 pt-2 space-y-0.5 overflow-y-auto">
            {NAV.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveSection(id)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left"
                style={
                  activeSection === id
                    ? {
                        background: "rgba(0,188,212,0.12)",
                        border: "1px solid rgba(0,229,255,0.2)",
                        color: "#00E5FF",
                      }
                    : {
                        border: "1px solid transparent",
                        color: "rgba(120,175,220,0.6)",
                      }
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </button>
            ))}
          </nav>

          {/* Version tag */}
          <div className="px-4 pt-3 mt-2" style={{ borderTop: "1px solid rgba(0,188,212,0.08)" }}>
            <p className="text-[10px]" style={{ color: "rgba(0,200,255,0.25)" }}>SYNAPSE · v3.0.0</p>
          </div>
        </div>

        {/* ── Right content ── */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* Content header */}
          <div
            className="flex items-center justify-between px-6 py-4 shrink-0"
            style={{ borderBottom: "1px solid rgba(0,188,212,0.1)" }}
          >
            <div className="flex items-center gap-2.5">
              {(() => { const n = NAV.find((x) => x.id === activeSection)!; return <n.icon className="w-4 h-4" style={{ color: "#00E5FF" }} />; })()}
              <h2 className="font-semibold text-base" style={{ color: "rgba(200,235,255,0.95)" }}>
                {NAV.find((x) => x.id === activeSection)?.label}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg transition-colors"
              style={{ color: "rgba(100,170,220,0.5)" }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable section body */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {activeSection === "general"    && <SectionGeneral    s={settings} set={set} />}
            {activeSection === "appearance" && <SectionAppearance s={settings} set={set} />}
            {activeSection === "ai"         && <SectionAI         s={settings} set={set} />}
            {activeSection === "data"       && (
              <SectionData
                onClearAll={() => { onClearAllChats(); onClose(); }}
                onClearCurrent={() => { onClearCurrentChat(); onClose(); }}
                onExport={onExportChats}
                onClose={onClose}
              />
            )}
            {activeSection === "about"      && <SectionAbout />}
          </div>
        </div>
      </div>
    </div>
  );
}
