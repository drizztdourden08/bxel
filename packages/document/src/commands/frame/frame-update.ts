/* @layer core @kind logic */
import { replaceFrame } from '../../draft/replace-frame';
import { frameUpdateSchema } from '../../schema/frame-update-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { pickFrames } from './pick-frames';

const frameUpdate = defineCommand({
  name: COMMAND_NAME.frameUpdate,
  scope: 'sprites',
  schema: frameUpdateSchema,
  run: (draft, input) => {
    const { frame: ref, durationMs } = input.options;
    for (const { sprite, frame } of pickFrames(draft.artwork, input.sprites, ref, 'options.frame')) {
      if (frame.durationMs !== durationMs) replaceFrame(draft, sprite.id, { ...frame, durationMs });
    }
  },
});

export { frameUpdate };
