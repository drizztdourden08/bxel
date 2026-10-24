/* @layer core @kind logic */
import { moveFrame } from '../../draft/move-frame';
import { frameReorderSchema } from '../../schema/frame-reorder-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { ERROR_CODE } from '../error-code.constants';
import { failIfAny } from '../layer/fail-if-any';
import { frameIssue } from './frame-issue';
import { pickFrames } from './pick-frames';

const frameReorder = defineCommand({
  name: COMMAND_NAME.frameReorder,
  scope: 'sprites',
  schema: frameReorderSchema,
  run: (draft, input) => {
    const { frame: ref, to } = input.options;
    const picked = pickFrames(draft.artwork, input.sprites, ref, 'options.frame');
    failIfAny(
      ERROR_CODE.INDEX_OUT_OF_RANGE,
      'The position is at or above the number of frames.',
      picked
        .filter(({ sprite }) => to >= sprite.frames.length)
        .map(({ sprite, frame }) => frameIssue(sprite.id, frame, `position ${to} is past the last frame`)),
    );
    for (const { sprite, frame, index } of picked) {
      if (index !== to) moveFrame(draft, sprite.id, frame.id, to);
    }
  },
});

export { frameReorder };
