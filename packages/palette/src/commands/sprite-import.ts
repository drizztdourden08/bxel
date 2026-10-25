/* @layer core @kind logic */
import { defineCommand, ERROR_CODE, fail, spriteCreate } from '@bxel/document';
import { addImportFrames } from './add-import-frames';
import { mapImportImage } from './map-import-image';
import { PALETTE_COMMAND_NAME } from './palette-command-name.constants';
import { resolveImportBank } from './resolve-import-bank';
import { spriteImportSchema } from './sprite-import-schema';
import { writeImportCel } from './write-import-cel';

const spriteImport = defineCommand({
  name: PALETTE_COMMAND_NAME.spriteImport,
  scope: 'none',
  schema: spriteImportSchema,
  run: (draft, input) => {
    const { name, image, pivot, mapping } = input.options;
    const bank = resolveImportBank(draft, input.options.bank);
    const { width, height } = image;
    spriteCreate.run(draft, { ...input, options: { name, width, height, bankId: bank.id, pivot }, sprites: [], cels: [] });
    const sprite = draft.artwork.sprites.at(-1);
    if (!sprite) throw fail(ERROR_CODE.TARGET_NOT_FOUND, 'The imported sprite was not created.');
    writeImportCel(draft, sprite, mapImportImage(image, bank, mapping));
    addImportFrames(draft, sprite.id, bank, input.options);
  },
});

export { spriteImport };
