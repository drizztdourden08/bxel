/* @layer renderer-app @kind component */
import { Button, ColorSwatch, Flex } from '@drizztdourden08/tessera';
import { setTagColour } from '../../../timeline/set-tag-colour';
import { TAG_COLOUR_CHOICES } from '../../../timeline/tag-colour.constants';
import { TIMELINE_TEXT } from '../../../timeline/timeline.constants';
import type { TagEditorProps } from '../TimelinePanel.type';

const TagColours = ({ tag, readOnly }: TagEditorProps) => (
  <Flex gap="xs" align="center" wrap role="group" aria-label={TIMELINE_TEXT.tagColour}>
    {TAG_COLOUR_CHOICES.map((choice) => (
      <ColorSwatch
        key={choice.hex}
        size="sm"
        color={choice.hex}
        selected={tag.colour === choice.hex}
        aria-pressed={tag.colour === choice.hex}
        aria-label={TIMELINE_TEXT.tagColourLabel(choice.name)}
        disabled={readOnly}
        onClick={() => setTagColour(tag.id, choice.hex)}
      />
    ))}
    <Button size="sm" variant="secondary" disabled={tag.colour === undefined || readOnly} onClick={() => setTagColour(tag.id, null)}>
      {TIMELINE_TEXT.tagColourAuto}
    </Button>
  </Flex>
);

export { TagColours };
