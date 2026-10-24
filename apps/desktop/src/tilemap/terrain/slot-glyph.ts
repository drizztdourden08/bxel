/* @layer renderer-app @kind logic */
import { GLYPH_ORDER } from './terrain.constants';

const slotGlyph = (mask: number): boolean[] => GLYPH_ORDER.map((bit) => bit === 0 || (mask & bit) !== 0);

export { slotGlyph };
