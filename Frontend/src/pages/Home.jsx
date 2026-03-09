import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const features = [
  { icon: "🧠", title: "Intelligent Insights", desc: "Analyze trends, competitors, and market gaps automatically." },
  { icon: "📈", title: "Competitive Intelligence", desc: "Track competitor movements and industry shifts in real time." },
  { icon: "🎯", title: "Audience Profiling", desc: "Understand your customers and how to reach them." },
  { icon: "⚡", title: "Instant Reports", desc: "Decision-ready reports generated in under 60 seconds." },
  { icon: "🔒", title: "Enterprise Security", desc: "Bank-grade encryption. Your research stays confidential." },
  { icon: "🌐", title: "Global Coverage", desc: "Market data from 50+ countries and 200+ industry verticals." },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "'Inter',system-ui,sans-serif", minHeight: "100vh", background: "#0f0f1a", color: "#fff", overflowX: "hidden" }}>

      {/* Ambient blobs */}
      <div style={{ position: "fixed", top: -120, left: -120, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(99,102,241,0.18) 0%,transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(139,92,246,0.15) 0%,transparent 70%)", pointerEvents: "none" }} />

      <Navbar />

      {/* Hero */}
      <section style={{ textAlign: "center", padding: "100px 24px 80px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.3)", padding: "6px 16px", borderRadius: 999, marginBottom: 28 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#6366f1", display: "inline-block", boxShadow: "0 0 8px #6366f1" }} />
          <span style={{ fontSize: 12, color: "#a5b4fc", fontWeight: 600, letterSpacing: "0.08em" }}>AI-POWERED MARKET RESEARCH</span>
        </div>

        <h1 style={{ fontSize: "clamp(36px,6vw,72px)", fontWeight: 900, lineHeight: 1.1, margin: "0 auto 24px", maxWidth: 700, letterSpacing: "-0.03em" }}>
          Research Smarter.<br />
          <span style={{ background: "linear-gradient(90deg,#6366f1,#a78bfa,#c4b5fd)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Decide Faster.
          </span>
        </h1>

        <p style={{ fontSize: 18, color: "rgba(255,255,255,0.5)", maxWidth: 520, margin: "0 auto 40px", lineHeight: 1.75 }}>
          Analite transforms the way companies conduct market research — delivering deep competitive intelligence in minutes, not weeks.
        </p>

        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => navigate("/dashboard")}
            style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", border: "none", padding: "15px 36px", borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: "pointer", boxShadow: "0 0 40px rgba(99,102,241,0.45)" }}
          >
            Start Your Research →
          </button>
          <button style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.8)", border: "1px solid rgba(255,255,255,0.1)", padding: "15px 30px", borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: "pointer" }}>
            See How It Works
          </button>
        </div>

        <p style={{ marginTop: 16, fontSize: 12, color: "rgba(255,255,255,0.25)" }}>Trusted by 2,000+ research teams worldwide</p>
      </section>

      

      {/* Features */}
      <section style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px 100px" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <p style={{ fontSize: 12, color: "#6366f1", fontWeight: 700, letterSpacing: "0.1em", marginBottom: 10 }}>CAPABILITIES</p>
          <h2 style={{ fontSize: "clamp(24px,4vw,40px)", fontWeight: 900, margin: 0, letterSpacing: "-0.02em" }}>Everything You Need to Stay Ahead</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 2 }}>
          {features.map((f, i) => (
            <div key={i}
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", padding: "32px 28px", transition: "background 0.2s",
                borderRadius: i === 0 ? "16px 0 0 0" : i === 2 ? "0 16px 0 0" : i === 3 ? "0 0 0 16px" : i === 5 ? "0 0 16px 0" : 0 }}
              onMouseOver={e => e.currentTarget.style.background = "rgba(99,102,241,0.08)"}
              onMouseOut={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
            >
              <div style={{ fontSize: 32, marginBottom: 14 }}>{f.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* About CTA */}
      <section style={{ margin: "0 24px 80px", background: "linear-gradient(135deg,rgba(99,102,241,0.15),rgba(139,92,246,0.1))", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 24, padding: "64px 32px", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(22px,4vw,38px)", fontWeight: 900, margin: "0 0 16px", letterSpacing: "-0.02em" }}>Built for the Modern Research Team</h2>
        <p style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", maxWidth: 560, margin: "0 auto 32px", lineHeight: 1.75 }}>
          Analite was founded on the belief that great decisions require great data. We combine intelligent processing with human-centered design so your team can focus on strategy — not spreadsheets.
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", border: "none", padding: "14px 32px", borderRadius: 12, fontSize: 15, fontWeight: 800, cursor: "pointer", boxShadow: "0 0 30px rgba(99,102,241,0.35)" }}
        >
          Start Free Research →
        </button>
      </section>

      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "24px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div style={{ fontWeight: 900, fontSize: 18, color: "#fff" }}>Ana<span style={{ color: "#6366f1" }}>lite</span></div>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>© {new Date().getFullYear()} Analite. All rights reserved.</span>
      </footer>
    </div>
  );
};

export default Home;