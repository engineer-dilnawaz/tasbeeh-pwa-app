import { User } from "lucide-react";
import { useAuth } from "@/services/auth/useAuth";
import { SquircleSheet } from "@/shared/components/SquircleSheet";
import { SmoothSquircle } from "@/shared/components/ui/SmoothSquircle";
import { useResolvedPalette } from "@/shared/components/ui/palette";
import { UiButton } from "@/shared/components/ui/UiButton";

interface LogoutSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LogoutSheet({ isOpen, onClose }: LogoutSheetProps) {
  const palette = useResolvedPalette();
  const { user, signOut } = useAuth();
  const isGuest = user?.isAnonymous;

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  const title = isGuest ? "Delete guest data?" : "Sign out?";

  return (
    <SquircleSheet isOpen={isOpen} onClose={onClose} title={title}>
      <SmoothSquircle
        cornerRadius={18}
        cornerSmoothing={1}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: 16,
          marginBottom: 20,
          background: palette.surface,
          border: `1px solid ${palette.border}`,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: 54,
            height: 54,
            borderRadius: 16,
            background: palette.surfaceRaised,
            border: `1px solid ${palette.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: palette.textPrimary,
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <User size={24} />
          )}
        </div>
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontFamily: "var(--font-primary)",
              fontSize: 17,
              fontWeight: 800,
              color: palette.textPrimary,
              letterSpacing: "-0.01em",
            }}
          >
            {user?.displayName || (isGuest ? "Guest" : "Account")}
          </div>
          {user?.email ? (
            <div
              style={{
                fontSize: 13,
                color: palette.textMuted,
                fontWeight: 600,
                marginTop: 2,
              }}
            >
              {user.email}
            </div>
          ) : null}
        </div>
      </SmoothSquircle>

      <p
        style={{
          fontSize: 14,
          color: palette.textMuted,
          lineHeight: 1.6,
          margin: "0 0 24px",
          textAlign: "center",
          fontWeight: 600,
        }}
      >
        {isGuest
          ? "Signing out will permanently delete your progress and preferences unless you link your account."
          : "Your progress stays saved on your account. Sign in again anytime."}
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <UiButton
          label={isGuest ? "Delete & sign out" : "Sign out"}
          variant="danger"
          fullWidth
          onClick={() => void handleSignOut()}
        />
        <UiButton label="Cancel" variant="secondary" fullWidth onClick={onClose} />
      </div>
    </SquircleSheet>
  );
}
