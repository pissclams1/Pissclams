const P = {
  x: "M18 6l-12 12 M6 6l12 12",
  heart: "M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572",
  bookmark: "M18 7v14l-6 -4l-6 4v-14a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4z",
  share: "M12 4v12 M8 8l4 -4l4 4 M5 14v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-4",
};
export function Icon({ name, filled }: { name: keyof typeof P; filled?: boolean }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true" style={filled ? { fill: "currentColor" } : undefined}><path d={P[name]} /></svg>;
}
