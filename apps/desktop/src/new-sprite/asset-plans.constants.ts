/* @layer renderer-app @kind constants */
import { COMMAND_NAME } from '@bxel/document';
import type { AssetKey } from '@bxel/document';
import { PALETTE_COMMAND_NAME } from '@bxel/palette';
import { bankPlan } from '../palette-source/bank-plan';
import type { AssetPlan, PlanInput } from './asset-plan.type';
import { extraSpriteSteps } from './extra-sprite-steps';
import { NEW_REF, NEW_SHEET_REF } from './new-sprite.constants';
import { nextSheetName } from './next-sheet-name';
import { sheetSteps } from './sheet-steps';
import { spriteNames } from './sprite-names';
import { spriteSize } from './sprite-size';
import { spriteSteps } from './sprite-steps';

const keyFrom = (kind: AssetKey['kind'], ref: string) => (created: Readonly<Record<string, unknown>>): AssetKey | null => {
  const id = created[ref];
  return typeof id === 'string' ? { kind, id } : null;
};

const spritePlan = (input: PlanInput): AssetPlan => ({
  steps: [
    ...spriteSteps({ names: spriteNames(input.form), size: spriteSize(input.form), bankId: input.bankId, fillSlot: null, existingId: null, pixelGrid: input.form.pixelGrid }),
    ...extraSpriteSteps(input),
  ],
  keyOf: keyFrom('sprite', NEW_REF),
});

const sheetPlan = (input: PlanInput): AssetPlan => {
  const names = spriteNames(input.form);
  const size = spriteSize(input.form);
  const steps = [...spriteSteps({ names, size, bankId: input.bankId, fillSlot: null, existingId: null, pixelGrid: input.form.pixelGrid }), ...sheetSteps({ names, form: input.form, size, existingId: null, sheetName: nextSheetName(input.artwork.sheets.map((sheet) => sheet.name)) })];
  const sheet = keyFrom('sheet', NEW_SHEET_REF);
  const first = keyFrom('sprite', NEW_REF);
  return { steps, keyOf: (created) => sheet(created) ?? first(created) };
};

const palettePlan = ({ form }: PlanInput): AssetPlan => {
  const { bank } = bankPlan(form.source, form.limit, form.transparent);
  const options = { name: form.name.trim(), cap: bank.cap, transparent: bank.transparent, colors: bank.colors.map((color) => color.rgb) };
  return { steps: [{ name: PALETTE_COMMAND_NAME.paletteCreate, targets: null, options, ref: NEW_REF }], keyOf: keyFrom('palette', NEW_REF) };
};

const tilesetPlan = ({ form, bankId }: PlanInput): AssetPlan => ({
  steps: [
    {
      name: COMMAND_NAME.tilesetCreate,
      targets: null,
      options: { name: form.name.trim(), tileWidth: form.width, tileHeight: form.height, ...(bankId === null ? {} : { bankId }) },
      ref: NEW_REF,
    },
  ],
  keyOf: keyFrom('tileset', NEW_REF),
});

const tilemapPlan = ({ form }: PlanInput): AssetPlan => ({
  steps: [
    { name: COMMAND_NAME.tilemapCreate, targets: null, options: { name: form.name.trim(), tileset: form.tilesetId, columns: form.columns, rows: form.rows }, ref: NEW_REF },
  ],
  keyOf: keyFrom('tilemap', NEW_REF),
});

const ASSET_PLANS = { sprite: spritePlan, sheet: sheetPlan, palette: palettePlan, tileset: tilesetPlan, tilemap: tilemapPlan } as const;

export { ASSET_PLANS };
