/* @layer renderer-app @kind logic */
import { PALETTE_COMMAND_NAME } from '@bxel/palette';
import type { EditorTarget } from '../editor/editor.type';
import { PANEL_LABEL, PANEL_TEXT } from './palette-panel.constants';
import type { PanelOutcome } from './palette-panel.type';
import { runPanelSteps } from './run-panel-steps';

const detachPalette = (target: EditorTarget): PanelOutcome => {
  const targets = { sprites: [target.sprite.id], layers: { by: 'all' }, frames: { by: 'all' } } as const;
  const steps = [{ name: PALETTE_COMMAND_NAME.paletteDetach, targets, options: {} }];
  return runPanelSteps({ target, label: PANEL_LABEL.detach, steps, done: PANEL_TEXT.detached(target.sprite.name) });
};

export { detachPalette };
