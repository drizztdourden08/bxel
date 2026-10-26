/* @layer renderer-app @kind logic */
import { swatchFields } from '@bxel/document';
import type { Rgb } from '@bxel/document';
import type { SwatchSet } from '@bxel/project';
import { setKey } from './set-key';
import type { LibrarySet, SetOrigin } from './swatch-library.type';

const librarySet = (origin: SetOrigin, set: SwatchSet): LibrarySet => ({
  key: setKey(origin, set.setId),
  origin,
  name: set.name,
  colors: set.colors.map((color) => ({ ...swatchFields(color.rgb as Rgb, color.alpha), name: color.name })),
  setId: set.setId,
});

export { librarySet };
