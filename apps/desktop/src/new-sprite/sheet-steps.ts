/* @layer renderer-app @kind logic */
import { COMMAND_NAME, MAX_TARGET_SPRITES } from '@bxel/document';
import type { CommandStep, SpriteId } from '@bxel/document';
import { NEW_SHEET_REF } from './new-sprite.constants';
import type { SheetStepsInput } from './new-sprite.type';

const spriteRef = (index: number, existingId: string | null): SpriteId | { ref: string } =>
  index === 0 && existingId !== null ? (existingId as SpriteId) : { ref: `new${index}` };

const sheetSteps = ({ names, form, size, existingId, sheetName }: SheetStepsInput): CommandStep[] => {
  if (form.kind !== 'sheet' || names.length < 2) return [];
  const create: CommandStep = {
    name: COMMAND_NAME.sheetCreate,
    targets: null,
    options: { name: sheetName, layout: { kind: 'grid', columns: form.columns, cellWidth: size.width, cellHeight: size.height, order: 'rows' } },
    ref: NEW_SHEET_REF,
  };
  const adds = Array.from({ length: Math.ceil(names.length / MAX_TARGET_SPRITES) }, (_, chunk): CommandStep => {
    const from = chunk * MAX_TARGET_SPRITES;
    const part = names.slice(from, from + MAX_TARGET_SPRITES);
    return {
      name: COMMAND_NAME.sheetAdd,
      targets: { sprites: part.map((_name, offset) => spriteRef(from + offset, existingId)), layers: { by: 'all' }, frames: { by: 'all' } },
      options: { sheet: { ref: NEW_SHEET_REF } },
    };
  });
  return [create, ...adds];
};

export { sheetSteps };
