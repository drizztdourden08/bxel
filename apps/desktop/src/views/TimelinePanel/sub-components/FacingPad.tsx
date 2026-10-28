/* @layer renderer-app @kind component */
import { FACING_SETS } from '@bxel/document';
import { Box, Button, Icon, Stack, Text } from '@drizztdourden08/tessera';
import { drawFacing } from '../../../direction-set/draw-facing';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { addTag } from '../../../timeline/add-tag';
import { facingTag } from '../../../timeline/facing-tag';
import { pickFacing } from '../../../timeline/pick-facing';
import { COMPASS, FACING_TEXT, TIMELINE_TEXT } from '../../../timeline/timeline.constants';
import { FACING_ABBREVIATION, TIMELINE_PANEL_TEXT } from '../TimelinePanel.constants';
import type { FocusProps } from '../TimelinePanel.type';

const FacingPad = ({ focus }: FocusProps) => {
  const tagId = useTimelineStore((state) => state.tagId);
  const { animation } = focus;
  const facings = FACING_SETS[animation.directions];
  const picked = animation.tags.find((tag) => tag.id === tagId);
  const mirror = picked?.kind === 'mirror' ? picked : null;
  return (
    <Stack gap="xs" className="facing-pad" role="group" aria-label={TIMELINE_PANEL_TEXT.facingPad}>
      <Box className="direction-pad">
        {COMPASS.flat().map((facing, index) => {
          if (facing === null || !facings.includes(facing)) return <Box key={index} role="presentation" />;
          const tag = facingTag(animation, facing);
          const isMirror = tag?.kind === 'mirror';
          const label = tag === undefined ? TIMELINE_PANEL_TEXT.addFacing : TIMELINE_TEXT.facingLabel(FACING_TEXT[facing], true);
          return (
            <Button
              key={facing}
              size="sm"
              variant={tag?.id === tagId ? 'primary' : 'secondary'}
              className="direction-pad__facing"
              data-state={tag === undefined ? 'missing' : isMirror ? 'mirror' : 'tag'}
              disabled={tag === undefined && focus.readOnly}
              aria-pressed={tag?.id === tagId}
              aria-label={tag === undefined ? `${label}: ${FACING_TEXT[facing]}` : label}
              onClick={() => (tag === undefined ? addTag(undefined, facing) : pickFacing(facing))}
            >
              {isMirror && <Icon name={tag.flip === 'y' ? 'pixel-flip-v' : 'pixel-flip-h'} size={10} aria-hidden="true" />}
              {FACING_ABBREVIATION[facing]}
            </Button>
          );
        })}
      </Box>
      {mirror && <Text variant="caption" tone="muted">{TIMELINE_PANEL_TEXT.mirrorFacing(mirror.flip)}</Text>}
      <Button size="sm" variant="secondary" disabled={mirror === null || focus.readOnly} onClick={() => mirror && drawFacing(mirror.facing)}>
        {TIMELINE_TEXT.drawFacing}
      </Button>
    </Stack>
  );
};

export { FacingPad };
