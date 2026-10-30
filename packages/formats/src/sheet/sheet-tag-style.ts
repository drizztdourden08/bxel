/* @layer core @kind logic */
import type { SheetTagStyle } from './sheet-tag-style.type';

const sheetTagStyle = (tag: SheetTagStyle): SheetTagStyle => ({
  direction: tag.direction,
  repeat: tag.repeat,
  ...(tag.colour === undefined ? {} : { colour: tag.colour }),
  ...(tag.facing === undefined ? {} : { facing: tag.facing }),
});

export { sheetTagStyle };
