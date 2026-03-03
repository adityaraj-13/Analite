import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const SUGGESTIONS = [
  "Sony WH-1000XM5",
  "Nike Air Max 270",
  "Dyson V15",
  "Apple AirPods Pro",
  "Kindle Paperwhite",
  "LEGO Technic",
];

const PLACEHOLDERS = [
  "Enter any product name...",
  "Try: iPhone 15 Pro...",
  "Try: Samsung Galaxy S24...",
  "Try: DJI Mini 4 Pro...",
  "Try: Vitamix 5200...",
];

const FEATURES = [
  { icon: "📊", title: "Market Analysis", desc: "Sizing, trends & growth opportunities" },
  { icon: "🎯", title: "Competitor Mapping", desc: "Rivals, strengths & gaps to exploit" },
  { icon: "💬", title: "Sentiment Insights", desc: "Customer perception across channels" },
  { icon: "🚀", title: "Launch Strategy", desc: "Research-backed go-to-market plan" },
];



const Dashboard = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [placeholderVisible, setPlaceholderVisible] = useState(true);

  const canSubmit = product.trim().length > 0;

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderVisible(false);
      setTimeout(() => {
        setPlaceholderIdx(i => (i + 1) % PLACEHOLDERS.length);
        setPlaceholderVisible(true);
      }, 300);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = () => {
    if (!canSubmit) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1400);
  };

  return (
    <div style={{ fontFamily: "'Inter',system-ui,sans-serif", minHeight: "100vh", background: "#0a0a12", color: "#fff", overflowX: "hidden" }}>

      {/* Ambient glows */}
      <div style={{ position: "fixed", top: -120, right: -120, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(99,102,241,0.13) 0%,transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: -80, left: -80, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(139,92,246,0.1) 0%,transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", top: "40%", left: "50%", transform: "translate(-50%,-50%)", width: 800, height: 400, borderRadius: "50%", background: "radial-gradient(ellipse,rgba(56,189,248,0.04) 0%,transparent 60%)", pointerEvents: "none" }} />

      <Navbar />

      {submitted ? (
        /* SUCCESS STATE */
        <div style={{ maxWidth: 560, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto 24px", boxShadow: "0 0 48px rgba(99,102,241,0.5)" }}>✓</div>
          <h2 style={{ fontSize: 26, fontWeight: 900, margin: "0 0 10px", letterSpacing: "-0.02em" }}>Research Launched!</h2>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 15, lineHeight: 1.7, maxWidth: 380, margin: "0 auto 10px" }}>
            <strong style={{ color: "#a5b4fc" }}>{product}</strong> · Full Intelligence Report
          </p>
          <div style={{ display: "inline-block", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: 10, padding: "10px 20px", margin: "16px 0 32px" }}>
            <span style={{ fontSize: 13, color: "#a5b4fc", fontWeight: 600 }}>⚡ Insights ready in ~2 minutes</span>
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => { setSubmitted(false); setProduct(""); }} style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", border: "none", padding: "12px 26px", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>New Research</button>
            <button onClick={() => navigate("/")} style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.65)", border: "1px solid rgba(255,255,255,0.1)", padding: "12px 26px", borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Back to Home</button>
          </div>
        </div>

      ) : (
        <>
          {/* HERO SECTION */}
          <div style={{ textAlign: "center", padding: "72px 24px 0", maxWidth: 700, margin: "0 auto" }}>

            {/* Badge */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.3)", padding: "6px 16px", borderRadius: 999, marginBottom: 32 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#6366f1", display: "inline-block", boxShadow: "0 0 8px #6366f1", animation: "pulse 2s ease-in-out infinite" }} />
              <span style={{ fontSize: 11, color: "#a5b4fc", fontWeight: 700, letterSpacing: "0.1em" }}>AI-POWERED · REAL-TIME INSIGHTS</span>
            </div>

            {/* Headline */}
            <h1 style={{ fontSize: "clamp(36px, 7vw, 64px)", fontWeight: 900, lineHeight: 1.1, margin: "0 0 20px", letterSpacing: "-0.03em" }}>
              Know everything<br />
              about any{" "}
              <span style={{ background: "linear-gradient(135deg, #38bdf8, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", fontStyle: "italic" }}>product</span>
              <br />
              <span style={{ fontStyle: "italic", color: "rgba(255,255,255,0.7)", fontWeight: 700 }}>in seconds.</span>
            </h1>

            {/* Subtitle */}
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, maxWidth: 480, margin: "0 auto 44px" }}>
              Type a product name. Get a complete intelligence dashboard —<br />
              specs, pricing, sentiment, performance metrics, and more.<br />
           
            </p>

            {/* SEARCH INPUT */}
            <div style={{ position: "relative", marginBottom: 20, maxWidth: 560, margin: "0 auto 20px" }}>
              <div style={{
                display: "flex", alignItems: "center",
                background: "rgba(255,255,255,0.05)",
                border: "1.5px solid rgba(255,255,255,0.12)",
                borderRadius: 16,
                padding: "6px 6px 6px 20px",
                transition: "all 0.2s",
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginRight: 12 }}>
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>

                <input
                  type="text"
                  value={product}
                  onChange={e => setProduct(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSubmit()}
                  placeholder={PLACEHOLDERS[placeholderIdx]}
                  style={{
                    flex: 1, background: "transparent", border: "none", outline: "none",
                    fontSize: 16, color: "#fff", fontFamily: "inherit",
                    caretColor: "#6366f1",
                    opacity: placeholderVisible ? 1 : 0.3,
                    transition: "opacity 0.3s",
                  }}
                  onFocus={e => {
                    e.target.parentElement.style.borderColor = "#6366f1";
                    e.target.parentElement.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.15), 0 0 40px rgba(99,102,241,0.1)";
                  }}
                  onBlur={e => {
                    e.target.parentElement.style.borderColor = "rgba(255,255,255,0.12)";
                    e.target.parentElement.style.boxShadow = "none";
                  }}
                />

                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit || loading}
                  style={{
                    flexShrink: 0,
                    background: canSubmit ? "linear-gradient(135deg,#38bdf8,#6366f1)" : "rgba(255,255,255,0.06)",
                    color: canSubmit ? "#fff" : "rgba(255,255,255,0.2)",
                    border: "none", borderRadius: 12,
                    padding: "12px 22px", fontSize: 14, fontWeight: 800,
                    cursor: canSubmit && !loading ? "pointer" : "not-allowed",
                    letterSpacing: "0.04em",
                    boxShadow: canSubmit ? "0 0 24px rgba(99,102,241,0.4)" : "none",
                    transition: "all 0.2s",
                    display: "flex", alignItems: "center", gap: 8,
                    whiteSpace: "nowrap",
                  }}
                >
                  {loading
                    ? <span style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
                    : "ANALYZE →"
                  }
                </button>
              </div>
            </div>

            {/* SUGGESTION CHIPS */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 80 }}>
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setProduct(s)}
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.6)",
                    borderRadius: 999, padding: "7px 16px", fontSize: 13,
                    cursor: "pointer", fontFamily: "inherit",
                    transition: "all 0.15s", fontWeight: 500,
                  }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.5)"; e.currentTarget.style.color = "#a5b4fc"; e.currentTarget.style.background = "rgba(99,102,241,0.08)"; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* CONTENT SECTIONS */}
          <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 24px 100px" }}>

            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 44 }}>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", fontWeight: 700, letterSpacing: "0.1em", whiteSpace: "nowrap" }}>WHAT YOU'LL GET</span>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 48 }}>
              {FEATURES.map((f, i) => (
                <div key={i}
                  style={{ background: "rgba(255,255,255,0.03)", border: "1.5px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "22px 20px", transition: "all 0.2s", cursor: "default" }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.35)"; e.currentTarget.style.background = "rgba(99,102,241,0.06)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <div style={{ fontSize: 26, marginBottom: 12 }}>{f.icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 6 }}>{f.title}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", lineHeight: 1.6 }}>{f.desc}</div>
                </div>
              ))}
            </div>

        
          </div>
        </>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:1; box-shadow:0 0 8px #6366f1; } 50% { opacity:0.6; box-shadow:0 0 16px #6366f1; } }
        input::placeholder { color: rgba(255,255,255,0.28); }
      `}</style>
    </div>
  );
};

export default Dashboard;