/** Local calendar date as `YYYY-MM-DD` (not UTC). */
export function localYmd(): string {
  return new Date().toLocaleDateString("en-CA");
}

export function yesterdayYmd(fromYmd: string): string {
  const d = new Date(`${fromYmd}T12:00:00`);
  d.setDate(d.getDate() - 1);
  return d.toLocaleDateString("en-CA");
}
