/* @layer core @kind logic */
import type { CelId, ResolvedCel } from '@bxel/document';

const uniqueCels = (cels: readonly ResolvedCel[]): ResolvedCel[] => {
  const seen = new Set<CelId>();
  return cels.filter((cel) => {
    if (!cel.celId) {
      return true;
    }
    const fresh = !seen.has(cel.celId);
    seen.add(cel.celId);
    return fresh;
  });
};

export { uniqueCels };
