import React from "react";
import { motion } from "framer-motion";
import styles from "./Switch.module.css";

interface SwitchProps {
  isOn: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export const Switch: React.FC<SwitchProps> = ({ isOn, onToggle, disabled }) => {
  return (
    <button
      type="button"
      className={`${styles.switch} ${isOn ? styles.switchActive : ""} ${disabled ? styles.disabled : ""}`}
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) onToggle();
      }}
      disabled={disabled}
      aria-checked={isOn}
      role="switch"
    >
      <motion.div
        className={styles.switchHandle}
        animate={{ x: isOn ? 20 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
};
