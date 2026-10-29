/* @layer renderer-app @kind logic */
import type { Animation, CommandStep } from '@bxel/document';
import { PALETTE_COMMAND_NAME } from '@bxel/palette';
import type { AddRequest } from './add-frames.type';
import { MAP_EXACT } from './file-strip-steps.constants';
import { DROP_REF } from './image-drop.constants';
import { stripSteps } from './strip-steps';

const fileStripSteps = (animation: Animation, request: Extract<AddRequest, { kind: 'file' }>): CommandStep[] => {
  const { file, spec, cells, result, durationMs } = request;
  const made: CommandStep = {
    name: PALETTE_COMMAND_NAME.spriteImport,
    targets: null,
    ref: DROP_REF.strip,
    options: { name: file.name, image: { width: file.width, height: file.height, rgba: file.rgba }, bank: { bankId: file.bankId }, mapping: MAP_EXACT },
  };
  return [made, ...stripSteps(animation, { kind: 'strip', sprite: { ref: DROP_REF.strip }, spec, cells, result, durationMs, at: file.at })];
};

export { fileStripSteps };
