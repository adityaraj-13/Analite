import { useNavigate, useLocation } from "react-router-dom";
import Logo from "./Logo";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";

  return (
    <nav style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "18px 32px", backdropFilter: "blur(12px)",
      background: "rgba(15,15,26,0.9)",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      position: "sticky", top: 0, zIndex: 100
    }}>
      <div onClick={() => navigate("/")}>
        <Logo light />
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        {isDashboard ? (
          <span
            onClick={() => navigate("/")}
            style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", cursor: "pointer", fontWeight: 500 }}
          >
            ← Back to Home
          </span>
        ) : (
          <>
          
            <button
              onClick={() => navigate("/dashboard")}
              style={{
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                color: "#fff", border: "none", padding: "9px 22px",
                borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer",
                boxShadow: "0 0 20px rgba(99,102,241,0.4)"
              }}
            >
              Get Started
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;