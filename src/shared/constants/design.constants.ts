import { hp, wp } from "../utils/responsiveness";

/**
 * Design System Constants
 * 
 * Centralized design tokens based on a global 4-point grid system.
 * Scaled automatically to the device layout dimension constraints.
 */

export const DESIGN = {
  SPACING: {
    VERTICAL: {
      space4: hp(4),
      space8: hp(8),
      space12: hp(12),
      space16: hp(16),
      space20: hp(20),
      space24: hp(24),
      space28: hp(28),
      space32: hp(32),
      space40: hp(40),
      space48: hp(48),
      space56: hp(56),
      space64: hp(64),
      space80: hp(80),
      space96: hp(96),
    },
    HORIZONTAL: {
      space4: wp(4),
      space8: wp(8),
      space12: wp(12),
      space16: wp(16),
      space20: wp(20),
      space24: wp(24),
      space28: wp(28),
      space32: wp(32),
      space40: wp(40),
      space48: wp(48),
      space56: wp(56),
      space64: wp(64),
      space80: wp(80),
      space96: wp(96),
    },
  },
} as const;

export type DesignConstants = typeof DESIGN;
