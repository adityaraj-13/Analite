const Logo = ({ light = false }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
    <div style={{
      width: 34, height: 34, borderRadius: 10,
      background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: "0 2px 8px rgba(99,102,241,0.4)"
    }}>
      <span style={{ color: "#fff", fontWeight: 900, fontSize: 16 }}>A</span>
    </div>
    <span style={{
      fontWeight: 900, fontSize: 20, letterSpacing: "-0.04em",
      color: light ? "#fff" : "#0f172a"
    }}>
      Ana<span style={{ color: "#6366f1" }}>lite</span>
    </span>
  </div>
);

export default Logo;