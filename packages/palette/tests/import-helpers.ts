/* @layer tests @kind helper */
import type { BankId, CommandStep, Sprite, TransactionResult } from '@bxel/document';
import type { RgbaImage } from '@bxel/palette';
import { execute, step } from './palette-engine';
import type { Rig } from './palette-engine';

type ImportMappingInput = {
  readonly dither?: 'none' | 'bayer2' | 'bayer4' | 'bayer8';
  readonly originX?: number;
  readonly originY?: number;
  readonly alphaThreshold?: number;
};

type ImportBankInput = { readonly bankId: string } | { readonly ref: string };

const importOptions = (
  name: string,
  image: RgbaImage,
  bank: ImportBankInput,
  mapping?: ImportMappingInput,
): object => ({
  name,
  image: { width: image.width, height: image.height, rgba: Uint8Array.from(image.data) },
  bank,
  ...(mapping ? { mapping } : {}),
});

const importStep = (options: object, ref?: string): CommandStep => ({ ...step('sprite.import', options), ...(ref ? { ref } : {}) });

const spriteNamed = (rig: Rig, name: string): Sprite => {
  const sprite = rig.engine.state().project.sprites.find((candidate) => candidate.name === name);
  if (!sprite) throw new Error(`sprite ${name} is missing`);
  return sprite;
};

const firstCelPixels = (sprite: Sprite): Uint8Array => {
  const cel = Object.values(sprite.cels)[0];
  if (!cel) throw new Error(`sprite ${sprite.name} has no cel`);
  return cel.pixels;
};

const undoLast = (rig: Rig): TransactionResult =>
  rig.engine.undo({ documentId: rig.engine.documentId, expectedRevision: rig.engine.state().revision });

const redoLast = (rig: Rig): TransactionResult =>
  rig.engine.redo({ documentId: rig.engine.documentId, expectedRevision: rig.engine.state().revision });

const createBank = (rig: Rig, colors: readonly string[], transparent: boolean): BankId => {
  const result = execute(rig, [
    { ...step('palette.create', { name: `Bank ${colors.length}`, cap: 256, transparent, colors }), ref: 'made' },
  ]);
  if (!result.ok) throw new Error(result.error.message);
  return result.created.made as BankId;
};

export { createBank, firstCelPixels, importOptions, importStep, redoLast, spriteNamed, undoLast };
