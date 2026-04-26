/**
 * A centralized logging utility for the Tasbeeh app.
 * Automatically suppresses logs in production mode to keep the console clean.
 */
class Logger {
  private isDev = import.meta.env.DEV;

  /**
   * Log info for general debugging.
   */
  info(message: string, ...args: any[]) {
    if (this.isDev) {
      console.info(`[INFO] ${message}`, ...args);
    }
  }

  /**
   * Log warnings for non-critical issues.
   */
  warn(message: string, ...args: any[]) {
    if (this.isDev) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  }

  /**
   * Log errors for critical failures.
   */
  error(message: string, ...args: any[]) {
    if (this.isDev) {
      console.error(`[ERROR] ${message}`, ...args);
    }
  }

  /**
   * Log debug info for granular details.
   */
  debug(message: string, ...args: any[]) {
    if (this.isDev) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  }
}

export const logger = new Logger();
