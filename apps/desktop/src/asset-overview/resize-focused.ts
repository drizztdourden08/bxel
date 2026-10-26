/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { CommandStep, SpriteId } from '@bxel/document';
import { TRANSFORM_COMMAND } from '@bxel/raster';
import { toast } from '@drizztdourden08/brock-react';
import type { AssetFocus } from '../asset-config/asset-config.type';
import { spritesTarget } from '../sheet/sprites-target';
import { useDocumentStore } from '../stores/useDocumentStore';
import { runSteps } from '../transactions/run-steps';
import { OVERVIEW_LABEL, OVERVIEW_TEXT } from './asset-overview.constants';

const stepOf = (focus: AssetFocus, width: number, height: number): CommandStep | null => {
  if (focus.key.kind === 'sprite') {
    return { name: TRANSFORM_COMMAND.spriteResize, targets: spritesTarget([focus.key.id as SpriteId]), options: { width, height } };
  }
  return focus.key.kind === 'tilemap'
    ? { name: COMMAND_NAME.tilemapResize, targets: null, options: { tilemap: focus.key.id, columns: width, rows: height } }
    : null;
};

const resizeFocused = (focus: AssetFocus, width: number, height: number): void => {
  const step = stepOf(focus, width, height);
  if (step === null || focus.readOnly) {
    toast(OVERVIEW_TEXT.failed(OVERVIEW_TEXT.readOnly), { variant: 'warning' });
    return;
  }
  const label = focus.key.kind === 'sprite' ? OVERVIEW_LABEL.resizeSprite : OVERVIEW_LABEL.resizeMap;
  const done = runSteps(useDocumentStore.getState().host, focus.documentId, label, [step]);
  if (!done.ok) toast(OVERVIEW_TEXT.failed(done.error.message), { variant: 'danger' });
};

export { resizeFocused };
