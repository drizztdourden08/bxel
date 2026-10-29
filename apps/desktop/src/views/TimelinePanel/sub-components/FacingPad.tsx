/* @layer renderer-app @kind component */
import { FACING_SETS } from '@bxel/document';
import { Box, Button, Stack, Text } from '@drizztdourden08/tessera';
import { drawFacing } from '../../../direction-set/draw-facing';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { COMPASS, TIMELINE_TEXT } from '../../../timeline/timeline.constants';
import { TIMELINE_PANEL_TEXT } from '../TimelinePanel.constants';
import type { FocusProps } from '../TimelinePanel.type';
import { FacingButton } from './FacingButton';

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
          return <FacingButton key={facing} focus={focus} facing={facing} tagId={tagId} />;
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
