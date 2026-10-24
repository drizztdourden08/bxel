/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { CommandStep } from '@bxel/document';
import { DEFAULT_FRAME_DURATION_MS } from '@bxel/document';
import { NEW_REF } from './new-sprite.constants';
import type { PlanInput } from './asset-plan.type';

const scope = { sprites: [{ ref: NEW_REF }], layers: { by: 'all' }, frames: { by: 'all' } } as const;

const extraSpriteSteps = ({ form, artwork }: PlanInput): CommandStep[] => {
  const steps: CommandStep[] = [];
  if (form.frameMs !== DEFAULT_FRAME_DURATION_MS) {
    steps.push({ name: COMMAND_NAME.frameUpdate, targets: scope, options: { frame: { by: 'index', index: 0 }, durationMs: form.frameMs } });
  }
  if (form.platformId !== null && form.platformId !== artwork.platformId) {
    steps.push({ name: COMMAND_NAME.spriteUpdate, targets: scope, options: { platformId: form.platformId } });
  }
  return steps;
};

export { extraSpriteSteps };
