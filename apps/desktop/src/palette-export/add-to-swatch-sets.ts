/* @layer renderer-app @kind logic */
import { parseSwatchColor } from '@bxel/document';
import { toast } from '@drizztdourden08/brock-react';
import type { PaletteTarget } from '../editor/editor.type';
import type { SourceColor } from '../palette-source/palette-source.type';
import { makeSwatchSet } from '../swatch-library/make-swatch-set';
import { randomBytes } from '../swatch-library/random-bytes';
import type { UserSets } from '../swatch-library/swatch-library.type';
import { PALETTE_EXPORT_TEXT } from './palette-export.constants';
import { paletteFileOf } from './palette-file-of';

const sourceColors = (target: PaletteTarget, indices: readonly number[] | null): SourceColor[] =>
  paletteFileOf(target.bank, indices).colors.flatMap((color) => {
    const parsed = parseSwatchColor(color.hex);
    return parsed ? [{ rgb: parsed.rgb, alpha: parsed.alpha, name: color.name }] : [];
  });

const addToSwatchSets = (target: PaletteTarget, indices: readonly number[] | null, sets: UserSets): void => {
  const made = makeSwatchSet(target.bank.name, sourceColors(target, indices), sets.sets.map((each) => each.name), randomBytes);
  const saved = sets.save(made);
  toast(saved.ok ? PALETTE_EXPORT_TEXT.addedSet(made.name) : saved.message, { variant: saved.ok ? 'success' : 'danger' });
};

export { addToSwatchSets };
