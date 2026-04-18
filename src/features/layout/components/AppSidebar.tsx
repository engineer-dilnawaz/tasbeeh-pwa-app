import React, { useState } from "react";
import {
  Settings,
  Heart,
  Share2,
  MessageSquare,
  House,
  ChartColumnBig,
  BookOpen,
  Sparkles,
  Flame,
  Medal,
  Moon,
} from "lucide-react";
import { motion } from "framer-motion";
import { SideDrawer } from "@/shared/design-system/ui/SideDrawer";
import { ShareDrawer } from "@/features/layout/components/ShareDrawer";
import { useNavigate } from "react-router-dom";
import { Squircle } from "@/shared/design-system/ui/Squircle";
import { useTasbeehStore } from "@/features/tasbeeh/store/tasbeehStore";

interface AppSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 🧭 AppSidebar Content
 *
 * A rich, dashboard-style sidebar for high-fidelity navigation.
 */
export const AppSidebar: React.FC<AppSidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const streakDays = useTasbeehStore((state) => state.streakDays);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const handleNav = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <SideDrawer isOpen={isOpen} onClose={onClose} title="Tasbeeh Flow">
      <div className="flex flex-col gap-8 mt-4">
        {/* 1. Profile / Streak Header */}
        <Squircle cornerRadius={24} cornerSmoothing={0.99} asChild>
          <div className="bg-primary/5 p-5 flex flex-col gap-4 border border-primary/10">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <Medal size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-primary uppercase tracking-[0.1em]">
                  Current Rank
                </span>
                <span className="text-lg font-black text-base-content tracking-tight leading-none">
                  Diligence
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between bg-base-100/50 p-3 rounded-xl border border-primary/5">
              <div className="flex items-center gap-2">
                <Flame
                  size={16}
                  className="text-orange-500"
                  fill="currentColor"
                />
                <span className="text-sm font-bold">
                  {streakDays} Day Streak
                </span>
              </div>
              <Sparkles size={14} className="text-primary animate-pulse" />
            </div>
          </div>
        </Squircle>

        {/* 2. Primary Navigation */}
        <div className="flex flex-col gap-1.5">
          <SidebarLink
            icon={<House size={20} />}
            label="Home Dashboard"
            onClick={() => handleNav("/home")}
            active
          />
          <SidebarLink
            icon={<BookOpen size={20} />}
            label="My Collections"
            onClick={() => handleNav("/collections")}
          />
          <SidebarLink
            icon={<ChartColumnBig size={20} />}
            label="Growth & Stats"
            onClick={() => handleNav("/stats")}
          />
        </div>

        {/* 3. Spiritual Content */}
        <div className="flex flex-col gap-1.5">
          <h3 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-base-content/30 mb-1">
            Wisdom
          </h3>
          <SidebarLink
            icon={<Moon size={20} />}
            label="99 Names"
            onClick={() => handleNav("/names")}
          />
          <SidebarLink
            icon={<Sparkles size={20} />}
            label="Daily Insight"
            onClick={() => handleNav("/home")}
          />
        </div>

        {/* 4. Support & Settings */}
        <div className="flex flex-col gap-1.5 pb-8">
          <h3 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-base-content/30 mb-1">
            More
          </h3>
          <SidebarLink
            icon={<Settings size={20} />}
            label="Settings"
            onClick={() => handleNav("/settings")}
          />
          <SidebarLink
            icon={<MessageSquare size={20} />}
            label="App Feedback"
            onClick={() => handleNav("/settings/feedback")}
          />

          <div className="mt-4 px-2">
            <Squircle cornerRadius={20} cornerSmoothing={0.99} asChild>
              <button
                onClick={() => setIsShareOpen(true)}
                className="w-full flex items-center justify-between px-5 py-4 bg-neutral-900 text-white shadow-xl shadow-black/20 transition-all active:scale-[0.98]"
              >
                <div className="flex items-center gap-3 text-white">
                  <Share2 size={18} />
                  <span className="font-bold tracking-tight">
                    Share the Barakah
                  </span>
                </div>

                <motion.div
                  animate={{ scale: [1, 1.25, 1] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Heart
                    size={16}
                    fill="currentColor"
                    className="text-red-500 opacity-90"
                  />
                </motion.div>
              </button>
            </Squircle>
          </div>
        </div>
      </div>
      <ShareDrawer
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        zIndexBase={200}
      />
    </SideDrawer>
  );
};

interface SidebarLinkProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({
  icon,
  label,
  onClick,
  active,
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all active:scale-[0.98] ${
      active
        ? "bg-primary/10 text-primary font-bold shadow-sm"
        : "text-base-content/60 hover:bg-base-200 hover:text-base-content"
    }`}
  >
    <div className={active ? "text-primary" : "text-base-content/40"}>
      {icon}
    </div>
    <span className="tracking-tight">{label}</span>
  </button>
);
