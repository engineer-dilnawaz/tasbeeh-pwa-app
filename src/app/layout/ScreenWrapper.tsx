import React from "react";

interface ScreenWrapperProps {
  children: React.ReactNode;
}

/**
 * Ensures the application is centered and constrained to a mobile-width
 * viewport on larger screens. Uses standard DaisyUI base colors.
 */
export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-neutral flex justify-center overflow-x-hidden">
      <div className="w-full max-w-[480px] min-h-screen bg-base-100 relative">
        {children}
      </div>
    </div>
  );
};
