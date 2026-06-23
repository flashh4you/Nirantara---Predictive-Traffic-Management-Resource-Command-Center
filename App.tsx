import React, { useState, useEffect, useMemo } from "react";
import {
  AlertTriangle, CheckCircle2, Clock, MapPin,
  TrendingUp, Users, Shield, Activity, Radio,
  ArrowUpRight, BarChart2, Navigation, Zap,
  AlertCircle, Construction, Trees, Car, Plus,
  ChevronRight, X, Search, Layers
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, BarChart, Bar, CartesianGrid, Cell, PieChart, Pie,
} from "recharts";

// ─── Animation styles ────────────────────────────────────────────────────────

const CSS = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0);    }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.75); }
    to   { opacity: 1; transform: scale(1);    }
  }
  @keyframes draw {
    from { stroke-dashoffset: 300; opacity: 0.2; }
    to   { stroke-dashoffset: 0;   opacity: 1;   }
  }
  @keyframes spinSlow {
    from { transform: rotate(0deg);   }
    to   { transform: rotate(360deg); }
  }
  @keyframes splashOut {
    0%   { opacity: 1; transform: scale(1);    }
    100% { opacity: 0; transform: scale(1.03); }
  }
  @keyframes slideRight {
    from { opacity: 0; transform: translateX(-12px); }
    to   { opacity: 1; transform: translateX(0);     }
  }
  .anim-scaleIn    { animation: scaleIn  0.6s cubic-bezier(0.16,1,0.3,1) forwards; }
  .anim-fadeUp-1   { animation: fadeUp   0.5s 0.4s ease-out both; }
  .anim-fadeUp-2   { animation: fadeUp   0.5s 0.65s ease-out both; }
  .anim-fadeUp-3   { animation: fadeUp   0.5s 0.9s ease-out both; }
  .anim-fadeIn     { animation: fadeIn   0.4s ease-out both; }
  .anim-slideRight { animation: slideRight 0.35s ease-out both; }
  .draw-ring       { stroke-dasharray: 300; animation: draw 1.2s 0.2s ease-out both; }
  .spin-slow       { animation: spinSlow 18s linear infinite; transform-origin: center; }
  .splash-out      { animation: splashOut 0.45s ease-in forwards; }
`;

// ─── Translations ────────────────────────────────────────────────────────────

type Lang = "en" | "kn";

const T = {
  en: {
    appSub: "Traffic Command Centre",
    chooseLanguage: "Choose your language",
    langSub: "You can change this later in settings",
    english: "English",
    kannada: "ಕನ್ನಡ",
    continue: "Continue",
    dashboard: "Dashboard",
    incidents: "Incidents",
    forecast: "Forecast",
    resources: "Resources",
    live: "LIVE",
    activeIncidents: "Active Incidents",
    resolvedToday: "Resolved Today",
    highPriority: "High Priority",
    avgResponse: "Avg Response",
    fromYesterday: "vs. yesterday",
    todayAvg: "today's avg",
    live2Critical: "2 critical now",
    target15: "target 15 min",
    recentIncidents: "Recent incidents",
    seeAll: "See all",
    incidentLog: "Incident Log",
    search: "Search area, corridor…",
    all: "All",
    active: "Active",
    resolved: "Resolved",
    closed: "Closed",
    critical: "Critical",
    high: "High",
    congestionIndex: "Congestion Index — City Wide",
    zeroFreeFlow: "0 = free flow · 100 = standstill",
    upcomingEvents: "Upcoming planned events",
    aiRec: "AI Recommendation",
    officers: "Officers",
    barricades: "Barricades",
    zonalDeployment: "Zonal deployment",
    postEvent: "Post-event learning",
    forecastAccuracy: "Forecast Accuracy",
    eventsAnalysed: "Events Analysed",
    timeSaved: "Avg Time Saved",
    newIncident: "New Incident",
    dispatch: "Dispatch",
    diversion: "Set Diversion",
    corridorActivity: "Corridor activity",
    last30: "Last 30 days",
    noResults: "No incidents match this filter.",
  },
  kn: {
    appSub: "ಸಂಚಾರ ನಿಯಂತ್ರಣ ಕೇಂದ್ರ",
    chooseLanguage: "ನಿಮ್ಮ ಭಾಷೆ ಆರಿಸಿ",
    langSub: "ಈ ಆಯ್ಕೆಯನ್ನು ನಂತರ ಬದಲಾಯಿಸಬಹುದು",
    english: "English",
    kannada: "ಕನ್ನಡ",
    continue: "ಮುಂದುವರಿಯಿರಿ",
    dashboard: "ಮುಖ್ಯ ಪರದೆ",
    incidents: "ಘಟನೆಗಳು",
    forecast: "ಮುನ್ನಂದಾಜು",
    resources: "ಸಂಪನ್ಮೂಲ",
    live: "ನೇರ",
    activeIncidents: "ಸಕ್ರಿಯ ಘಟನೆಗಳು",
    resolvedToday: "ಇಂದು ಪರಿಹರಿಸಿದ",
    highPriority: "ಹೆಚ್ಚಿನ ಆದ್ಯತೆ",
    avgResponse: "ಸರಾಸರಿ ಪ್ರತಿಕ್ರಿಯೆ",
    fromYesterday: "ನಿನ್ನೆ ಹೋಲಿಕೆ",
    todayAvg: "ಇಂದಿನ ಸರಾಸರಿ",
    live2Critical: "೨ ನಿರ್ಣಾಯಕ",
    target15: "ಗುರಿ ೧೫ ನಿ",
    recentIncidents: "ಇತ್ತೀಚಿನ ಘಟನೆಗಳು",
    seeAll: "ಎಲ್ಲ ನೋಡಿ",
    incidentLog: "ಘಟನೆ ದಾಖಲೆ",
    search: "ಪ್ರದೇಶ, ಕಾರಿಡಾರ್ ಹುಡುಕಿ…",
    all: "ಎಲ್ಲ",
    active: "ಸಕ್ರಿಯ",
    resolved: "ಪರಿಹರಿಸಿದ",
    closed: "ಮುಚ್ಚಿದ",
    critical: "ನಿರ್ಣಾಯಕ",
    high: "ಹೆಚ್ಚು",
    congestionIndex: "ಟ್ರಾಫಿಕ್ ಸೂಚ್ಯಂಕ — ಸಂಪೂರ್ಣ ನಗರ",
    zeroFreeFlow: "೦ = ಮುಕ್ತ ಹರಿವು · ೧೦೦ = ನಿಂತ ಸ್ಥಿತಿ",
    upcomingEvents: "ಮುಂಬರುವ ಯೋಜಿತ ಕಾರ್ಯಕ್ರಮಗಳು",
    aiRec: "AI ಶಿಫಾರಸು",
    officers: "ಅಧಿಕಾರಿಗಳು",
    barricades: "ಅಡೆತಡೆಗಳು",
    zonalDeployment: "ವಲಯ ನಿಯೋಜನೆ",
    postEvent: "ಘಟನೋತ್ತರ ಕಲಿಕೆ",
    forecastAccuracy: "ಮುನ್ನಂದಾಜು ನಿಖರತೆ",
    eventsAnalysed: "ಘಟನೆಗಳ ವಿಶ್ಲೇಷಣೆ",
    timeSaved: "ಉಳಿತಾಯ ಸಮಯ",
    newIncident: "ಹೊಸ ಘಟನೆ",
    dispatch: "ನಿಯೋಜಿಸಿ",
    diversion: "ತಿರುವು ಹೊಂದಿಸಿ",
    corridorActivity: "ಕಾರಿಡಾರ್ ಚಟುವಟಿಕೆ",
    last30: "ಕಳೆದ ೩೦ ದಿನಗಳು",
    noResults: "ಈ ಫಿಲ್ಟರ್‌ಗೆ ಯಾವ ಘಟನೆಗಳೂ ಇಲ್ಲ.",
  },
};

// ─── Data ────────────────────────────────────────────────────────────────────

const RED = "#E23744";
const ORANGE = "#FF6B35";
const AMBER = "#F59E0B";
const GREEN = "#16A34A";

type Incident = {
  id: string; type: string; area: string; corridor: string;
  status: "active" | "resolved" | "closed"; priority: "Critical" | "High" | "Medium" | "Low";
  lat: number; lon: number; start: string; duration: string;
  description: string; vehicle?: string; zone: string; requires_closure: boolean;
};

const incidents: Incident[] = [
  { id: "FKID000000", type: "vehicle_breakdown", area: "Jalahalli Cross Junction", corridor: "Tumkur Road", status: "closed", priority: "High", lat: 13.040, lon: 77.518, start: "07 Mar 2024, 17:01", duration: "2h 34m", description: "LCV blocking man track near S M Circle inbound", vehicle: "LCV", zone: "West Zone", requires_closure: false },
  { id: "FKID000001", type: "vehicle_breakdown", area: "HSR Layout, Agara", corridor: "ORR East 1", status: "resolved", priority: "High", lat: 12.922, lon: 77.645, start: "30 Jan 2024, 04:07", duration: "0h 10m", description: "Heavy vehicle starting failure on 19th Main Road", vehicle: "Heavy Vehicle", zone: "South Zone 2", requires_closure: false },
  { id: "FKID000002", type: "road_repair", area: "Urvashi Junction, Wilson Garden", corridor: "Non-corridor", status: "closed", priority: "Low", lat: 12.956, lon: 77.586, start: "11 Nov 2023, 06:18", duration: "~2 months", description: "New cement laid at storm drain — slow movement expected", zone: "Central Zone 2", requires_closure: false },
  { id: "FKID000003", type: "tree_fall", area: "Sadashiva Nagar, Bashyam Circle", corridor: "Sankey Road", status: "closed", priority: "High", lat: 13.006, lon: 77.579, start: "07 Mar 2024, 17:56", duration: "~7 days", description: "Tree fall spanning both carriageways near Palace Orchard", zone: "Central Zone", requires_closure: true },
  { id: "FKID000004", type: "political_rally", area: "MG Road, Brigade Road Junction", corridor: "MG Road", status: "active", priority: "Critical", lat: 12.9716, lon: 77.5946, start: "23 Jun 2024, 10:00", duration: "ongoing", description: "Large political rally — 4 roads closed, diversions via Richmond Road and Residency Road", zone: "Central Zone", requires_closure: true },
  { id: "FKID000005", type: "festival", area: "ITPL Main Road, Whitefield", corridor: "Whitefield Main", status: "active", priority: "Medium", lat: 12.970, lon: 77.750, start: "23 Jun 2024, 08:00", duration: "ongoing", description: "Tech park cultural festival causing outbound congestion on Hope Farm junction", zone: "East Zone", requires_closure: false },
  { id: "FKID000006", type: "accident", area: "Hebbal Flyover", corridor: "NH44", status: "active", priority: "High", lat: 13.036, lon: 77.597, start: "23 Jun 2024, 14:22", duration: "ongoing", description: "Multi-vehicle collision — 2 lanes blocked, recovery vehicle dispatched", zone: "North Zone", requires_closure: false },
  { id: "FKID000007", type: "vehicle_breakdown", area: "Koramangala 5th Block", corridor: "ORR West", status: "resolved", priority: "Medium", lat: 12.928, lon: 77.627, start: "22 Jun 2024, 20:15", duration: "1h 05m", description: "BMTC bus breakdown near Sony World signal on inner ring road", vehicle: "Bus", zone: "South Zone 1", requires_closure: false },
  { id: "FKID000008", type: "construction", area: "Jayanagar 9th Block", corridor: "Bannerghatta Road", status: "active", priority: "Medium", lat: 12.915, lon: 77.601, start: "20 Jun 2024, 09:00", duration: "ongoing", description: "Namma Metro Phase 3 construction — single lane operational only", zone: "South Zone 1", requires_closure: false },
  { id: "FKID000009", type: "sports_event", area: "Kanteerava Indoor Stadium", corridor: "Kasturba Road", status: "active", priority: "High", lat: 13.001, lon: 77.599, start: "23 Jun 2024, 16:00", duration: "ongoing", description: "ISL match — crowd overflow on Kasturba Road, parking full", zone: "Central Zone", requires_closure: false },
  { id: "FKID000010", type: "vehicle_breakdown", area: "Yeshwanthpur Circle", corridor: "Tumkur Road", status: "resolved", priority: "High", lat: 13.022, lon: 77.545, start: "21 Jun 2024, 11:30", duration: "3h 12m", description: "Overloaded truck tipped near Yeshwanthpur — cargo cleared", vehicle: "Truck", zone: "West Zone", requires_closure: true },
  { id: "FKID000011", type: "political_rally", area: "Freedom Park, Kuvempu Road", corridor: "Bellary Road", status: "active", priority: "High", lat: 12.992, lon: 77.572, start: "23 Jun 2024, 09:30", duration: "ongoing", description: "Protest march from Mekhri Circle to Freedom Park — security deployed", zone: "Central Zone", requires_closure: false },
];

const corridorData = [
  { name: "Tumkur Rd", resolved: 6, active: 2 },
  { name: "ORR East", resolved: 5, active: 1 },
  { name: "NH44", resolved: 3, active: 2 },
  { name: "Bannerghatta", resolved: 2, active: 2 },
  { name: "ORR West", resolved: 6, active: 1 },
  { name: "MG Road", resolved: 1, active: 2 },
  { name: "Hosur Rd", resolved: 4, active: 1 },
];

const hourlyForecast = [
  { hour: "06", current: 22, predicted: 25 },
  { hour: "07", current: 55, predicted: 58 },
  { hour: "08", current: 88, predicted: 92 },
  { hour: "09", current: 95, predicted: 98 },
  { hour: "10", current: 78, predicted: 85 },
  { hour: "11", current: 62, predicted: 71 },
  { hour: "12", current: 58, predicted: 60 },
  { hour: "13", current: 65, predicted: 68 },
  { hour: "14", current: 72, predicted: 75 },
  { hour: "15", current: 68, predicted: 70 },
  { hour: "16", current: 85, predicted: 95 },
  { hour: "17", current: 96, predicted: 99 },
  { hour: "18", current: 90, predicted: 93 },
  { hour: "19", current: 75, predicted: 78 },
  { hour: "20", current: 55, predicted: 58 },
  { hour: "21", current: 35, predicted: 38 },
];

const upcomingEvents = [
  { date: "24 Jun", event: "Rajyotsava Parade", area: "Vidhana Soudha → MG Road", impact: "Critical" as const, manpower: 120, barricades: 45 },
  { date: "25 Jun", event: "IPL Victory Parade", area: "Chinnaswamy → Brigade Rd", impact: "High" as const, manpower: 80, barricades: 28 },
  { date: "26 Jun", event: "BBMP Road Closure", area: "Outer Ring Road, Marathahalli", impact: "Medium" as const, manpower: 30, barricades: 12 },
  { date: "28 Jun", event: "Kambala Festival", area: "Palace Grounds", impact: "High" as const, manpower: 65, barricades: 20 },
  { date: "30 Jun", event: "Bengaluru Half Marathon", area: "Cubbon Park → MG Road", impact: "High" as const, manpower: 95, barricades: 35 },
];

const zones = [
  { name: "Central Zone", active: 4, resolved: 12, officers: 48, barricades: 18, congestion: 92 },
  { name: "North Zone", active: 2, resolved: 8, officers: 24, barricades: 8, congestion: 78 },
  { name: "South Zone 1", active: 3, resolved: 15, officers: 36, barricades: 12, congestion: 65 },
  { name: "South Zone 2", active: 1, resolved: 10, officers: 18, barricades: 6, congestion: 45 },
  { name: "East Zone", active: 1, resolved: 6, officers: 20, barricades: 7, congestion: 55 },
  { name: "West Zone", active: 2, resolved: 11, officers: 28, barricades: 10, congestion: 70 },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const serif = { fontFamily: "'Playfair Display', Georgia, serif" };
const sans  = { fontFamily: "'Inter', sans-serif" };
const mono  = { fontFamily: "'DM Mono', monospace" };

const typeIcon = (type: string) => {
  const s = 13;
  switch (type) {
    case "vehicle_breakdown": return <Car size={s} />;
    case "political_rally":   return <Users size={s} />;
    case "tree_fall":         return <Trees size={s} />;
    case "construction":      return <Construction size={s} />;
    case "accident":          return <AlertTriangle size={s} />;
    case "sports_event":      return <Zap size={s} />;
    case "festival":          return <Activity size={s} />;
    case "road_repair":       return <Layers size={s} />;
    default:                  return <AlertCircle size={s} />;
  }
};

const typeLabel = (t: string) => t.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());

const priorityChip = (p: string) => {
  if (p === "Critical") return { bg: "#FFF0F0", color: RED };
  if (p === "High")     return { bg: "#FFF4EE", color: ORANGE };
  if (p === "Medium")   return { bg: "#FFFBEB", color: AMBER };
  return                       { bg: "#F0FDF4", color: GREEN };
};

const impactColor = (i: string) => i === "Critical" ? RED : i === "High" ? ORANGE : AMBER;

const toSVGCoord = (lat: number, lon: number) => ({
  x: ((lon - 77.45) / 0.32) * 380 + 10,
  y: ((13.12 - lat) / 0.32) * 280 + 10,
});

// ─── Mandala logo ─────────────────────────────────────────────────────────────

function Mandala({ size = 36, animate = false }: { size?: number; animate?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      {/* Outer rotating ring */}
      <g className={animate ? "spin-slow" : ""} style={{ transformOrigin: "50px 50px" }}>
        {[0,45,90,135,180,225,270,315].map(a => (
          <ellipse key={`op-${a}`} cx="50" cy="17" rx="4.5" ry="11"
            fill={RED} opacity="0.16" transform={`rotate(${a} 50 50)`} />
        ))}
      </g>
      <circle cx="50" cy="50" r="37" stroke={RED} strokeWidth="1" opacity="0.2" />
      {/* Mid petals */}
      {[0,60,120,180,240,300].map(a => (
        <ellipse key={`mp-${a}`} cx="50" cy="27" rx="3.5" ry="9"
          fill={RED} opacity="0.45" transform={`rotate(${a} 50 50)`} />
      ))}
      <circle cx="50" cy="50" r="23" stroke={RED} strokeWidth="0.8" opacity="0.3" />
      {/* Inner petals */}
      {[0,45,90,135,180,225,270,315].map(a => (
        <ellipse key={`ip-${a}`} cx="50" cy="35" rx="2.5" ry="7"
          fill={RED} opacity="0.7" transform={`rotate(${a} 50 50)`} />
      ))}
      <circle cx="50" cy="50" r="11" stroke={RED} strokeWidth="0.8" opacity="0.4" />
      <circle cx="50" cy="50" r="4.5" fill={RED} />
    </svg>
  );
}

// ─── Splash Screen ────────────────────────────────────────────────────────────

function SplashScreen({ onDone, lang }: { onDone: () => void; lang: Lang }) {
  const [exiting, setExiting] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setExiting(true), 2000);
    const t2 = setTimeout(onDone, 2450);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  return (
    <div
      className={`fixed inset-0 bg-white flex flex-col items-center justify-center gap-6 z-50 ${exiting ? "splash-out" : ""}`}
    >
      <div className="anim-scaleIn">
        <Mandala size={72} animate />
      </div>
      <div className="flex flex-col items-center gap-1">
        <h1 className="text-3xl tracking-tight anim-fadeUp-1" style={{ ...serif, color: "#1A1A1A" }}>
          Nirantara
        </h1>
        <p className="text-xs tracking-[0.18em] uppercase anim-fadeUp-2" style={{ ...mono, color: "#AAAAAA" }}>
          {T[lang].appSub}
        </p>
      </div>
      <div className="anim-fadeUp-3 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
        <span className="text-[10px] tracking-[0.12em] uppercase" style={{ ...mono, color: "#BBBBBB" }}>
          {T[lang].live}
        </span>
      </div>
    </div>
  );
}

// ─── Language Screen ──────────────────────────────────────────────────────────

function LanguageScreen({ onSelect }: { onSelect: (l: Lang) => void }) {
  const [chosen, setChosen] = useState<Lang | null>(null);
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center gap-10 z-40 anim-fadeIn px-6">
      <div className="flex flex-col items-center gap-3">
        <Mandala size={44} />
        <h2 className="text-2xl text-center" style={{ ...serif, color: "#1A1A1A" }}>
          Choose your language<br />
          <span style={{ color: "#888" }}>ನಿಮ್ಮ ಭಾಷೆ ಆರಿಸಿ</span>
        </h2>
        <p className="text-xs text-center" style={{ ...sans, color: "#AAAAAA" }}>
          You can change this in settings later
        </p>
      </div>

      <div className="flex gap-4 w-full max-w-xs">
        {(["en", "kn"] as Lang[]).map((l) => (
          <button
            key={l}
            onClick={() => setChosen(l)}
            className="flex-1 py-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-1"
            style={{
              borderColor: chosen === l ? RED : "#EBEBEB",
              background: chosen === l ? `${RED}08` : "white",
            }}
          >
            <span className="text-lg font-medium" style={{ ...serif, color: chosen === l ? RED : "#1A1A1A" }}>
              {l === "en" ? "Aa" : "ಅಅ"}
            </span>
            <span className="text-xs" style={{ ...sans, color: chosen === l ? RED : "#888" }}>
              {l === "en" ? "English" : "ಕನ್ನಡ"}
            </span>
          </button>
        ))}
      </div>

      <button
        disabled={!chosen}
        onClick={() => chosen && onSelect(chosen)}
        className="px-10 py-3 rounded-full text-sm transition-all"
        style={{
          ...sans,
          background: chosen ? RED : "#F4F4F4",
          color: chosen ? "white" : "#CCCCCC",
          cursor: chosen ? "pointer" : "not-allowed",
        }}
      >
        {chosen === "kn" ? T.kn.continue : "Continue"}
      </button>
    </div>
  );
}

// ─── Incident Map ─────────────────────────────────────────────────────────────

function IncidentMap({ items }: { items: Incident[] }) {
  const [hov, setHov] = useState<string | null>(null);
  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #EBEBEB" }}>
      <div className="px-5 py-3.5 border-b flex items-center justify-between" style={{ borderColor: "#EBEBEB" }}>
        <span className="text-sm font-medium" style={{ ...sans, color: "#1A1A1A" }}>Bengaluru — Live view</span>
        <span style={{ ...mono, fontSize: 11, color: "#AAAAAA" }}>
          {items.filter(i => i.status === "active").length} active
        </span>
      </div>
      <div style={{ background: "#FAFAFA", position: "relative" }}>
        <svg width="100%" height="280" viewBox="0 0 400 280" preserveAspectRatio="xMidYMid meet">
          {/* Grid */}
          {Array.from({ length: 8 }, (_, i) => (
            <line key={`h-${i}`} x1="0" y1={i * 40} x2="400" y2={i * 40} stroke="#EFEFEF" strokeWidth="1" />
          ))}
          {Array.from({ length: 11 }, (_, i) => (
            <line key={`v-${i}`} x1={i * 40} y1="0" x2={i * 40} y2="280" stroke="#EFEFEF" strokeWidth="1" />
          ))}

          {/* ORR ring */}
          <ellipse cx="195" cy="155" rx="148" ry="103" stroke="#E0E0E0" strokeWidth="5" fill="none" strokeDasharray="6 4" />

          {/* Key corridors */}
          {[
            { d: "M 10 95 L 85 95 L 165 90 L 250 88 L 340 85 L 380 83" },
            { d: "M 185 260 L 183 200 L 183 140 L 185 80 L 186 20" },
            { d: "M 28 18 L 115 85 L 158 148 L 183 230" },
            { d: "M 118 262 L 158 215 L 182 172 L 195 135 L 204 95 L 212 48" },
          ].map((c, i) => (
            <path key={`c-${i}`} d={c.d} stroke="#DCDCDC" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          ))}

          {/* Markers */}
          {items.map((inc) => {
            const { x, y } = toSVGCoord(inc.lat, inc.lon);
            const isActive = inc.status === "active";
            const c = inc.priority === "Critical" ? RED : inc.priority === "High" ? ORANGE : inc.priority === "Medium" ? AMBER : GREEN;
            const r = inc.priority === "Critical" ? 8 : 6;
            const isHov = hov === inc.id;
            return (
              <g key={inc.id} style={{ cursor: "pointer" }}
                onMouseEnter={() => setHov(inc.id)} onMouseLeave={() => setHov(null)}>
                {isActive && (
                  <circle cx={x} cy={y} r={r + 5} fill={c} opacity="0.12">
                    <animate attributeName="r" values={`${r+3};${r+9};${r+3}`} dur="2.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.18;0.04;0.18" dur="2.5s" repeatCount="indefinite" />
                  </circle>
                )}
                <circle cx={x} cy={y} r={r} fill={c} />
                <circle cx={x} cy={y} r={r} stroke="white" strokeWidth="1.5" fill="none" />

                {isHov && (
                  <g>
                    <rect x={Math.min(x - 4, 255)} y={y - 50} width="136" height="42"
                      rx="7" fill="white" style={{ filter: "drop-shadow(0 3px 10px rgba(0,0,0,0.1))" }} />
                    <text x={Math.min(x - 4, 255) + 8} y={y - 32} fontSize="9" fontWeight="600" fill="#1A1A1A" fontFamily="Inter,sans-serif">
                      {inc.area.slice(0, 22)}
                    </text>
                    <text x={Math.min(x - 4, 255) + 8} y={y - 20} fontSize="8" fill="#888" fontFamily="DM Mono,monospace">
                      {typeLabel(inc.type)}
                    </text>
                    <text x={Math.min(x - 4, 255) + 8} y={y - 10} fontSize="8" fill={c} fontWeight="600" fontFamily="Inter,sans-serif">
                      {inc.priority} · {inc.status}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>
      <div className="px-5 py-2.5 flex gap-4" style={{ borderTop: "1px solid #EBEBEB" }}>
        {[{ c: RED, l: "Critical" }, { c: ORANGE, l: "High" }, { c: AMBER, l: "Medium" }, { c: GREEN, l: "Resolved" }].map(({ c, l }) => (
          <div key={l} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: c }} />
            <span style={{ ...mono, fontSize: 10, color: "#AAAAAA" }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Incident row ─────────────────────────────────────────────────────────────

function IncidentRow({ inc, lang }: { inc: Incident; lang: Lang }) {
  const chip = priorityChip(inc.priority);
  const status = inc.status;
  return (
    <div className="flex items-start gap-3.5 py-3.5" style={{ borderBottom: "1px solid #F4F4F4" }}>
      <div className="mt-0.5 p-1.5 rounded-lg flex-shrink-0" style={{ background: "#F4F4F4", color: "#888" }}>
        {typeIcon(inc.type)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-sm font-medium truncate" style={{ ...sans, color: "#1A1A1A" }}>{inc.area}</span>
          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded" style={{ background: chip.bg, color: chip.color, ...mono }}>
            {inc.priority}
          </span>
          {inc.requires_closure && (
            <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "#FFF0F0", color: RED, ...mono }}>
              Road closed
            </span>
          )}
        </div>
        <div className="text-xs mt-0.5 truncate" style={{ ...mono, color: "#BBBBBB" }}>
          {typeLabel(inc.type)} · {inc.corridor}
        </div>
      </div>
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <span className="text-[10px] font-medium" style={{
          ...mono,
          color: status === "active" ? RED : status === "resolved" ? GREEN : "#AAAAAA",
        }}>
          {status === "active" ? (lang === "kn" ? T.kn.active : "Active") :
           status === "resolved" ? (lang === "kn" ? T.kn.resolved : "Resolved") :
           (lang === "kn" ? T.kn.closed : "Closed")}
        </span>
        <span style={{ ...mono, fontSize: 10, color: "#CCCCCC" }}>{inc.duration}</span>
      </div>
    </div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function Stat({
  label, value, sub, icon, primary = false
}: {
  label: string; value: string | number; sub: string; icon: React.ReactNode; primary?: boolean;
}) {
  return (
    <div className="rounded-2xl p-5 flex flex-col gap-4"
      style={{ background: primary ? RED : "white", border: primary ? "none" : "1px solid #EBEBEB" }}>
      <div className="flex items-start justify-between">
        <div className="p-1.5 rounded-lg" style={{ background: primary ? "rgba(255,255,255,0.18)" : "#F4F4F4" }}>
          <span style={{ color: primary ? "white" : "#888" }}>{icon}</span>
        </div>
        <ArrowUpRight size={13} style={{ color: primary ? "rgba(255,255,255,0.5)" : "#DDDDDD" }} />
      </div>
      <div>
        <div className="text-[28px] font-medium leading-none" style={{ ...serif, color: primary ? "white" : "#1A1A1A" }}>
          {value}
        </div>
        <div className="text-xs mt-1.5" style={{ ...sans, color: primary ? "rgba(255,255,255,0.8)" : "#888" }}>
          {label}
        </div>
        <div className="text-[10px] mt-0.5" style={{ ...mono, color: primary ? "rgba(255,255,255,0.5)" : "#CCCCCC" }}>
          {sub}
        </div>
      </div>
    </div>
  );
}

// ─── Quick actions ────────────────────────────────────────────────────────────

function QuickActions({ lang }: { lang: Lang }) {
  const t = T[lang];
  const actions = [
    { label: t.newIncident, icon: <Plus size={14} />, fill: true },
    { label: t.dispatch,    icon: <Shield size={14} />, fill: false },
    { label: t.diversion,   icon: <Navigation size={14} />, fill: false },
  ];
  return (
    <div className="flex gap-2 flex-wrap">
      {actions.map(a => (
        <button key={a.label} className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium transition-all active:scale-95"
          style={{
            ...sans,
            background: a.fill ? RED : "white",
            color: a.fill ? "white" : "#1A1A1A",
            border: a.fill ? "none" : "1px solid #EBEBEB",
          }}>
          {a.icon}{a.label}
        </button>
      ))}
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function Dashboard({ items, lang }: { items: Incident[]; lang: Lang }) {
  const t = T[lang];
  const active = items.filter(i => i.status === "active");
  const resolved = items.filter(i => i.status === "resolved");
  const highP = items.filter(i => i.priority === "High" || i.priority === "Critical");
  const recent = [...items].sort(a => a.status === "active" ? -1 : 1).slice(0, 6);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <QuickActions lang={lang} />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat label={t.activeIncidents} value={active.length} sub={`↑ 3 ${t.fromYesterday}`} icon={<Radio size={15} />} primary />
        <Stat label={t.resolvedToday}   value={resolved.length} sub="avg 47 min" icon={<CheckCircle2 size={15} />} />
        <Stat label={t.highPriority}    value={highP.length} sub={t.live2Critical} icon={<AlertTriangle size={15} />} />
        <Stat label={t.avgResponse}     value="12m" sub={t.target15} icon={<Clock size={15} />} />
      </div>

      {/* Map + feed */}
      <div className="grid lg:grid-cols-[1fr_340px] gap-5">
        <IncidentMap items={items} />

        <div>
          <div className="flex items-baseline justify-between mb-3">
            <span className="text-sm font-medium" style={{ ...sans }}>{t.recentIncidents}</span>
            <span style={{ ...mono, fontSize: 10, color: "#AAAAAA" }}>{items.length} total</span>
          </div>
          <div>
            {recent.map(inc => <IncidentRow key={inc.id} inc={inc} lang={lang} />)}
          </div>
        </div>
      </div>

      {/* Corridor chart */}
      <div className="rounded-2xl p-5" style={{ border: "1px solid #EBEBEB" }}>
        <div className="mb-5">
          <div className="text-sm font-medium" style={{ ...sans }}>{t.corridorActivity}</div>
          <div style={{ ...mono, fontSize: 10, color: "#AAAAAA" }}>{t.last30}</div>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={corridorData} barGap={3} barCategoryGap="35%">
            <XAxis dataKey="name" tick={{ fontSize: 10, fontFamily: "DM Mono,monospace", fill: "#BBBBBB" }}
              axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fontFamily: "DM Mono,monospace", fill: "#BBBBBB" }}
              axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ fontFamily: "DM Mono,monospace", fontSize: 11, borderRadius: 10, border: "1px solid #EBEBEB", boxShadow: "none" }}
              cursor={{ fill: "#F7F7F7" }} />
            <Bar dataKey="resolved" name="Resolved" fill="#EBEBEB" radius={[3,3,0,0]} />
            <Bar dataKey="active" name="Active" fill={RED} radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── Incidents tab ────────────────────────────────────────────────────────────

const FILTERS_EN = ["All", "Active", "Resolved", "Closed", "Critical", "High"];

function IncidentsTab({ items, lang }: { items: Incident[]; lang: Lang }) {
  const t = T[lang];
  const filterLabels = lang === "kn"
    ? [t.all, t.active, t.resolved, t.closed, t.critical, t.high]
    : FILTERS_EN;
  const filterKeys = ["All", "Active", "Resolved", "Closed", "Critical", "High"];
  const [fi, setFi] = useState(0);
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const key = filterKeys[fi];
    let out = [...items];
    if (key === "Active")   out = out.filter(i => i.status === "active");
    if (key === "Resolved") out = out.filter(i => i.status === "resolved");
    if (key === "Closed")   out = out.filter(i => i.status === "closed");
    if (key === "Critical") out = out.filter(i => i.priority === "Critical");
    if (key === "High")     out = out.filter(i => i.priority === "High");
    if (q) out = out.filter(i =>
      i.area.toLowerCase().includes(q.toLowerCase()) ||
      i.corridor.toLowerCase().includes(q.toLowerCase()) ||
      i.description.toLowerCase().includes(q.toLowerCase())
    );
    return out.sort(a => a.status === "active" ? -1 : 1);
  }, [items, fi, q]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl" style={{ ...serif }}>{t.incidentLog}</h2>
          <p style={{ ...mono, fontSize: 10, color: "#AAAAAA" }}>
            {filtered.length} incidents · BTP FMS
          </p>
        </div>
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#CCCCCC" }} />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder={t.search}
            className="pl-8 pr-3.5 py-2 text-sm rounded-xl w-full sm:w-60 focus:outline-none"
            style={{ ...sans, background: "#F7F7F7", color: "#1A1A1A" }} />
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {filterLabels.map((label, i) => (
          <button key={filterKeys[i]} onClick={() => setFi(i)}
            className="px-3.5 py-1.5 rounded-full text-xs font-medium transition-all"
            style={{
              ...sans,
              background: fi === i ? RED : "white",
              color: fi === i ? "white" : "#888",
              border: fi === i ? "none" : "1px solid #EBEBEB",
            }}>
            {label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl px-5" style={{ border: "1px solid #EBEBEB" }}>
        {filtered.length === 0 ? (
          <p className="text-center py-16" style={{ ...mono, fontSize: 12, color: "#CCCCCC" }}>{t.noResults}</p>
        ) : (
          filtered.map(inc => <IncidentRow key={inc.id} inc={inc} lang={lang} />)
        )}
      </div>
    </div>
  );
}

// ─── Forecast tab ─────────────────────────────────────────────────────────────

function ForecastTab({ lang }: { lang: Lang }) {
  const t = T[lang];
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div>
        <h2 className="text-xl" style={{ ...serif }}>{t.forecast}</h2>
        <p style={{ ...mono, fontSize: 10, color: "#AAAAAA" }}>
          ML model · trained 23 Jun 2024 06:00 IST · 91.3% accuracy
        </p>
      </div>

      {/* Congestion chart */}
      <div className="rounded-2xl p-5" style={{ border: "1px solid #EBEBEB" }}>
        <div className="flex items-start justify-between mb-1">
          <div className="text-sm font-medium" style={{ ...sans }}>{t.congestionIndex}</div>
          <div className="flex gap-3">
            {[{ c: "#DCDCDC", l: "Actual" }, { c: RED, l: "Predicted" }].map(({ c, l }) => (
              <div key={l} className="flex items-center gap-1.5">
                <span className="inline-block w-5 h-px rounded" style={{ background: c }} />
                <span style={{ ...mono, fontSize: 10, color: "#AAAAAA" }}>{l}</span>
              </div>
            ))}
          </div>
        </div>
        <p style={{ ...mono, fontSize: 10, color: "#CCCCCC" }} className="mb-5">{t.zeroFreeFlow}</p>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={hourlyForecast}>
            <defs>
              <linearGradient id="predG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={RED} stopOpacity={0.1} />
                <stop offset="95%" stopColor={RED} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F4F4F4" vertical={false} />
            <XAxis dataKey="hour" tick={{ fontSize: 10, fontFamily: "DM Mono,monospace", fill: "#BBBBBB" }}
              axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fontFamily: "DM Mono,monospace", fill: "#BBBBBB" }}
              axisLine={false} tickLine={false} domain={[0, 100]} />
            <Tooltip contentStyle={{ fontFamily: "DM Mono,monospace", fontSize: 11, borderRadius: 10, border: "1px solid #EBEBEB", boxShadow: "none" }} />
            <Area type="monotone" dataKey="current" name="Actual" stroke="#DCDCDC" strokeWidth={1.5} fill="none" />
            <Area type="monotone" dataKey="predicted" name="Predicted" stroke={RED} strokeWidth={2}
              fill="url(#predG)" strokeDasharray="5 3" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Upcoming events */}
      <div>
        <div className="text-sm font-medium mb-4" style={{ ...sans }}>{t.upcomingEvents}</div>
        <div className="space-y-3">
          {upcomingEvents.map((ev) => {
            const ic = impactColor(ev.impact);
            return (
              <div key={ev.event} className="rounded-2xl p-4" style={{ border: "1px solid #EBEBEB", background: "white" }}>
                <div className="flex items-start gap-4">
                  <div className="text-center flex-shrink-0 w-12">
                    <div style={{ ...mono, fontSize: 9, color: ic, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      {ev.date.split(" ")[1]}
                    </div>
                    <div style={{ ...serif, fontSize: 22, color: "#1A1A1A", lineHeight: 1.1 }}>
                      {ev.date.split(" ")[0]}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium" style={{ ...sans }}>{ev.event}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ ...mono, background: `${ic}12`, color: ic }}>
                        {ev.impact}
                      </span>
                    </div>
                    <div className="text-xs mt-0.5 truncate" style={{ ...mono, color: "#BBBBBB" }}>
                      {ev.area}
                    </div>
                    <div className="mt-2.5 p-2.5 rounded-xl" style={{ background: "#F7F7F7" }}>
                      <p className="text-xs leading-relaxed" style={{ ...sans, color: "#666" }}>
                        <span style={{ color: "#1A1A1A", fontWeight: 500 }}>{t.aiRec}:</span>{" "}
                        Deploy {ev.manpower} officers + {ev.barricades} barricades.
                        Pre-position by 08:00. Activate diversions 90 min prior.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 flex-shrink-0">
                    {[{ v: ev.manpower, l: t.officers }, { v: ev.barricades, l: t.barricades }].map(({ v, l }) => (
                      <div key={l} className="text-center">
                        <div style={{ ...serif, fontSize: 20, color: "#1A1A1A" }}>{v}</div>
                        <div style={{ ...mono, fontSize: 9, color: "#AAAAAA", textTransform: "uppercase" }}>{l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Resources tab ────────────────────────────────────────────────────────────

function ResourcesTab({ lang }: { lang: Lang }) {
  const t = T[lang];
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div>
        <h2 className="text-xl" style={{ ...serif }}>{t.resources}</h2>
        <p style={{ ...mono, fontSize: 10, color: "#AAAAAA" }}>23 Jun 2024, 16:45 IST</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Stat label={t.officers}   value="174" sub="across 6 zones" icon={<Users size={15} />} primary />
        <Stat label={t.barricades} value="61"  sub="14 in transit" icon={<Shield size={15} />} />
        <Stat label={t.avgResponse} value="12m" sub={t.target15} icon={<Clock size={15} />} />
      </div>

      {/* Zone table */}
      <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #EBEBEB" }}>
        <div className="px-5 py-3.5 border-b" style={{ borderColor: "#F4F4F4" }}>
          <span className="text-sm font-medium" style={{ ...sans }}>{t.zonalDeployment}</span>
        </div>
        <div>
          {zones.map((z, zi) => {
            const c = z.congestion > 85 ? RED : z.congestion > 65 ? ORANGE : z.congestion > 45 ? AMBER : GREEN;
            return (
              <div key={z.name} className="px-5 py-4 flex items-center gap-5"
                style={{ borderBottom: zi < zones.length - 1 ? "1px solid #F4F4F4" : "none" }}>
                <div className="w-28 flex-shrink-0">
                  <div className="text-sm font-medium" style={{ ...sans }}>{z.name}</div>
                  <div style={{ ...mono, fontSize: 10, color: "#BBBBBB" }}>
                    {z.active} active · {z.resolved} resolved
                  </div>
                </div>
                {/* Congestion bar */}
                <div className="flex-1 flex items-center gap-3">
                  <div className="flex-1 h-1.5 rounded-full" style={{ background: "#F4F4F4", overflow: "hidden" }}>
                    <div className="h-full rounded-full" style={{ width: `${z.congestion}%`, background: c, transition: "width 0.6s ease" }} />
                  </div>
                  <span style={{ ...mono, fontSize: 11, color: c, width: 28, textAlign: "right" }}>{z.congestion}</span>
                </div>
                {/* Officers / barricades */}
                <div className="flex gap-4 flex-shrink-0">
                  <div className="text-center w-10">
                    <div style={{ ...serif, fontSize: 17 }}>{z.officers}</div>
                    <div style={{ ...mono, fontSize: 9, color: "#CCCCCC" }}>OFF</div>
                  </div>
                  <div className="text-center w-10">
                    <div style={{ ...serif, fontSize: 17 }}>{z.barricades}</div>
                    <div style={{ ...mono, fontSize: 9, color: "#CCCCCC" }}>BAR</div>
                  </div>
                </div>
                {/* Alert */}
                {z.congestion > 80 && (
                  <div className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full" style={{ background: "#FFF0F0" }}>
                    <AlertTriangle size={10} style={{ color: RED }} />
                    <span style={{ ...mono, fontSize: 9, color: RED }}>Reinforce</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Post-event learning */}
      <div className="rounded-2xl p-5" style={{ border: "1px solid #EBEBEB" }}>
        <div className="text-sm font-medium mb-4" style={{ ...sans }}>{t.postEvent}</div>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { label: t.eventsAnalysed, value: "847", sub: "since Jan 2023" },
            { label: t.forecastAccuracy, value: "91.3%", sub: "+4.2% vs last quarter" },
            { label: t.timeSaved, value: "18 min", sub: "per incident vs manual" },
          ].map(s => (
            <div key={s.label} className="p-4 rounded-xl" style={{ background: "#F7F7F7" }}>
              <div style={{ ...serif, fontSize: 22, color: "#1A1A1A" }}>{s.value}</div>
              <div className="text-xs mt-1" style={{ ...sans, color: "#888" }}>{s.label}</div>
              <div style={{ ...mono, fontSize: 10, color: "#CCCCCC" }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────

function Header({ tab, setTab, lang }: { tab: string; setTab: (t: string) => void; lang: Lang }) {
  const t = T[lang];
  const tabs = [
    { id: "dashboard", label: t.dashboard },
    { id: "incidents", label: t.incidents },
    { id: "forecast",  label: t.forecast  },
    { id: "resources", label: t.resources },
  ];
  return (
    <header className="sticky top-0 z-40 bg-white" style={{ borderBottom: "1px solid #EBEBEB" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-6">
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <Mandala size={28} />
          <div>
            <div className="text-[15px] font-medium leading-tight" style={{ ...serif, color: "#1A1A1A" }}>
              Nirantara
            </div>
            <div style={{ ...mono, fontSize: 9, color: "#CCCCCC", letterSpacing: "0.1em", textTransform: "uppercase", lineHeight: 1.2 }}>
              {t.appSub}
            </div>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {tabs.map(tb => (
            <button key={tb.id} onClick={() => setTab(tb.id)}
              className="px-3.5 py-1.5 rounded-lg text-xs transition-all"
              style={{
                ...sans,
                fontWeight: 500,
                background: tab === tb.id ? "#1A1A1A" : "transparent",
                color: tab === tb.id ? "white" : "#888",
              }}>
              {tb.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
          <span style={{ ...mono, fontSize: 10, color: RED }}>{t.live}</span>
        </div>
      </div>

      {/* Mobile tabs */}
      <div className="md:hidden flex overflow-x-auto" style={{ borderTop: "1px solid #F4F4F4" }}>
        {tabs.map(tb => (
          <button key={tb.id} onClick={() => setTab(tb.id)}
            className="flex-1 min-w-fit px-4 py-2.5 text-xs whitespace-nowrap transition-all"
            style={{
              ...sans, fontWeight: 500,
              color: tab === tb.id ? RED : "#AAAAAA",
              borderBottom: tab === tb.id ? `2px solid ${RED}` : "2px solid transparent",
            }}>
            {tb.label}
          </button>
        ))}
      </div>
    </header>
  );
}

// ─── App root ─────────────────────────────────────────────────────────────────

type Phase = "splash" | "language" | "app";

export default function App() {
  const [phase, setPhase] = useState<Phase>("splash");
  const [lang,  setLang]  = useState<Lang>("en");
  const [tab,   setTab]   = useState("dashboard");

  const handleLang = (l: Lang) => { setLang(l); setPhase("app"); };

  return (
    <div className="min-h-screen bg-white">
      <style>{CSS}</style>

      {phase === "splash"   && <SplashScreen onDone={() => setPhase("language")} lang={lang} />}
      {phase === "language" && <LanguageScreen onSelect={handleLang} />}

      {phase === "app" && (
        <div className="anim-fadeIn">
          <Header tab={tab} setTab={setTab} lang={lang} />
          <main>
            {tab === "dashboard" && <Dashboard items={incidents} lang={lang} />}
            {tab === "incidents" && <IncidentsTab items={incidents} lang={lang} />}
            {tab === "forecast"  && <ForecastTab lang={lang} />}
            {tab === "resources" && <ResourcesTab lang={lang} />}
          </main>
          <footer style={{ borderTop: "1px solid #EBEBEB" }} className="py-5 mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Mandala size={18} />
                <span style={{ ...serif, fontSize: 13, color: "#AAAAAA" }}>Nirantara</span>
              </div>
              <span style={{ ...mono, fontSize: 10, color: "#CCCCCC" }}>
                Bengaluru Traffic Police · FMS v2.4 · BTP + BBMP + BMTC feeds
              </span>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                <span style={{ ...mono, fontSize: 10, color: "#CCCCCC" }}>All systems operational</span>
              </div>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
}
