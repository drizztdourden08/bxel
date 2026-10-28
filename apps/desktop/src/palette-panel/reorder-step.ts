/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { CommandStep } from '@bxel/document';
import type { EditorTarget } from '../editor/editor.type';

const reorderStep = (target: EditorTarget, order: readonly string[]): CommandStep => ({
  name: COMMAND_NAME.paletteReorder,
  targets: null,
  options: { bankId: target.bank.id, order },
});

export { reorderStep };
