/* @layer core @kind config */
const CENTER_SHARE = { x: 0.5, y: 0.5 } as const;

const ANCHOR_SHARE: Readonly<Record<string, { readonly x: number; readonly y: number }>> = {
  'top-left': { x: 0, y: 0 },
  top: { x: 0.5, y: 0 },
  'top-right': { x: 1, y: 0 },
  left: { x: 0, y: 0.5 },
  center: CENTER_SHARE,
  right: { x: 1, y: 0.5 },
  'bottom-left': { x: 0, y: 1 },
  bottom: { x: 0.5, y: 1 },
  'bottom-right': { x: 1, y: 1 },
};

const SPRITE_CLIPPED = 'SPRITE_CLIPPED';

export { ANCHOR_SHARE, CENTER_SHARE, SPRITE_CLIPPED };
