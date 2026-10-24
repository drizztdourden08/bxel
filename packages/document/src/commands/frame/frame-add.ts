/* @layer core @kind logic */
import { frameAddSchema } from '../../schema/frame-add-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { addFrames } from './add-frames';

const frameAdd = defineCommand({
  name: COMMAND_NAME.frameAdd,
  scope: 'sprites',
  schema: frameAddSchema,
  run: (draft, input) => {
    const { after, copyOf, durationMs, linked } = input.options;
    addFrames(draft, input, { after, copyOf, durationMs, linked });
  },
});

export { frameAdd };
