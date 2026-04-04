/** Pick content by calendar day (stable index into daily lists). */
export function getDayRotationIndex(length: number): number {
  const dayOfYear = Math.floor(
    (Number(new Date()) - Number(new Date(new Date().getFullYear(), 0, 0))) / 86400000,
  );
  return dayOfYear % length;
}
