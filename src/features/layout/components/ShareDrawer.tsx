import React, { useState } from "react";
import {
  WhatsappShare,
  TelegramShare,
  TwitterShare,
  FacebookShare,
} from "react-share-kit";
import { SocialIcon } from "react-social-icons";
import { Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Squircle } from "corner-smoothing";
import { Drawer } from "@/shared/design-system/ui/Drawer";
import { toast } from "@/shared/design-system/ui/useToast";

interface ShareDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  zIndexBase?: number;
}

const brandColors: Record<string, string> = {
  whatsapp: "#25D366",
  telegram: "#0088cc",
  twitter: "#1DA1F2",
  facebook: "#1877F2",
};

/**
 * 🌍 ShareDrawer
 *
 * High-fidelity share sheet with squircle icons and quick-copy functionality.
 */
export const ShareDrawer: React.FC<ShareDrawerProps> = ({
  isOpen,
  onClose,
  zIndexBase,
}) => {
  const shareUrl = "https://tasbeeh-flow.web.app";
  const title = "Join me in Zikr with Tasbeeh Flow! 📿✨";
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setIsCopied(true);
    toast("Barakah link copied!", {
      description: "Successfully added to your clipboard.",
      variant: "success",
      duration: 3000,
    });
    setTimeout(() => setIsCopied(false), 2400);
  };

  const items = [
    { component: WhatsappShare, network: "whatsapp" },
    { component: TelegramShare, network: "telegram" },
    { component: TwitterShare, network: "twitter" },
    { component: FacebookShare, network: "facebook" },
  ];

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      zIndexBase={zIndexBase}
      title="Share the Barakah"
    >
      <div className="flex flex-col gap-6 pt-2 pb-10">
        {/* Call to Action Description */}
        <div className="text-center">
          <p className="text-[14px] leading-relaxed text-base-content/50 font-medium max-w-[280px] mx-auto">
            Invite your friends and family to join this zikr journey. Every
            remembrance shared is a gift of Barakah.
          </p>
        </div>

        {/* Link Copy Header */}
        <div className="px-4">
          <div className="flex items-center justify-between p-3.5 bg-base-200/50 rounded-2xl border border-base-content/5">
            <div className="flex flex-col gap-0.5 min-w-0 pr-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                Live Link
              </span>
              <span className="text-sm font-medium text-base-content/60 truncate italic">
                {shareUrl}
              </span>
            </div>
            <button
              onClick={handleCopy}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-base-300 text-base-content/60 transition-all active:scale-90"
            >
              <AnimatePresence mode="wait">
                {isCopied ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    className="text-success"
                  >
                    <Check size={18} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="copy"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                  >
                    <Copy size={18} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Social Squircles */}
        <div className="grid grid-cols-4 gap-4 px-4 max-w-[400px] mx-auto w-full">
          {items.map((item) => (
            <div key={item.network} className="flex flex-col items-center mt-6">
              <Squircle
                cornerRadius={20}
                cornerSmoothing={0.9}
                className="h-[64px] w-[64px] flex items-center justify-center  border-base-content/5 "
                style={{ backgroundColor: brandColors[item.network] }}
              >
                <item.component url={shareUrl} title={title}>
                  <div className="group transition-transform active:scale-95">
                    <SocialIcon
                      network={item.network}
                      style={{ height: 64, width: 64 }}
                      bgColor={brandColors[item.network]}
                      fgColor="#fff"
                      borderRadius="40"
                    />
                  </div>
                </item.component>
              </Squircle>
            </div>
          ))}
        </div>
      </div>
    </Drawer>
  );
};
