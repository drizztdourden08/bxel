/* @layer renderer-app @kind component */
import { Button, Flex, Stack, Text } from '@drizztdourden08/tessera';
import { openAnimationAt } from '../../../timeline/open-animation-at';
import { TIMELINE_TEXT } from '../../../timeline/timeline.constants';
import { TIMELINE_PANEL_TEXT } from '../TimelinePanel.constants';
import type { UsedByProps } from './UsedBy.type';

const UsedBy = ({ used }: UsedByProps) => (
  <Stack gap="xs" role="group" aria-label={TIMELINE_PANEL_TEXT.usedBy} className="timeline__used">
    <Text variant="caption" tone="muted">{TIMELINE_PANEL_TEXT.usedBy}</Text>
    {used.map((use) => (
      <Flex key={use.animationId} gap="sm" align="center" wrap>
        <Text variant="caption">{`${use.name}, ${TIMELINE_TEXT.framesList(use.frames.map((frame) => frame.number))}`}</Text>
        <Button size="sm" variant="tertiary" onClick={() => openAnimationAt(use.animationId, use.frames[0]?.id ?? null)}>
          {TIMELINE_PANEL_TEXT.openAtFrame(use.frames[0]?.number ?? 1)}
        </Button>
      </Flex>
    ))}
  </Stack>
);

export { UsedBy };
