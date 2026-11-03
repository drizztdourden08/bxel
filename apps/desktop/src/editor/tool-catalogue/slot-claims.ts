/* @layer renderer-app @kind logic */
import type { SurfaceLayout } from './slot-layout.type';

const slotClaims = (layout: SurfaceLayout): Map<string, string> => {
  const claims = new Map<string, string>();
  for (const place of layout) {
    for (const id of place.members ?? []) if (!claims.has(id)) claims.set(id, place.id);
  }
  return claims;
};

export { slotClaims };
