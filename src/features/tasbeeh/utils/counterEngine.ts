/**
 * counterEngine.ts
 * 
 * Standalone, pure logic for calculating "Physical Rotation" states.
 * This handles dividing large targets into 33/34-bead slices.
 */

export interface SetState {
  totalTarget: number;
  currentCount: number;
  
  // Set Info
  totalSets: number;
  currentSetIndex: number;
  
  // Progress within the current set
  beadsInCurrentSet: number;
  completedBeadsInSet: number;
  setProgress: number; // 0 to 100 for this set
  
  // Overall Progress (0 to 100)
  overallProgress: number;
  
  // Status
  isLastSet: boolean;
  isCompleted: boolean;
}

const DEFAULT_MAX_BEADS = 33;

/**
 * Calculates the sliced bead state for a given count and target.
 * 
 * Logic:
 * 1. If target <= 33, we have 1 set with size = target.
 * 2. If target > 33, we divide into sets of 33.
 * 3. The last set takes the remainder, potentially slightly larger (up to 34 or 2x default)
 *    to avoid tiny 1-bead sets at the end.
 */
export const calculateSetState = (count: number, target: number): SetState => {
  const safeTarget = Math.max(target, 1);
  const safeCount = Math.min(count, safeTarget);
  
  let setSize = DEFAULT_MAX_BEADS;
  let totalSets = 1;
  let currentSetIndex = 0;
  let beadsInCurrentSet = 0;
  let completedBeadsInSet = 0;
  let setProgress = 0;

  if (safeTarget <= DEFAULT_MAX_BEADS) {
    // Single Set Mode
    totalSets = 1;
    currentSetIndex = 0;
    beadsInCurrentSet = safeTarget;
    completedBeadsInSet = safeCount;
    setProgress = (completedBeadsInSet / beadsInCurrentSet) * 100;
  } else {
    // Multi-Rotation Mode
    // Example: 100 target. 
    // We want roughly 33 per set.
    // 100 / 33 = 3.03 -> 3 sets.
    totalSets = Math.floor(safeTarget / DEFAULT_MAX_BEADS);
    const remainder = safeTarget % DEFAULT_MAX_BEADS;

    // Determine bead count for this specific segment
    // If it's the last set, it gets the remainder (e.g. 33, 33, 34)
    // We use (safeCount - 1) to keep the "full set" state until the count actually increments beyond it
    currentSetIndex = safeCount === 0 ? 0 : Math.floor((safeCount - 1) / DEFAULT_MAX_BEADS);
    
    // Cap at the last set index
    if (currentSetIndex >= totalSets) {
      currentSetIndex = totalSets - 1;
    }

    const startOfSet = currentSetIndex * DEFAULT_MAX_BEADS;
    const isLast = currentSetIndex === totalSets - 1;
    
    beadsInCurrentSet = isLast 
      ? (safeTarget - startOfSet) 
      : DEFAULT_MAX_BEADS;
      
    completedBeadsInSet = safeCount === 0 ? 0 : safeCount - startOfSet;
    setProgress = (completedBeadsInSet / beadsInCurrentSet) * 100;
  }

  return {
    totalTarget: safeTarget,
    currentCount: safeCount,
    totalSets,
    currentSetIndex,
    beadsInCurrentSet,
    completedBeadsInSet,
    setProgress,
    overallProgress: (safeCount / safeTarget) * 100,
    isLastSet: currentSetIndex === totalSets - 1,
    isCompleted: safeCount >= safeTarget,
  };
};
