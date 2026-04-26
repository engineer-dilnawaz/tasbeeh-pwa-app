import React from "react";
import { Squircle } from "corner-smoothing";
import { Text } from "./Text";

interface HeaderProps {
  left?: React.ReactNode;
  right?: React.ReactNode;
  title?: string | React.ReactNode;
  className?: string;
}

/**
 * Standard Application Header.
 * Uses @squircle-js/react for smooth bottom corners.
 */
export const Header: React.FC<HeaderProps> = ({
  left,
  right,
  title,
  className = "",
}) => {
  return (
    <div className="relative z-50">
      {/* 
          Using a Squircle container with a negative top offset 
          to achieve smooth corners ONLY on the bottom.
      */}
      <div className="overflow-hidden h-14 w-full"> 
         <div className="-mt-4"> {/* Hide top corners */}
            <Squircle
              cornerRadius={24}
              cornerSmoothing={0.8}
              className={`flex h-[72px] w-full items-center justify-between px-4 bg-base-100 pt-4 relative ${className}`}
            >
              {/* Solid base layer + Overlay to match inputs/buttons */}
              <div className="absolute inset-0 bg-base-100" />
              <div className="absolute inset-0 bg-base-content/5" />
              
              <div className="relative z-10 flex h-14 w-full items-center justify-between">
                {/* Left Slot */}
                <div className="flex w-1/4 items-center justify-start gap-2">
                  {left}
                </div>

                {/* Center Slot */}
                <div className="flex flex-1 items-center justify-center overflow-hidden px-2">
                  {typeof title === "string" ? (
                    <Text variant="heading" weight="semibold" className="truncate">
                      {title}
                    </Text>
                  ) : (
                    title
                  )}
                </div>

                {/* Right Slot */}
                <div className="flex w-1/4 items-center justify-end gap-3">
                  {right}
                </div>
              </div>
            </Squircle>
         </div>
      </div>
    </div>
  );
};
