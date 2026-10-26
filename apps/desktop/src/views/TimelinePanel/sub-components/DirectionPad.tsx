/* @layer renderer-app @kind component */
import { FACING_SETS } from '@bxel/document';
import { Box, Button, Flex, Stack, Text } from '@drizztdourden08/tessera';
import { drawFacing } from '../../../direction-set/draw-facing';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { facingTag } from '../../../timeline/facing-tag';
import { pickFacing } from '../../../timeline/pick-facing';
import { COMPASS, FACING_TEXT, TIMELINE_TEXT } from '../../../timeline/timeline.constants';
import { FACING_ABBREVIATION } from '../TimelinePanel.constants';
import type { FocusProps } from '../TimelinePanel.type';

const DirectionPad = ({ focus }: FocusProps) => {
  const tagId = useTimelineStore((state) => state.tagId);
  const { animation } = focus;
  const facings = FACING_SETS[animation.directions];
  const picked = animation.tags.find((tag) => tag.id === tagId);
  const mirror = picked?.kind === 'mirror' ? picked : null;
  return (
    <Flex gap="sm" align="center" role="group" aria-label={TIMELINE_TEXT.directions}>
      <Box className="direction-pad">
        {COMPASS.flat().map((facing, index) => {
          if (facing === null || !facings.includes(facing)) return <Box key={index} role="presentation" />;
          const tag = facingTag(animation, facing);
          return (
            <Button
              key={facing}
              size="sm"
              variant={tag?.id === tagId ? 'primary' : 'secondary'}
              disabled={tag === undefined}
              aria-pressed={tag?.id === tagId}
              aria-label={TIMELINE_TEXT.facingLabel(FACING_TEXT[facing], tag !== undefined)}
              onClick={() => pickFacing(facing)}
            >
              {FACING_ABBREVIATION[facing]}
            </Button>
          );
        })}
      </Box>
      <Stack gap="xs">
        <Text variant="caption" tone="muted">{TIMELINE_TEXT.directions}</Text>
        <Button size="sm" variant="secondary" disabled={mirror === null || focus.readOnly} onClick={() => mirror && drawFacing(mirror.facing)}>
          {TIMELINE_TEXT.drawFacing}
        </Button>
      </Stack>
    </Flex>
  );
};

export { DirectionPad };
