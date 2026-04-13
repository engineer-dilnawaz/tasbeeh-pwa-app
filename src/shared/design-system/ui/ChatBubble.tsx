import { motion } from "framer-motion";
import React, { useRef, useState } from "react";
import {
  Check,
  CheckCheck,
  Clock,
  AlertCircle,
  Copy,
  RefreshCw,
  Share,
  Flag,
  Trash2,
  Plus,
  Target,
} from "lucide-react";
import { Avatar } from "./Avatar";
import { Text } from "./Text";
import { Drawer } from "./Drawer";

export interface SuggestedTasbeeh {
  arabic: string;
  translation: string;
  transliteration?: string;
  targetCount: number;
}

export interface ChatBubbleProps {
  id?: string;
  message: string;
  /** True if the current logged-in user sent the message (renders on the right) */
  isUser?: boolean;
  /** Subtext below the bubble */
  time?: string;
  /** Optional avatar URL for received messages */
  avatar?: string;
  /** Message delivery status */
  status?: "sending" | "sent" | "delivered" | "read" | "error";
  /** If true, adjusts the border-radius to connect with previous messages in a sequence */
  isConsecutive?: boolean;
  /** Add a typing indicator instead of text */
  isTyping?: boolean;
  /** Name of the AI Bot for fallback avatars, defaults to "Noor" */
  botName?: string;
  /** Pass this object if the AI recommends a specific Tasbeeh inside the flow */
  suggestedTasbeeh?: SuggestedTasbeeh;
  /** Callback triggered when the user taps 'Add' on an AI Tasbeeh suggestion */
  onAddTasbeeh?: (tasbeeh: SuggestedTasbeeh) => void;
  /** Callback triggered when the user taps the copy action on an AI response */
  onCopy?: (message: string) => void;
  /** Callback triggered when the user taps regenerate on an AI response */
  onRegenerate?: () => void;
}

/**
 * ChatBubble: Premium messaging primitive.
 * Features automated squircle border-radius adjustments based on sender and sequence,
 * integrated Framer Motion layout animations, and dark-mode compatible contrast handling.
 */
export const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  isUser = false,
  time,
  avatar,
  status,
  isConsecutive = false,
  isTyping = false,
  botName = "Noor",
  suggestedTasbeeh,
  onAddTasbeeh,
  onCopy,
  onRegenerate,
}) => {
  const [internalCopied, setInternalCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handlePointerDown = () => {
    timerRef.current = setTimeout(() => {
      setShowMenu(true);
      if (typeof window !== "undefined" && navigator.vibrate) {
        navigator.vibrate(50); // Haptic feedback on long press!
      }
    }, 400); // 400ms delay for long-press
  };

  const handlePointerUp = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handleCopy = () => {
    if (onCopy) onCopy(message);
    setInternalCopied(true);
    setTimeout(() => {
      setInternalCopied(false);
      setShowMenu(false);
    }, 1500);
  };

  // Squircle shaping logic to mimic native chat apps (iMessage/WhatsApp)
  const roundedClass = isUser
    ? isConsecutive
      ? "rounded-l-[20px] rounded-r-[8px]" // Connected on the right
      : "rounded-l-[20px] rounded-tr-[20px] rounded-br-[4px]" // Base on right
    : isConsecutive
      ? "rounded-r-[20px] rounded-l-[8px]" // Connected on the left
      : "rounded-r-[20px] rounded-tl-[20px] rounded-bl-[4px]"; // Base on left

  const bgColor = isUser
    ? "bg-primary text-primary-content"
    : "bg-base-200/80 dark:bg-base-300 text-base-content";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"} ${
        isConsecutive ? "mb-1" : "mb-3"
      }`}
    >
      {/* ── Avatar Section (Only for AI/Received messages) ── */}
      {!isUser && (
        <div className="flex items-end mr-3 shrink-0">
          {!isConsecutive || isTyping ? (
            <Avatar
              src={avatar}
              size="sm"
              name={avatar ? undefined : botName}
            />
          ) : (
            // Spacer to keep messages perfectly aligned if one has an avatar
            <div className="w-8" />
          )}
        </div>
      )}

      {/* ── Bubble Section ── */}
      {/* AI Messages max-width expanded to 85% to accommodate denser paragraphs/markdown width requirements */}
      <div
        className={`flex flex-col ${isUser ? "items-end" : "items-start"} ${isUser ? "max-w-[75%]" : "max-w-[85%]"} relative`}
      >
        <div
          className={`relative px-3 pt-2 pb-1.5 shadow-sm min-w-[70px] ${roundedClass} ${bgColor} select-none transition-transform ${showMenu && !isTyping ? "scale-[0.98] drop-shadow-md z-10" : ""}`}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onContextMenu={(e) => {
            e.preventDefault();
            setShowMenu(true);
          }}
        >
          {isTyping ? (
            <div className="flex items-center gap-1.5 h-6 px-1">
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                className={`w-1.5 h-1.5 rounded-full ${isUser ? "bg-primary-content/60" : "bg-base-content/40"}`}
              />
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                className={`w-1.5 h-1.5 rounded-full ${isUser ? "bg-primary-content/60" : "bg-base-content/40"}`}
              />
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                className={`w-1.5 h-1.5 rounded-full ${isUser ? "bg-primary-content/60" : "bg-base-content/40"}`}
              />
            </div>
          ) : (
            <div className="w-full relative">
              <span
                className={`leading-[1.5] text-[15px] align-top whitespace-pre-wrap break-words ${
                  isUser ? "text-white" : ""
                }`}
              >
                {message}
              </span>

              {/* ── Metadata Hook (Time & Read Receipts) inside bubble ── */}
              {(time || status) && !suggestedTasbeeh && (
                <span
                  className={`float-right inline-flex items-center gap-1 pl-4 pt-1.5 translate-y-[2px] ${isUser ? "text-white/60" : "opacity-45"}`}
                >
                  {time && (
                    <span className="text-[10px] font-medium leading-none">
                      {time}
                    </span>
                  )}

                  {/* Icon Read Receipts */}
                  {isUser && status && (
                    <span className="flex items-center justify-center ml-0.5">
                      {status === "sending" && (
                        <Clock className="w-3 h-3 opacity-70" />
                      )}
                      {status === "sent" && (
                        <Check className="w-[14px] h-[14px] opacity-70" />
                      )}
                      {status === "delivered" && (
                        <CheckCheck className="w-[14px] h-[14px] opacity-70" />
                      )}
                      {status === "read" && (
                        <CheckCheck className="w-[14px] h-[14px] text-[#38bdf8] opacity-100" />
                      )}
                      {status === "error" && (
                        <AlertCircle className="w-3 h-3 text-error" />
                      )}
                    </span>
                  )}
                </span>
              )}
            </div>
          )}

          {/* ── AI Suggested Tasbeeh Embedded Card ── */}
          {suggestedTasbeeh && (
            <div className="mt-3 mb-1 p-3.5 rounded-2xl border border-base-content/10 bg-base-100 shadow-sm flex flex-col gap-2">
              <div className="flex flex-col">
                <Text 
                  variant="display-arabic" 
                  className="text-right text-[26px] text-primary leading-relaxed pb-2 pt-1 font-medium" 
                  dir="rtl"
                >
                  {suggestedTasbeeh.arabic}
                </Text>
                {suggestedTasbeeh.transliteration && (
                  <Text
                    variant="caption"
                    className="text-[11px] italic opacity-70 mb-1"
                  >
                    {suggestedTasbeeh.transliteration}
                  </Text>
                )}
                <Text variant="body" className="text-[13px] leading-snug">
                  {suggestedTasbeeh.translation}
                </Text>
              </div>

              <div className="flex items-center justify-between mt-1 pt-3 border-t border-base-content/5">
                <div className="flex items-center gap-1.5 opacity-60">
                  <Target className="w-3.5 h-3.5" />
                  <Text variant="caption" className="text-[11px] font-semibold">
                    Target: {suggestedTasbeeh.targetCount}
                  </Text>
                </div>
                <button
                  onClick={() => onAddTasbeeh?.(suggestedTasbeeh)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl text-xs font-bold transition-all active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" /> Add List
                </button>
              </div>
            </div>
          )}

          {/* Edge case: Push time below tasbeeh card if card exists */}
          {(time || status) && suggestedTasbeeh && (
            <div
              className={`flex items-center justify-end gap-1 mt-1 opacity-45`}
            >
              <span className="text-[10px] font-medium leading-none">
                {time}
              </span>
            </div>
          )}
        </div>

        {/* ── Context Menu (Muted iOS-style Drawer) ── */}
        {typeof document !== "undefined" && (
          <Drawer
            isOpen={showMenu}
            onClose={() => setShowMenu(false)}
            snapPoints={["auto"]}
            title={isUser ? "Message Options" : `${botName} Actions`}
          >
            <div className="flex flex-col gap-2 pt-2 pb-6">
              <button
                onClick={handleCopy}
                className="flex items-center gap-3 p-4 bg-base-200/50 hover:bg-base-200 active:bg-base-300 rounded-2xl transition-colors text-left text-[15px] font-medium"
              >
                {internalCopied ? (
                  <Check className="w-5 h-5 text-success" />
                ) : (
                  <Copy className="w-5 h-5 opacity-60" />
                )}
                <span className={internalCopied ? "text-success" : ""}>
                  {internalCopied ? "Copied" : "Copy Message"}
                </span>
              </button>

              {!isUser && onRegenerate && (
                <button
                  onClick={() => {
                    onRegenerate();
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-3 p-4 bg-base-200/50 hover:bg-base-200 active:bg-base-300 rounded-2xl transition-colors text-left text-[15px] font-medium"
                >
                  <RefreshCw className="w-5 h-5 opacity-60" /> Retry Response
                </button>
              )}

              <button
                onClick={() => setShowMenu(false)}
                className="flex items-center gap-3 p-4 bg-base-200/50 hover:bg-base-200 active:bg-base-300 rounded-2xl transition-colors text-left text-[15px] font-medium"
              >
                <Share className="w-5 h-5 opacity-60" /> Share
              </button>

              {isUser ? (
                <button
                  onClick={() => setShowMenu(false)}
                  className="flex items-center gap-3 p-4 bg-error/10 hover:bg-error/20 active:bg-error/30 rounded-2xl transition-colors text-left text-[15px] font-medium text-error"
                >
                  <Trash2 className="w-5 h-5" /> Delete
                </button>
              ) : (
                <button
                  onClick={() => setShowMenu(false)}
                  className="flex items-center gap-3 p-4 bg-base-200/50 hover:bg-base-200 active:bg-base-300 rounded-2xl transition-colors text-left text-[15px] font-medium text-base-content/70"
                >
                  <Flag className="w-5 h-5" /> Report Issue
                </button>
              )}
            </div>
          </Drawer>
        )}
      </div>
    </motion.div>
  );
};
