export function getTodayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}
