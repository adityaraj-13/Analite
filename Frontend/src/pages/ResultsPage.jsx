import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";
import Navbar from "../components/Navbar";

// ─── Constants ────────────────────────────────────────────────────────────────
const LOADING_STEPS = [
  "Scanning web sources...",
  "Reading Reddit threads...",
  "Analyzing competitor pricing...",
  "Calculating sentiment score...",
  "Mapping market position...",
  "Compiling intelligence report...",
];
const LOADING_ICONS = ["🌐", "💬", "📊", "🧠", "🎯", "✨"];
const PIE_COLORS    = ["#22c55e", "#475569", "#ef4444"];
const THREAT_COLORS = ["#ef4444", "#f97316", "#eab308", "#a855f7"];

// ─── Mock data ─────────────────────────────────────────────────────────────────
const MOCK = {
  product: "sony ps5",
  analyzedAt: "2026-03-06T18:13:10.365Z",
  sentiment: {
    sentimentScore: 65,
    sentimentBreakdown: { positive: 60, neutral: 15, negative: 25 },
    overallSummary:
      "The PlayStation 5 is highly regarded for its impressive library of exclusive titles and solid performance. Customer satisfaction is occasionally dampened by frustrations regarding the warranty repair process and hardware reliability concerns.",
    topPraises: [
      "Strong library of high-quality exclusive games",
      "Excellent technical performance and graphical fidelity",
    ],
    topComplaints: [
      "Slow and frustrating warranty repair and replacement processes",
      "Hardware reliability issues such as GPU artifacts and rendering errors",
    ],
    sourcesUsed: [
      "https://www.reddit.com/r/PS5/comments/k91ja3/a_complaint_about_sonys_warranty_process_bricked/",
      "https://www.reddit.com/r/PS5/comments/qqb8pn/playstation_5_one_year_review_by_mystic/",
      "https://www.reddit.com/r/PS5/comments/1gl2kyd/eurogamer_sony_playstation_5_pro_review_across/",
      "https://www.reddit.com/r/sony/comments/slle8w/my_experience_with_sony_and_trying_to_get_my_ps5/",
    ],
  },
  competitors: {
    marketPosition:
      "The Sony PS5 is positioned as a high-performance home gaming console defined by its library of exclusive, high-fidelity titles and advanced 4K graphical capabilities.",
    competitorsList: [
      { name: "Xbox Series X",        price: "$499",        keyDifferentiator: "Massive library via Xbox Game Pass subscription. Powerful hardware at price parity.", threatLevel: 9 },
      { name: "Nintendo Switch OLED", price: "$350–$400",   keyDifferentiator: "Portability and family-friendly exclusives unavailable on home consoles.", threatLevel: 7 },
      { name: "Steam Deck",           price: "$450+",       keyDifferentiator: "Portable PC gaming — access your entire Steam library anywhere.", threatLevel: 6 },
    ],
    sourcesUsed: [
      "https://www.bajajfinserv.in/ps5-alternatives",
      "https://www.pcmag.com/comparisons/sony-playstation-5-vs-playstation-5-pro-is-more-power-worth-an-extra-200",
      "https://www.laptopmag.com/features/ps5-vs-nintendo-switch-vs-xbox-series-x-vs-pc-which-gives-you-the-best-bang-for-your-buck",
      "https://www.techradar.com/news/best-consoles",
    ],
  },
  launchMetrics: {
    estimatedLaunchDate: "Nov 12, 2020",
    launchPrice: "$399–$499",
    targetAudience:
      "Gamers seeking next-generation entertainment through high-performance hardware and exclusive game titles.",
    coreFeatures: [
      "Custom high-speed SSD for near-instant loading",
      "DualSense Wireless Controller with haptic feedback",
      "Ultra HD Blu-ray disc drive support",
    ],
    sourcesUsed: [
      "https://sonyinteractive.com/en/press-releases/2020/playstation-5-launches-this-november-at-399-for-ps5-digital-edition-and-499-for-ps5-with-ultra-hd-blu-ray-disc-drive/",
      "https://sonyinteractive.com/en/press-releases/2024/sony-interactive-entertainment-launches-playstation-5-pro/",
      "https://explore.st-aug.edu/exp/ps5-hits-the-market-when-did-the-playstation-5-arrive-and-what-defined-its-groundbreaking-launch",
      "https://www.cnbc.com/2024/09/10/sony-playstation-5-pro-launch-price-specs-release-date.html",
    ],
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtProduct = (s = "") =>
  s.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
const scoreColor = (n) => n >= 70 ? "#22c55e" : n >= 40 ? "#eab308" : "#ef4444";
const scoreLabel = (n) => n >= 70 ? "Positive" : n >= 40 ? "Mixed" : "Negative";

const TT_STYLE = {
  background: "#0d1526",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 10,
  fontSize: 12,
  color: "#e2e8f0",
};

// ─── Intersection Observer hook ───────────────────────────────────────────────
function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

// ─── CountUp ──────────────────────────────────────────────────────────────────
function CountUp({ to, duration = 1100 }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let start;
    const tick = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setV(Math.round(p * to));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [to]);
  return <>{v}</>;
}

// ─── Score Ring ───────────────────────────────────────────────────────────────
function ScoreRing({ score, animate }) {
  const r    = 42;
  const circ = 2 * Math.PI * r;
  const off  = animate ? circ - (score / 100) * circ : circ;
  const col  = scoreColor(score);
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      gap: 6, padding: "20px 24px",
      background: "rgba(255,255,255,0.04)",
      border: `1px solid ${col}30`,
      borderRadius: 18,
      width: "fit-content",
    }}>
      <svg width="108" height="108" viewBox="0 0 108 108">
        <circle cx="54" cy="54" r={r} stroke="#1a2540" strokeWidth="8" fill="none" />
        <circle cx="54" cy="54" r={r} stroke={col} strokeWidth="8" fill="none"
          strokeDasharray={circ}
          strokeDashoffset={off}
          strokeLinecap="round"
          transform="rotate(-90 54 54)"
          style={{
            transition: "stroke-dashoffset 1.3s cubic-bezier(0.34,1.2,0.64,1)",
            filter: animate ? `drop-shadow(0 0 6px ${col}80)` : "none",
          }}
        />
        <text x="54" y="50" textAnchor="middle" fill={col} fontSize="24" fontWeight="900" fontFamily="Inter,sans-serif">
          {animate ? <CountUp to={score} /> : "0"}
        </text>
        <text x="54" y="66" textAnchor="middle" fill="rgba(255,255,255,0.28)" fontSize="11" fontFamily="sans-serif">
          / 100
        </text>
      </svg>
      <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: col, margin: 0, whiteSpace: "nowrap" }}>
        {scoreLabel(score)} Sentiment
      </p>
    </div>
  );
}

// ─── Animated horizontal bar ──────────────────────────────────────────────────
function AnimBar({ name, value, max, color, delay, animate }) {
  const pct = animate ? (value / max) * 100 : 0;
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>{name}</span>
        <span style={{ fontSize: 13, fontWeight: 800, color }}>{value}/10</span>
      </div>
      <div style={{ height: 9, background: "rgba(255,255,255,0.07)", borderRadius: 99, overflow: "hidden" }}>
        <div style={{
          height: "100%",
          width: `${pct}%`,
          background: `linear-gradient(90deg, ${color}aa, ${color})`,
          borderRadius: 99,
          boxShadow: animate ? `0 0 10px ${color}55` : "none",
          transition: `width 0.9s cubic-bezier(0.34,1.1,0.64,1) ${delay * 130}ms`,
        }} />
      </div>
    </div>
  );
}

function AnimBarGroup({ competitors }) {
  const [ref, visible] = useInView(0.1);
  return (
    <div ref={ref} style={{ paddingTop: 4 }}>
      {competitors.map((c, i) => (
        <AnimBar key={i} name={c.name} value={c.threatLevel} max={10}
          color={THREAT_COLORS[i]} delay={i} animate={visible} />
      ))}
    </div>
  );
}

// ─── Donut chart ──────────────────────────────────────────────────────────────
function DonutChart({ breakdown }) {
  const [active, setActive] = useState(null);
  const data = [
    { name: "Positive", value: breakdown.positive },
    { name: "Neutral",  value: breakdown.neutral  },
    { name: "Negative", value: breakdown.negative },
  ];
  return (
    <div>
      <ResponsiveContainer width="100%" height={190}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%"
            innerRadius={52} outerRadius={78}
            paddingAngle={3} dataKey="value"
            animationBegin={300} animationDuration={900}
            onMouseEnter={(_, i) => setActive(i)}
            onMouseLeave={() => setActive(null)}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={PIE_COLORS[i]}
                opacity={active === null || active === i ? 1 : 0.4}
                style={{ filter: active === i ? `drop-shadow(0 0 8px ${PIE_COLORS[i]}90)` : "none", cursor: "pointer", transition: "opacity 0.2s" }}
              />
            ))}
          </Pie>
          <Tooltip contentStyle={TT_STYLE} formatter={(v, n) => [`${v}%`, n]} itemStyle={{ color: "#e2e8f0" }} />
        </PieChart>
      </ResponsiveContainer>
      <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap", marginTop: 4 }}>
        {data.map((d, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "rgba(255,255,255,0.55)", cursor: "pointer" }}
            onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(null)}>
            <span style={{ width: 9, height: 9, borderRadius: "50%", background: PIE_COLORS[i], flexShrink: 0 }} />
            {d.name} <strong style={{ color: PIE_COLORS[i] }}>{d.value}%</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Reveal card ──────────────────────────────────────────────────────────────
function Card({ children, delay = 0, style = {}, className = "" }) {
  const [ref, visible] = useInView(0.05);
  return (
    <div ref={ref} className={className} style={{
      background: "rgba(255,255,255,0.035)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 16,
      padding: "20px 18px",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(20px)",
      transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
      ...style,
    }}>
      {children}
    </div>
  );
}

// ─── Section label ────────────────────────────────────────────────────────────
const SLabel = ({ c = "rgba(255,255,255,0.3)", children }) => (
  <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: c, margin: "0 0 10px" }}>
    {children}
  </p>
);

// ─── Loading ──────────────────────────────────────────────────────────────────
function LoadingScreen({ step }) {
  const idx = step % LOADING_STEPS.length;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "72vh", padding: "40px 20px", textAlign: "center" }}>
      <div style={{ position: "relative", width: 76, height: 76, marginBottom: 24 }}>
        <svg width="76" height="76" viewBox="0 0 76 76" style={{ position: "absolute", inset: 0 }}>
          <circle cx="38" cy="38" r="30" stroke="#1e293b" strokeWidth="5" fill="none" />
          <circle cx="38" cy="38" r="30" stroke="url(#lg)" strokeWidth="5" fill="none"
            strokeDasharray="188" strokeDashoffset="48" strokeLinecap="round"
            style={{ transformOrigin: "center", animation: "rspin 1s linear infinite" }} />
          <defs>
            <linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" /><stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, animation: "rfloat 2s ease-in-out infinite" }}>
          {LOADING_ICONS[idx]}
        </div>
      </div>
      <p key={idx} style={{ color: "rgba(255,255,255,0.65)", fontSize: 14, margin: "0 0 20px", animation: "rfade 0.3s ease" }}>
        {LOADING_STEPS[idx]}
      </p>
      <div style={{ width: 160, height: 3, background: "rgba(255,255,255,0.07)", borderRadius: 3, overflow: "hidden", marginBottom: 8 }}>
        <div style={{ height: "100%", borderRadius: 3, background: "linear-gradient(90deg,#38bdf8,#6366f1)", width: `${((idx + 1) / LOADING_STEPS.length) * 100}%`, transition: "width 0.5s ease" }} />
      </div>
      <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 11, letterSpacing: "0.05em" }}>{idx + 1} / {LOADING_STEPS.length}</p>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
const ResultsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const productName = searchParams.get("product") || "Unknown Product";

  const [loading,   setLoading]   = useState(true);
  const [loadStep,  setLoadStep]  = useState(0);
  const [data,      setData]      = useState(null);
  const [error,     setError]     = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [heroAnim,  setHeroAnim]  = useState(false);
  const stepRef = useRef(null);

  useEffect(() => {
    let s = 0;
    stepRef.current = setInterval(() => { s++; setLoadStep(s); }, 1700);
    (async () => {
      try {
        // const res = await axios.post("http://localhost:5000/api/analyze", { productName });
        // setData(res.data.data);
        await new Promise((r) => setTimeout(r, 10000));
        setData(MOCK);
      } catch {
        setError("Analysis failed. Please try again.");
      } finally {
        clearInterval(stepRef.current);
        setLoading(false);
      }
    })();
    return () => clearInterval(stepRef.current);
  }, [productName]);

  useEffect(() => {
    if (data && !loading) {
      setTimeout(() => setHeroAnim(true), 80);
    }
  }, [data, loading]);

  const allSources = data
    ? [...data.sentiment.sourcesUsed, ...data.competitors.sourcesUsed, ...data.launchMetrics.sourcesUsed]
    : [];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        @keyframes rspin  { to { transform: rotate(360deg); } }
        @keyframes rpulse { 0%,100%{opacity:1;box-shadow:0 0 8px #6366f1}50%{opacity:0.5;box-shadow:0 0 18px #6366f1} }
        @keyframes rfloat { 0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)} }
        @keyframes rfade  { from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)} }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .rp { font-family:'Inter',system-ui,sans-serif; min-height:100vh; background:#0a0a12; color:#fff; overflow-x:hidden; }

        /* Glows */
        .rp-glow { position:fixed; border-radius:50%; pointer-events:none; z-index:0; }
        .rp-g1 { top:-120px; right:-120px; width:480px; height:480px; background:radial-gradient(circle,rgba(99,102,241,0.14) 0%,transparent 70%); }
        .rp-g2 { bottom:-80px; left:-80px; width:400px; height:400px; background:radial-gradient(circle,rgba(139,92,246,0.1) 0%,transparent 70%); }
        .rp-g3 { top:40%; left:50%; transform:translate(-50%,-50%); width:700px; height:300px; background:radial-gradient(ellipse,rgba(56,189,248,0.05) 0%,transparent 60%); }

        .rp-wrap { position:relative; z-index:1; }

        /* Container — mobile-first */
        .rp-inner {
          width:100%;
          max-width:1280px;
          margin:0 auto;
          padding:0 16px 80px;
        }

        /* Back */
        .rp-back {
          display:inline-flex; align-items:center; gap:6px;
          background:rgba(255,255,255,0.05);
          border:1px solid rgba(255,255,255,0.1);
          border-radius:999px; padding:7px 14px;
          font-size:12px; color:rgba(255,255,255,0.5);
          cursor:pointer; font-family:inherit;
          transition:color 0.15s, border-color 0.15s;
          margin-top:14px; margin-bottom:2px;
        }
        .rp-back:hover { color:#a5b4fc; border-color:rgba(99,102,241,0.5); }

        /* ── HERO ──
           Mobile: two-row — title on top, ring on the right (flex row with wrap)
        */
        .rp-hero {
          display:flex;
          flex-direction:row;
          align-items:flex-start;
          justify-content:space-between;
          gap:16px;
          padding:20px 0 18px;
          border-bottom:1px solid rgba(255,255,255,0.07);
          margin-bottom:16px;
          flex-wrap:nowrap;
        }
        .rp-hero-left { flex:1; min-width:0; }

        /* Badge — always one line */
        .rp-badge {
          display:inline-flex; align-items:center; gap:6px;
          background:rgba(99,102,241,0.12);
          border:1px solid rgba(99,102,241,0.28);
          padding:4px 10px; border-radius:999px;
          margin-bottom:12px; white-space:nowrap;
          max-width:100%; overflow:hidden;
        }
        .rp-badge-dot {
          width:6px; height:6px; border-radius:50%;
          background:#6366f1; flex-shrink:0;
          box-shadow:0 0 8px #6366f1;
          animation:rpulse 2s ease-in-out infinite;
        }
        .rp-badge-text {
          font-size:9px; color:#a5b4fc; font-weight:700;
          letter-spacing:0.09em; text-transform:uppercase;
          white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
        }

        /* Title */
        .rp-title {
          font-size:clamp(24px, 6vw, 54px);
          font-weight:900; line-height:1.08;
          letter-spacing:-0.03em; color:#fff;
          margin-bottom:8px;
          word-break:break-word;
        }

        /* Date */
        .rp-date {
          font-size:12px; color:rgba(255,255,255,0.38);
          margin-bottom:12px; display:flex; align-items:center; gap:4px; flex-wrap:wrap;
        }
        .rp-date span { color:#818cf8; font-weight:600; }

        /* Market position — hide on very small screens to avoid clutter */
        .rp-position {
          font-size:13px; color:rgba(255,255,255,0.5);
          line-height:1.65; border-left:2px solid rgba(99,102,241,0.45);
          padding-left:12px;
        }

        /* ── STATS — 2 columns on mobile ── */
        .rp-stats {
          display:grid;
          grid-template-columns:repeat(2,1fr);
          gap:8px;
          margin-bottom:18px;
        }
        .rp-stat {
          background:rgba(255,255,255,0.035);
          border:1px solid rgba(255,255,255,0.08);
          border-radius:13px;
          padding:12px 12px 13px;
          position:relative; overflow:hidden;
        }
        .rp-stat-bar {
          position:absolute; top:0; left:0; right:0; height:3px;
          border-radius:13px 13px 0 0;
        }
        .rp-stat-label {
          font-size:9px; font-weight:700; letter-spacing:0.08em;
          text-transform:uppercase; color:rgba(255,255,255,0.3);
          margin-bottom:6px; white-space:nowrap;
        }
        .rp-stat-value {
          font-size:14px; font-weight:900; line-height:1.15;
          word-break:break-word;
        }

        /* ── TABS ── */
        .rp-tabs {
          display:flex; gap:2px;
          border-bottom:1px solid rgba(255,255,255,0.07);
          margin-bottom:18px;
          overflow-x:auto; -webkit-overflow-scrolling:touch;
          scrollbar-width:none;
        }
        .rp-tabs::-webkit-scrollbar { display:none; }
        .rp-tab {
          flex-shrink:0;
          background:transparent; border:none;
          border-bottom:2px solid transparent;
          padding:9px 16px; font-size:13px; font-weight:700;
          color:rgba(255,255,255,0.38); cursor:pointer;
          font-family:inherit; border-radius:8px 8px 0 0;
          transition:all 0.18s; margin-bottom:-1px;
          white-space:nowrap;
        }
        .rp-tab.active {
          color:#c7d2fe;
          background:rgba(99,102,241,0.1);
          border-bottom-color:#6366f1;
        }

        /* ── GRIDS ── */
        .rp-grid2, .rp-grid3 {
          display:grid; grid-template-columns:1fr; gap:12px; margin-bottom:12px;
        }

        /* Praise / complaint item */
        .rp-praise { display:flex; gap:9px; align-items:flex-start; background:rgba(34,197,94,0.07); border:1px solid rgba(34,197,94,0.18); border-radius:10px; padding:10px 13px; margin-bottom:7px; }
        .rp-complaint { display:flex; gap:9px; align-items:flex-start; background:rgba(239,68,68,0.07); border:1px solid rgba(239,68,68,0.18); border-radius:10px; padding:10px 13px; margin-bottom:7px; }
        .rp-item-text { font-size:13px; line-height:1.55; }

        /* Feature item */
        .rp-feature { display:flex; gap:12px; align-items:flex-start; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:12px 14px; margin-bottom:8px; }

        /* Competitor card */
        .rp-comp-card {
          background:rgba(255,255,255,0.035);
          border:1px solid rgba(255,255,255,0.08);
          border-radius:14px; padding:18px 16px;
          position:relative; overflow:hidden;
          transition:transform 0.2s;
        }
        .rp-comp-card:hover { transform:translateY(-2px); }

        /* Source link */
        .rp-source {
          display:flex; align-items:center; gap:10px;
          background:rgba(255,255,255,0.025);
          border:1px solid rgba(255,255,255,0.07);
          border-radius:11px; padding:11px 14px;
          text-decoration:none; margin-bottom:8px;
          transition:all 0.15s;
        }
        .rp-source:hover { border-color:rgba(99,102,241,0.5); background:rgba(99,102,241,0.07); }

        /* Competitor layout: mobile = stacked cards, desktop = table */
        .rp-comp-cards { display: block; }
        .rp-comp-table { display: none !important; }

        /* ── Tablet 600px ── */
        @media (min-width:600px) {
          .rp-inner { padding:0 24px 80px; }
          .rp-stats { gap:12px; }
          .rp-stat { padding:14px 14px 15px; }
          .rp-stat-label { font-size:10px; }
          .rp-stat-value { font-size:16px; }
          .rp-badge-text { font-size:10px; }
          .rp-grid2 { grid-template-columns:repeat(2,1fr); }
          .rp-grid3 { grid-template-columns:repeat(2,1fr); }
        }

        /* ── Desktop 960px ── */
        @media (min-width:960px) {
          .rp-comp-cards { display: none; }
          .rp-comp-table { display: block !important; }
          .rp-inner { padding:0 40px 100px; }
          .rp-stats { grid-template-columns:repeat(4,1fr); gap:14px; }
          .rp-stat { padding:16px 18px 17px; }
          .rp-stat-label { font-size:10px; }
          .rp-stat-value { font-size:18px; }
          .rp-grid3 { grid-template-columns:repeat(3,1fr); }
          .rp-hero { gap:32px; }
        }
      `}</style>

      <div className="rp">
        {/* Glows */}
        <div className="rp-glow rp-g1" />
        <div className="rp-glow rp-g2" />
        <div className="rp-glow rp-g3" />

        <div className="rp-wrap">
          <Navbar />

          {/* ── Loading ── */}
          {loading && <LoadingScreen step={loadStep} />}

          {/* ── Error ── */}
          {error && !loading && (
            <div style={{ maxWidth: 380, margin: "0 auto", padding: "60px 20px", textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 8 }}>{error}</h2>
              <button onClick={() => navigate(-1)} style={{ background: "linear-gradient(135deg,#38bdf8,#6366f1)", color: "#fff", border: "none", borderRadius: 12, padding: "11px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", marginTop: 10 }}>
                ← Go Back
              </button>
            </div>
          )}

          {/* ── Dashboard ── */}
          {data && !loading && (
            <div className="rp-inner" style={{ animation: "rfade 0.4s ease" }}>

              {/* Back */}
              <button className="rp-back" onClick={() => navigate(-1)}>← Back to search</button>

              {/* ══ HERO ══ */}
              <div className="rp-hero"
                style={{ opacity: heroAnim ? 1 : 0, transform: heroAnim ? "translateY(0)" : "translateY(16px)", transition: "opacity 0.55s ease, transform 0.55s ease" }}>

                {/* Left side */}
                <div className="rp-hero-left">
                  {/* Badge */}
                  <div className="rp-badge">
                    <span className="rp-badge-dot" />
                    <span className="rp-badge-text">Market Intelligence · Live</span>
                  </div>

                  {/* Title */}
                  <h1 className="rp-title">{fmtProduct(data.product)}</h1>

                  {/* Date */}
                  <p className="rp-date">
                    Analyzed <span>{new Date(data.analyzedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  </p>

                  {/* Market position */}
                  <p className="rp-position">{data.competitors.marketPosition}</p>
                </div>

                {/* Score ring — always visible, shrinks on mobile */}
                <div style={{
                  flexShrink: 0,
                  opacity: heroAnim ? 1 : 0,
                  transform: heroAnim ? "scale(1)" : "scale(0.85)",
                  transition: "opacity 0.65s ease 0.15s, transform 0.65s cubic-bezier(0.34,1.4,0.64,1) 0.15s",
                }}>
                  <ScoreRing score={data.sentiment.sentimentScore} animate={heroAnim} />
                </div>
              </div>

              {/* ══ QUICK STATS ══ */}
              <div className="rp-stats">
                {[
                  { label: "Launch Date",      value: data.launchMetrics.estimatedLaunchDate,               accent: "#38bdf8" },
                  { label: "Price",            value: data.launchMetrics.launchPrice,                       accent: "#a855f7" },
                  { label: "Sentiment",        value: `${data.sentiment.sentimentScore}/100`,               accent: scoreColor(data.sentiment.sentimentScore) },
                  { label: "Competitors",      value: `${data.competitors.competitorsList.length} tracked`, accent: "#f97316" },
                ].map((s, i) => (
                  <div key={i} className="rp-stat"
                    style={{
                      opacity: heroAnim ? 1 : 0,
                      transform: heroAnim ? "translateY(0)" : "translateY(12px)",
                      transition: `opacity 0.45s ease ${0.25 + i * 0.06}s, transform 0.45s ease ${0.25 + i * 0.06}s`,
                    }}>
                    <div className="rp-stat-bar" style={{ background: s.accent }} />
                    <p className="rp-stat-label">{s.label}</p>
                    <p className="rp-stat-value" style={{ color: s.accent }}>{s.value}</p>
                  </div>
                ))}
              </div>

              {/* ══ TABS ══ */}
              <div className="rp-tabs">
                {["overview", "competitors", "sources"].map((t) => (
                  <button key={t} className={`rp-tab${activeTab === t ? " active" : ""}`}
                    onClick={() => setActiveTab(t)}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>

              {/* ══ OVERVIEW ══ */}
              {activeTab === "overview" && (
                <div key="ov" style={{ animation: "rfade 0.3s ease" }}>
                  <div className="rp-grid2" style={{ marginBottom: 12 }}>

                    {/* Donut */}
                    <Card delay={0}>
                      <SLabel>Sentiment Breakdown</SLabel>
                      <DonutChart breakdown={data.sentiment.sentimentBreakdown} />
                    </Card>

                    {/* Bar chart */}
                    <Card delay={80}>
                      <SLabel>Competitor Threat Level</SLabel>
                      <AnimBarGroup competitors={data.competitors.competitorsList} />
                    </Card>
                  </div>

                  <div className="rp-grid2">
                    {/* Public opinion */}
                    <Card delay={160}>
                      <SLabel>Public Opinion</SLabel>
                      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, fontStyle: "italic", borderLeft: "2px solid rgba(99,102,241,0.4)", paddingLeft: 12, marginBottom: 16 }}>
                        "{data.sentiment.overallSummary}"
                      </p>

                      <SLabel c="#22c55e">✅ Top Praises</SLabel>
                      {data.sentiment.topPraises.map((p, i) => (
                        <div key={i} className="rp-praise">
                          <span style={{ color: "#22c55e", flexShrink: 0, marginTop: 2 }}>●</span>
                          <span className="rp-item-text" style={{ color: "rgba(255,255,255,0.75)" }}>{p}</span>
                        </div>
                      ))}

                      <div style={{ marginTop: 14 }}>
                        <SLabel c="#ef4444">⚠️ Top Complaints</SLabel>
                        {data.sentiment.topComplaints.map((c, i) => (
                          <div key={i} className="rp-complaint">
                            <span style={{ color: "#ef4444", flexShrink: 0, marginTop: 2 }}>●</span>
                            <span className="rp-item-text" style={{ color: "rgba(255,255,255,0.65)" }}>{c}</span>
                          </div>
                        ))}
                      </div>
                    </Card>

                    {/* Strategy */}
                    <Card delay={240}>
                      <SLabel>Product Strategy</SLabel>
                      <SLabel c="rgba(255,255,255,0.28)">🎯 Target Audience</SLabel>
                      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: 20 }}>
                        {data.launchMetrics.targetAudience}
                      </p>
                      <SLabel c="rgba(255,255,255,0.28)">⚡ Core Features</SLabel>
                      {data.launchMetrics.coreFeatures.map((f, i) => (
                        <div key={i} className="rp-feature">
                          <span style={{ color: "#818cf8", fontWeight: 800, fontSize: 11, flexShrink: 0, marginTop: 1 }}>
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.72)", lineHeight: 1.55 }}>{f}</span>
                        </div>
                      ))}
                    </Card>
                  </div>
                </div>
              )}

              {/* ══ COMPETITORS ══ */}
              {activeTab === "competitors" && (
                <div key="co" style={{ animation: "rfade 0.3s ease" }}>

                  {/* Animated bar chart */}
                  <Card delay={0} style={{ marginBottom: 12 }}>
                    <SLabel>Competitor Threat Level</SLabel>
                    <AnimBarGroup competitors={data.competitors.competitorsList} />
                  </Card>

                  {/* ── Mobile cards — each competitor as a full card ── */}
                  <div className="rp-comp-cards">
                    {data.competitors.competitorsList.map((c, i) => (
                      <Card key={i} delay={i * 80}
                        style={{ position: "relative", overflow: "hidden", border: `1px solid ${THREAT_COLORS[i]}28`, marginBottom: 10 }}>
                        {/* Accent top bar */}
                        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: THREAT_COLORS[i] }} />

                        {/* Row 1: name + badge */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                          <h3 style={{ fontSize: 15, fontWeight: 800, color: "#fff", margin: 0 }}>{c.name}</h3>
                          <span style={{ background: `${THREAT_COLORS[i]}22`, color: THREAT_COLORS[i], fontSize: 13, fontWeight: 800, padding: "4px 12px", borderRadius: 999, flexShrink: 0 }}>
                            {c.threatLevel}/10
                          </span>
                        </div>

                        {/* Row 2: price chip */}
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(129,140,248,0.1)", border: "1px solid rgba(129,140,248,0.2)", borderRadius: 8, padding: "4px 10px", marginBottom: 12 }}>
                          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "rgba(129,140,248,0.7)" }}>Price</span>
                          <span style={{ fontSize: 13, fontWeight: 700, color: "#818cf8" }}>{c.price}</span>
                        </div>

                        {/* Row 3: differentiator */}
                        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.65, margin: 0 }}>
                          {c.keyDifferentiator}
                        </p>

                        {/* Threat bar at bottom */}
                        <div style={{ marginTop: 14 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)" }}>Threat Level</span>
                            <span style={{ fontSize: 11, fontWeight: 800, color: THREAT_COLORS[i] }}>{c.threatLevel}/10</span>
                          </div>
                          <div style={{ height: 6, background: "rgba(255,255,255,0.07)", borderRadius: 99, overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${(c.threatLevel / 10) * 100}%`, background: THREAT_COLORS[i], borderRadius: 99, boxShadow: `0 0 8px ${THREAT_COLORS[i]}60`, transition: "width 0.9s cubic-bezier(0.34,1.1,0.64,1) 200ms" }} />
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>

                  {/* ── Desktop-only table (hidden on mobile via CSS) ── */}
                  <div className="rp-comp-table" style={{
                    background: "rgba(255,255,255,0.035)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 16,
                    padding: 0,
                    overflow: "hidden",
                  }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                          {["Competitor", "Price", "Threat", "Key Differentiator"].map((h) => (
                            <th key={h} style={{ textAlign: "left", padding: "13px 18px", fontSize: 10, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {data.competitors.competitorsList.map((c, i) => (
                          <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", transition: "background 0.15s" }}
                            onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.025)"}
                            onMouseOut={e => e.currentTarget.style.background = "transparent"}
                          >
                            <td style={{ padding: "14px 18px", fontSize: 13, fontWeight: 700, color: "#fff" }}>{c.name}</td>
                            <td style={{ padding: "14px 18px", fontSize: 13, color: "#818cf8", fontWeight: 600 }}>{c.price}</td>
                            <td style={{ padding: "14px 18px" }}>
                              <span style={{ background: `${THREAT_COLORS[i]}22`, color: THREAT_COLORS[i], fontSize: 12, fontWeight: 800, padding: "4px 12px", borderRadius: 999 }}>
                                {c.threatLevel}/10
                              </span>
                            </td>
                            <td style={{ padding: "14px 18px", fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>{c.keyDifferentiator}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                </div>
              )}

              {/* ══ SOURCES ══ */}
              {activeTab === "sources" && (
                <div key="so" style={{ animation: "rfade 0.3s ease" }}>
                  <Card delay={0}>
                    <SLabel>Sources Analyzed</SLabel>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.42)", lineHeight: 1.65, marginBottom: 18 }}>
                      Every insight is verified against real web sources. Click any link to read the original article.
                    </p>
                    {allSources.map((url, i) => (
                      <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="rp-source"
                        style={{ animationDelay: `${i * 50}ms`, animation: "rfade 0.35s ease both" }}>
                        <span style={{ fontSize: 11, fontWeight: 800, color: "#818cf8", flexShrink: 0, minWidth: 20 }}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", wordBreak: "break-all", lineHeight: 1.5, flex: 1 }}>
                          {url.replace("https://", "")}
                        </span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(99,102,241,0.55)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </a>
                    ))}
                  </Card>
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ResultsPage;