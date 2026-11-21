export const SESSION_GAP_MS = 30 * 60_000;
// A session continues while the visitor's last activity (event, impression or session start) is under 30 minutes old.
export const reuseSession = (lastActivityMs: number | null, nowMs: number): boolean =>
  lastActivityMs != null && nowMs - lastActivityMs <= SESSION_GAP_MS;
