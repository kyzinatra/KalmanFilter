export function getNow() {
  return ((performance.now() / 10) | 0) / 100;
}
