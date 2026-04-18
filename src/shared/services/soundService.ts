import { useSettingsStore } from "@/features/settings/store/settingsStore";

/**
 * 🔊 Library-Free Sound Service
 * 
 * Uses the native Web Audio API to provide high-performance, 
 * low-latency audio without external dependencies.
 */

// Singleton audio objects to prevent memory leaks and lag
let clickAudio: HTMLAudioElement | null = null;
let isUnlocked = false;

export const soundService = {
  /**
   * Preloads the sound assets.
   */
  init() {
    if (typeof window === "undefined" || clickAudio) return;
    
    clickAudio = new Audio("/assets/sounds/count-tap.mp3");
    clickAudio.load();
  },

  /**
   * Plays the zikr tap sound.
   */
  playBead() {
    const { beadSoundEnabled } = useSettingsStore.getState().interaction;
    
    if (!beadSoundEnabled || !clickAudio) return;

    // Reset to start for rapid taps
    // We only reset if it was already playing or finished
    if (clickAudio.paused) {
      clickAudio.currentTime = 0;
    } else {
      // If still playing, we "snap" it back to start
      clickAudio.currentTime = 0;
    }

    clickAudio.play().then(() => {
      isUnlocked = true;
    }).catch(err => {
      // This is often just the browser blocking the very first tap
      console.log("[SoundService] Initial tap unlock needed");
    });
  }
};

// Initialize as soon as this module loads
if (typeof window !== "undefined") {
  soundService.init();
}
