import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export function DevLabButton() {
  const navigate = useNavigate();
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={() => navigate("/design-lab")}
      style={{
        position: "fixed",
        bottom: "90px",
        right: "16px",
        zIndex: 9999,
        width: "44px",
        height: "44px",
        borderRadius: "14px",
        background: "rgba(124, 108, 240, 0.9)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.15)",
        color: "#fff",
        fontSize: "18px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        boxShadow: "0 4px 20px rgba(124,108,240,0.4)",
      }}
      title="Design Lab"
    >
      🧪
    </motion.button>
  );
}
