/* @layer renderer-app @kind logic */
import { swatchFields } from '@bxel/document';
import type { Rgb } from '@bxel/document';
import { createSwatchSetId, MAX_SET_COLORS, MAX_SET_NAME } from '@bxel/project';
import type { ByteProvider, SwatchSet } from '@bxel/project';
import type { SourceColor } from '../palette-source/palette-source.type';
import { uniqueName } from '../sprite-name/unique-name';
import { NEW_SET_NAME } from './swatch-library.constants';

const baseName = (name: string): string => {
  const trimmed = name.trim().slice(0, MAX_SET_NAME);
  return trimmed === '' ? NEW_SET_NAME : trimmed;
};

const makeSwatchSet = (name: string, colors: readonly SourceColor[], taken: readonly string[], bytes: ByteProvider): SwatchSet => ({
  setId: createSwatchSetId(bytes),
  name: uniqueName(baseName(name), taken).slice(0, MAX_SET_NAME),
  colors: colors.slice(0, MAX_SET_COLORS).map((color) => ({ ...swatchFields(color.rgb as Rgb, color.alpha), name: color.name })),
});

export { makeSwatchSet };
