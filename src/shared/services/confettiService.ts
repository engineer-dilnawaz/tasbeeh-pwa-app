import confetti from "canvas-confetti";

/**
 * 🎉 Centralized Confetti Service
 *
 * Provides various celebration patterns using canvas-confetti.
 * Optimized for performance by using the Canvas API.
 *
 * Presets:
 * - cannon(): Single centered burst
 * - fireworks(): Continuous random explosions
 * - schoolPride(): Side-to-side bursts
 * - divine(): Subtle, elegant gold/white particles (Default for Tasbeeh)
 */

export const confettiService = {
  /**
   * 🔫 Basic Cannon: A quick, festive burst from the center or a specific origin.
   */
  cannon(options?: confetti.Options) {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#6366f1", "#a855f7", "#ec4899"], // Default brand colors
      ...options,
    });
  },

  /**
   * 🎆 Fireworks: Randomized explosions across the screen.
   */
  fireworks(durationMs = 3000) {
    const animationEnd = Date.now() + durationMs;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / durationMs);
      // since particles fall down, start a bit higher than random
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  },

  /**
   * 🎓 School Pride: Two side cannons firing towards the center.
   */
  sideCannons(durationMs = 2000) {
    const end = Date.now() + durationMs;
    const colors = ["#6366f1", "#ffffff"];

    (function frame() {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  },

  /**
   * ✨ Divine Burst: Premium, spiritual aesthetic (Gold, White, Primary).
   * Best for zikr completions.
   */
  divine() {
    const scalar = 2;
    const gold = confetti.shapeFromText({ text: "✨", scalar });
    const moon = confetti.shapeFromText({ text: "🌙", scalar });

    const defaults = {
      spread: 360,
      ticks: 100,
      gravity: 0.8,
      decay: 0.94,
      startVelocity: 30,
      particleCount: 40,
      shapes: [gold, moon, "circle"] as confetti.Shape[],
      colors: ["#FFD700", "#FFFFFF", "#6366f1"], // Gold, White, Indido
    };

    confetti({ ...defaults, origin: { x: 0.5, y: 0.5 } });
  },

  /**
   * 🌨️ Snow / Gentle Rain
   */
  snow() {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    let skew = 1;

    (function frame() {
      const timeLeft = animationEnd - Date.now();
      const ticks = Math.max(200, 500 * (timeLeft / duration));
      skew = Math.max(0.8, skew - 0.001);

      confetti({
        particleCount: 1,
        startVelocity: 0,
        ticks: ticks,
        origin: {
          x: Math.random(),
          // since particles fall down, start a bit higher than random
          y: Math.random() * skew - 0.2,
        },
        colors: ["#ffffff"],
        shapes: ["circle"],
        gravity: randomInRange(0.4, 0.6),
        scalar: randomInRange(0.4, 1),
        drift: randomInRange(-0.4, 0.4),
      });

      if (timeLeft > 0) {
        requestAnimationFrame(frame);
      }
    })();

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }
  },
};
