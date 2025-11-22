export function getPaginationParams(page?: string, limit?: string) {
  const p = Math.max(1, Number(page || 1));
  const l = Math.max(1, Math.min(100, Number(limit || 10)));
  const skip = (p - 1) * l;
  return { page: p, limit: l, skip };
}
