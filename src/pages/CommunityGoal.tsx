import { motion } from "framer-motion";
import { NavHeader } from "@/shared/components/NavHeader/NavHeader";
import { Users, TrendingUp, Award } from "lucide-react";

export default function CommunityGoal() {
  // Mock data for the 1 Billion Salavat Challenge
  const globalTaps = 124508920;
  const target = 1000000000;
  const progressPercent = (globalTaps / target) * 100;
  const individualContribution = 1245;

  return (
    <div className="page-container">
      <NavHeader title="Community Goal" />
      
      <motion.main 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="screen-pad"
      >
        <div style={{ textAlign: "center", marginBottom: "32px", marginTop: "16px" }}>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            1 BILLION SALAVAT CHALLENGE
          </p>
        </div>

        {/* Global Progress Card */}
        <div className="squircle-card" style={{ marginBottom: "20px", border: "2px solid var(--accent-subtle)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <div style={{ padding: "10px", background: "var(--accent-subtle)", borderRadius: "12px", color: "var(--accent)" }}>
              <Users size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: "18px", fontWeight: 800 }}>Global Journey</h3>
              <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Connecting hearts across the Ummah</p>
            </div>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "14px", fontWeight: 700 }}>{globalTaps.toLocaleString()} taps</span>
              <span style={{ fontSize: "14px", fontWeight: 800, color: "var(--accent)" }}>{progressPercent.toFixed(1)}%</span>
            </div>
            <div style={{ width: "100%", height: "12px", background: "var(--border)", borderRadius: "6px", overflow: "hidden" }}>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                style={{ height: "100%", background: "var(--accent)" }}
              />
            </div>
          </div>
          <p style={{ fontSize: "11px", color: "var(--text-muted)", textAlign: "center" }}>
            Target: 1,000,000,000 Salavat for the Prophet ﷺ
          </p>
        </div>

        {/* Stats Row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <div className="squircle-card">
            <TrendingUp size={20} style={{ color: "#b1bc5a", marginBottom: "8px" }} />
            <div style={{ fontSize: "20px", fontWeight: 800 }}>{individualContribution.toLocaleString()}</div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 700 }}>Your Part</div>
          </div>
          <div className="squircle-card">
            <Award size={20} style={{ color: "#d3b47e", marginBottom: "8px" }} />
            <div style={{ fontSize: "20px", fontWeight: 800 }}>#4,120</div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 700 }}>Your Rank</div>
          </div>
        </div>

        <p style={{ marginTop: "32px", fontSize: "13px", color: "var(--text-muted)", textAlign: "center", lineHeight: 1.6 }}>
          Every tap you make on the home screen contributes to this global challenge. Let’s reach the target together!
        </p>
      </motion.main>
    </div>
  );
}
