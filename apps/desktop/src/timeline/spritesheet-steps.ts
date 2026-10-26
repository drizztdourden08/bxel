/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { Animation, CommandStep } from '@bxel/document';
import { TIMELINE_REF } from './timeline.constants';

const entryStep = (animation: Animation, tag: string | null): CommandStep => ({
  name: COMMAND_NAME.sheetAnimationAdd,
  targets: null,
  options: { sheet: { ref: TIMELINE_REF.sheet }, animation: animation.id, tag: tag === null ? null : { by: 'id', id: tag } },
});

const spritesheetSteps = (animation: Animation, sheetName: string): CommandStep[] => {
  const create: CommandStep = { name: COMMAND_NAME.sheetCreate, targets: null, options: { name: sheetName }, ref: TIMELINE_REF.sheet };
  const rows = animation.directions === 'none' || animation.tags.length === 0 ? [null] : animation.tags.map((tag) => tag.id);
  return [create, ...rows.map((tag) => entryStep(animation, tag))];
};

export { spritesheetSteps };
