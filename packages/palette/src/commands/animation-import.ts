/* @layer core @kind logic */
import { animationCreate, defineCommand, ERROR_CODE, fail, ownedBlank, updateAnimation } from '@bxel/document';
import { animationImportSchema } from './animation-import-schema';
import { mapImportImage } from './map-import-image';
import { PALETTE_COMMAND_NAME } from './palette-command-name.constants';
import { resolveImportBank } from './resolve-import-bank';
import { writeImportCel } from './write-import-cel';

const animationImport = defineCommand({
  name: PALETTE_COMMAND_NAME.animationImport,
  scope: 'none',
  schema: animationImportSchema,
  run: (draft, input) => {
    const { name, width, height, anchor, mapping, frames } = input.options;
    const bank = resolveImportBank(draft, input.options.bank);
    const source = { kind: 'blank', width, height, frames: frames.length, bankId: bank.id };
    animationCreate.run(draft, { ...input, options: { name, source, ...(anchor ? { anchor } : {}) }, sprites: [], cels: [] });
    const created = draft.artwork.animations.at(-1);
    if (!created) throw fail(ERROR_CODE.TARGET_NOT_FOUND, 'The imported animation was not created.');
    const sprites = frames.map((frame) => {
      const sprite = ownedBlank(draft, created.name, { width, height }, bank.id);
      const pixels = mapImportImage({ width, height, rgba: frame.rgba }, bank, mapping);
      if (pixels.some((value) => value !== 0)) writeImportCel(draft, sprite, pixels);
      return sprite;
    });
    updateAnimation(draft, created.id, (current) => ({
      ...current,
      frames: current.frames.map((item, index) => ({
        ...item,
        spriteId: sprites[index]?.id ?? null,
        durationMs: frames[index]?.durationMs ?? item.durationMs,
      })),
    }));
  },
});

export { animationImport };
