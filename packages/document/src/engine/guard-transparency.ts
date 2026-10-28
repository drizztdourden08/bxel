/* @layer core @kind logic */
import type { Draft } from '../draft/draft.type';
import type { CelId } from '../model/ids.type';
import { requireSprite } from '../read/require-sprite';
import type { ResolvedCel } from '../scope/resolved-scope.type';

/** Commands that paint, so a transparency lock holds them to the pixels that are already painted. */
const PAINTING_COMMANDS: ReadonlySet<string> = new Set([
  'pixels.patch',
  'pixels.paint',
  'pixels.erase',
  'pixels.fill',
  'pixels.shape',
  'pixels.replace',
  'pixels.shade',
  'pixels.gradient',
  'pixels.stamp',
  'pixels.clear',
]);

type Held = { readonly cel: ResolvedCel; readonly before: Uint8Array | null };

const isLocked = (draft: Draft, cel: ResolvedCel): boolean =>
  requireSprite(draft.artwork, cel.spriteId).layers.find((layer) => layer.id === cel.layerId)?.lockTransparency === true;

const celNow = (draft: Draft, cel: ResolvedCel): CelId | undefined =>
  requireSprite(draft.artwork, cel.spriteId).layers.find((layer) => layer.id === cel.layerId)?.cels[cel.frameId];

const hold = (draft: Draft, cel: ResolvedCel): Held => {
  const pixels = cel.celId ? requireSprite(draft.artwork, cel.spriteId).cels[cel.celId]?.pixels : undefined;
  return { cel, before: pixels ? pixels.slice() : null };
};

const restore = (draft: Draft, { cel, before }: Held): void => {
  const celId = celNow(draft, cel);
  const pixels = celId === undefined ? undefined : draft.owned.get(celId);
  if (!pixels) return;
  if (!before) {
    pixels.fill(0);
    return;
  }
  for (let at = 0; at < pixels.length; at += 1) {
    const kept = before[at] ?? 0;
    if (kept === 0) pixels[at] = 0;
    else if (pixels[at] === 0) pixels[at] = kept;
  }
};

/**
 * A layer with a transparency lock never gains or loses a painted pixel: transparent pixels stay
 * transparent and painted pixels stay painted, whatever a painting command wrote.
 * Returns the function that puts that back after the command ran, or null when no lock applies.
 */
const guardTransparency = (draft: Draft, name: string, cels: readonly ResolvedCel[]): (() => void) | null => {
  if (!PAINTING_COMMANDS.has(name)) return null;
  const held = cels.filter((cel) => isLocked(draft, cel)).map((cel) => hold(draft, cel));
  if (held.length === 0) return null;
  return () => {
    for (const each of held) restore(draft, each);
  };
};

export { guardTransparency };
