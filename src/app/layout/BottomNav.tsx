import { BarChart2, Home, Plus, Settings, Library } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { CornerSquircle } from "@/shared/components/CornerSquircle";
import { useRemoteConfig } from "@/shared/hooks/useRemoteConfig";
import styles from "./BottomNav.module.css";

const ICON_SIZE = 24;
const DOCK_SMOOTHING = 1;
const FAB_CORNER_RADIUS = 30;
/** Per side: outer halo 6px (total +12) so the squircle curve reads on base-300 */
const FAB_HALO_PX = 6;
const FAB_OUTER_SIZE = 60 + FAB_HALO_PX * 2;
const FAB_BACKPLATE_RADIUS = Math.round(
  (FAB_CORNER_RADIUS * FAB_OUTER_SIZE) / 60,
);

function tabSpring(prefersReduced: boolean | null) {
  if (prefersReduced) {
    return { type: "tween" as const, duration: 0.16, ease: "easeOut" as const };
  }
  return {
    type: "spring" as const,
    stiffness: 480,
    damping: 34,
    mass: 0.48,
  };
}

type TabProps = {
  to: string;
  end?: boolean;
  icon: typeof Home;
  label: string;
  transition: ReturnType<typeof tabSpring>;
};

function BottomNavTab({ to, end, icon: Icon, label, transition }: TabProps) {
  return (
    <NavLink to={to} end={end} className={styles.link}>
      {({ isActive }) => (
        <>
          {isActive ? (
            <motion.div
              layoutId="bottomNavCornerPill"
              className={styles.pillMotion}
              transition={transition}
            >
              <div className={styles.pillFill} />
            </motion.div>
          ) : null}
          <div className={styles.linkContent}>
            <motion.div
              className={`${styles.glyph} ${isActive ? "text-primary" : "text-base-content/45"}`}
              animate={{
                y: isActive ? -2 : 0,
                scale: isActive ? 1.1 : 1,
              }}
              transition={transition}
            >
              <Icon
                size={ICON_SIZE}
                strokeWidth={isActive ? 2.5 : 2}
                aria-hidden
              />
            </motion.div>
            <motion.span
              className={`${styles.label} ${isActive ? "text-primary" : "text-base-content/45"}`}
              animate={{
                opacity: isActive ? 1 : 0.48,
                scale: isActive ? 1 : 0.88,
              }}
              transition={transition}
            >
              {label}
            </motion.span>
          </div>
        </>
      )}
    </NavLink>
  );
}

export function BottomNav() {
  const { t } = useRemoteConfig();
  const location = useLocation();
  const prefersReduced = useReducedMotion();
  const transition = tabSpring(prefersReduced);
  const isAddActive = location.pathname === "/add";

  return (
    <div className={styles.shell}>
      <div className={styles.island}>
        <NavLink to="/add" className={styles.fab} aria-label={t("nav.add")}>
          <CornerSquircle
            cornerRadius={FAB_BACKPLATE_RADIUS}
            cornerSmoothing={DOCK_SMOOTHING}
            aria-hidden
            className={styles.fabBackplate}
          >
            {/* decorative backplate only; gradient + icon is .fabSquircle */}
            <span className="sr-only" />
          </CornerSquircle>
          <motion.div
            className={styles.fabMotion}
            animate={
              isAddActive
                ? { scale: 1.08, y: -2 }
                : { scale: 1, y: 0 }
            }
            transition={transition}
            whileHover={
              prefersReduced ? undefined : { y: -4, transition: { duration: 0.18 } }
            }
            whileTap={{ scale: 0.88, y: 3 }}
          >
            <CornerSquircle
              cornerRadius={FAB_CORNER_RADIUS}
              cornerSmoothing={DOCK_SMOOTHING}
              className={styles.fabSquircle}
            >
              <Plus size={30} strokeWidth={2.75} aria-hidden />
            </CornerSquircle>
          </motion.div>
        </NavLink>

        {/* Rounded card like settings `.theme-btn`, not full-width squircle capsule */}
        <div className={styles.dock}>
          <div className={styles.row}>
            <BottomNavTab
              to="/home"
              end
              icon={Home}
              label={t("nav.home")}
              transition={transition}
            />
            <BottomNavTab
              to="/collections"
              icon={Library}
              label="Collections"
              transition={transition}
            />
            <div className={styles.spacer} aria-hidden />
            <BottomNavTab
              to="/stats"
              icon={BarChart2}
              label={t("nav.stats")}
              transition={transition}
            />
            <BottomNavTab
              to="/settings"
              icon={Settings}
              label={t("nav.settings")}
              transition={transition}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
