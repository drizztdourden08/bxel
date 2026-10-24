/* @layer core @kind logic */
import { removeFrame } from '../../draft/remove-frame';
import { frameDeleteSchema } from '../../schema/frame-delete-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { ERROR_CODE } from '../error-code.constants';
import { failIfAny } from '../layer/fail-if-any';
import { frameIssue } from './frame-issue';
import { pickFrames } from './pick-frames';

const frameDelete = defineCommand({
  name: COMMAND_NAME.frameDelete,
  scope: 'sprites',
  schema: frameDeleteSchema,
  run: (draft, input) => {
    const picked = pickFrames(draft.artwork, input.sprites, input.options.frame, 'options.frame');
    failIfAny(
      ERROR_CODE.LAST_FRAME,
      'A sprite keeps at least one frame.',
      picked
        .filter(({ sprite }) => sprite.frames.length === 1)
        .map(({ sprite, frame }) => frameIssue(sprite.id, frame, 'it is the only frame')),
    );
    for (const { sprite, frame } of picked) removeFrame(draft, sprite.id, frame.id);
  },
});

export { frameDelete };
