/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { CommandStep, SpriteId } from '@bxel/document';
import { stripGrid } from '../add-frames/strip-grid';
import { TIMELINE_REF } from '../timeline/timeline.constants';
import type { CutStripSpec } from './compose.type';

const cutStripSteps = (sprite: SpriteId, name: string, spec: CutStripSpec): CommandStep[] => {
  const source = { kind: 'strip', sprite, grid: stripGrid(spec.strip), durationMs: spec.durationMs };
  const create = { name: COMMAND_NAME.animationCreate, targets: null, options: { name, source }, ref: TIMELINE_REF.animation };
  if (spec.result === 'cells') return [create];
  return [create, { name: COMMAND_NAME.animationSplit, targets: null, options: { animation: { ref: TIMELINE_REF.animation } } }];
};

export { cutStripSteps };
