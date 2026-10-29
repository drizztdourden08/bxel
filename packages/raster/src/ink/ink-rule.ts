/* @layer core @kind logic */
import type { BufferView } from '../buffer.type';
import { ditherOn } from './dither-on';
import type { Ink, InkRule } from './ink.type';
import { patternRule } from './pattern-rule';

const shadingRule = (table: Uint8Array | null): InkRule => ({
  once: true,
  apply: (current) => {
    const moved = table?.[current] ?? current;
    return moved === current ? null : moved;
  },
});

const inkRule = (ink: Ink | undefined, table: Uint8Array | null = null, patch: BufferView | null = null): InkRule | null => {
  if (!ink || ink.kind === 'normal') return null;
  switch (ink.kind) {
    case 'behind':
      return { once: false, apply: (current, _x, _y, value) => (current === 0 ? value : null) };
    case 'lockAlpha':
      return { once: false, apply: (current, _x, _y, value) => (current === 0 ? null : value) };
    case 'onlyColour':
      return { once: false, apply: (current, _x, _y, value) => (current === ink.index ? value : null) };
    case 'dither':
      return { once: false, apply: (_current, x, y, value) => (ditherOn(ink.pattern, ink.level, x, y) ? value : ink.second) };
    case 'pattern':
      return patch ? patternRule(patch, ink) : null;
    case 'shade':
    case 'lighten':
    case 'darken':
      return shadingRule(table);
  }
};

export { inkRule };
