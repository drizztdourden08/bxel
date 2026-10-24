/* @layer core @kind logic */
import { frameDuplicateSchema } from '../../schema/frame-duplicate-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { addFrames } from './add-frames';

const frameDuplicate = defineCommand({
  name: COMMAND_NAME.frameDuplicate,
  scope: 'sprites',
  schema: frameDuplicateSchema,
  run: (draft, input) => {
    const { frame, durationMs, linked } = input.options;
    addFrames(draft, input, { after: frame, copyOf: frame, durationMs, linked });
  },
});

export { frameDuplicate };
