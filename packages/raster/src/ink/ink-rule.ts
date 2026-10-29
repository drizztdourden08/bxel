/* @layer core @kind logic */
import type { BufferView } from '../buffer.type';
import { ditherOn } from './dither-on';
import { SHADING_KINDS } from './ink.constants';
import type { PlacementInk } from './ink-rule.type';
import type { Ink, InkRule } from './ink.type';
import { patternRule } from './pattern-rule';

const shadingRule = (table: Uint8Array | null): InkRule => ({
  once: true,
  apply: (current) => {
    const moved = table?.[current] ?? current;
    return moved === current ? null : moved;
  },
});

const isPlacement = (ink: Ink): ink is PlacementInk => ink.kind === 'behind' || ink.kind === 'lockAlpha' || ink.kind === 'onlyColour';

const placementRule = (ink: PlacementInk): InkRule => {
  switch (ink.kind) {
    case 'behind':
      return { once: false, apply: (current, _x, _y, value) => (current === 0 ? value : null) };
    case 'lockAlpha':
      return { once: false, apply: (current, _x, _y, value) => (current === 0 ? null : value) };
    case 'onlyColour':
      return { once: false, apply: (current, _x, _y, value) => (current === ink.index ? value : null) };
  }
};

const ditherRule = (ink: Extract<Ink, { kind: 'dither' }>): InkRule => ({
  once: false,
  apply: (_current, x, y, value) => (ditherOn(ink.pattern, ink.level, x, y) ? value : ink.second),
});

const inkRule = (ink: Ink | undefined, table: Uint8Array | null = null, patch: BufferView | null = null): InkRule | null => {
  if (!ink || ink.kind === 'normal') return null;
  if (ink.kind === 'dither') return ditherRule(ink);
  if (ink.kind === 'pattern') return patch ? patternRule(patch, ink) : null;
  if (isPlacement(ink)) return placementRule(ink);
  return SHADING_KINDS.has(ink.kind) ? shadingRule(table) : null;
};

export { inkRule };
