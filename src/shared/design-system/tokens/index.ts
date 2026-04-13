/**
 * Divine Design System 2.0 — Foundation Tokens
 * Focused on Oklch for premium color fidelity.
 */
export const TOKENS = {
  colors: {
    // Primary palette
    primary: "oklch(58.6% 0.2 260)", // Divine Indigo
    accent: "oklch(65.6% 0.19 155)",  // Zikr Green
    
    // Semantic levels
    content: {
      base: "text-base-content",
      muted: "text-base-content/85",
      subtle: "text-base-content/60",
    },
    
    status: {
      success: "oklch(70% 0.15 150)",
      error: "oklch(60% 0.2 25)",
      warn: "oklch(80% 0.15 85)",
    }
  },
  
  shadows: {
    soft: "var(--shadow-soft)",
    ambient: "var(--shadow-ambient)",
  },
  
  radius: {
    squircle: "var(--radius-squircle)",
    smooth: "var(--radius-smooth)",
    full: "var(--radius-button)",
  },
  
  motion: {
    spring: {
      type: "spring",
      stiffness: 300,
      damping: 25,
      mass: 1,
    },
    gentle: {
      type: "spring",
      stiffness: 150,
      damping: 20,
    },
    entry: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
} as const;
