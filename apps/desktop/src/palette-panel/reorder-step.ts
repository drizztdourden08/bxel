/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { CommandStep } from '@bxel/document';
import type { PaletteTarget } from '../editor/editor.type';

const reorderStep = (target: PaletteTarget, order: readonly string[]): CommandStep => ({
  name: COMMAND_NAME.paletteReorder,
  targets: null,
  options: { bankId: target.bank.id, order },
});

export { reorderStep };
