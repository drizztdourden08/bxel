/* @layer core @kind test */
import { counterIdSource, createEngine, defineCommand, documentCommands, remapBank, resizeSprite, updateSprite } from '@bxel/document';
import type { BankId, Cel, CelId, CommandDef, Engine, Project, SpriteId } from '@bxel/document';
import { z } from 'zod';
import { brand, fixtureToProject } from './fixture-to-project';
import { documentId } from './heart-engine';
import { heartPairFixture } from './heart-pair-fixture';

const WIDE = brand<SpriteId>('spr_000010');
const CEL_A = brand<CelId>('cel_000014');
const CEL_B = brand<CelId>('cel_000015');
const PIXELS_A = Uint8Array.from([1, 2, 3, 4, 5, 6, 1, 2]);
const PIXELS_B = Uint8Array.from([6, 5, 4, 3, 2, 1, 6, 5]);
const TURNED_A = Uint8Array.from([5, 1, 6, 2, 1, 3, 1, 2]);
const TURNED_B = Uint8Array.from([2, 6, 1, 5, 6, 4, 5, 3]);

const wideProject = (): Project => {
  const [heart] = heartPairFixture.sprites;
  if (!heart) throw new Error('the heart fixture is missing');
  const sprite = {
    ...heart,
    width: 4,
    height: 2,
    pivot: { x2: 3, y2: 1 },
    cels: { cel_000014: { rows: ['1234', '5612'] }, cel_000015: { rows: ['6543', '2165'] } },
  };
  return fixtureToProject({ ...heartPairFixture, sprites: [sprite], sheets: [], presets: [] });
};

const swapCommand = (name: string, run: CommandDef['run']): CommandDef =>
  defineCommand({ name, scope: 'none', schema: z.strictObject({}), run });

const BANK = brand<BankId>('bnk_000002');
const SWAPPED: Readonly<Record<number, number>> = { 1: 2, 2: 1 };
const swapTable = Uint8Array.from({ length: 256 }, (_, index) => SWAPPED[index] ?? index);

const withoutLayerCel = (cels: Readonly<Record<string, CelId>>): Record<string, CelId> =>
  Object.fromEntries(Object.entries(cels).filter(([, id]) => id !== CEL_B));

const withoutSpriteCel = (cels: Readonly<Record<string, Cel>>): Record<string, Cel> =>
  Object.fromEntries(Object.entries(cels).filter(([id]) => id !== CEL_B));

const turned = { [CEL_A]: TURNED_A, [CEL_B]: TURNED_B };

const swapCommands: readonly CommandDef[] = [
  swapCommand('test.rebuffer', (draft) => {
    updateSprite(draft, WIDE, (sprite) => ({
      ...sprite,
      cels: { [CEL_A]: { id: CEL_A, pixels: PIXELS_B }, [CEL_B]: { id: CEL_B, pixels: PIXELS_A } },
    }));
  }),
  swapCommand('test.raw-turn', (draft) => {
    updateSprite(draft, WIDE, (sprite) => ({
      ...sprite,
      width: 2,
      height: 4,
      pivot: { x2: 1, y2: 3 },
      cels: { [CEL_A]: { id: CEL_A, pixels: TURNED_A }, [CEL_B]: { id: CEL_B, pixels: TURNED_B } },
    }));
  }),
  swapCommand('test.delete-remap', (draft) => {
    updateSprite(draft, WIDE, (sprite) => ({
      ...sprite,
      layers: sprite.layers.map((layer) => ({ ...layer, cels: withoutLayerCel(layer.cels) })),
      cels: withoutSpriteCel(sprite.cels),
    }));
    remapBank(draft, { bankId: BANK, forward: swapTable, inverse: swapTable });
  }),
  swapCommand('test.resize', (draft) => {
    resizeSprite(draft, WIDE, { width: 2, height: 4, pivot: { x2: 1, y2: 3 }, cels: turned });
  }),
  swapCommand('test.resize-twice', (draft) => {
    resizeSprite(draft, WIDE, { width: 2, height: 4, pivot: { x2: 1, y2: 3 }, cels: turned });
    resizeSprite(draft, WIDE, { width: 4, height: 2, pivot: { x2: 2, y2: 2 }, cels: { [CEL_A]: PIXELS_B, [CEL_B]: PIXELS_A } });
  }),
];

const swapEngine = (): Engine =>
  createEngine({
    state: { documentId, revision: 1, project: wideProject(), readOnly: false },
    ids: counterIdSource(100),
    commands: [...documentCommands, ...swapCommands],
  });

export { CEL_A, CEL_B, PIXELS_A, PIXELS_B, swapEngine, TURNED_A, TURNED_B, WIDE };
