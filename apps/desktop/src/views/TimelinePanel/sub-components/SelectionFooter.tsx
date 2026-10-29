/* @layer renderer-app @kind component */
import { Box, ControlMenu, ControlMenuRow, Flex, Text } from '@drizztdourden08/tessera';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { currentSelection } from '../../../timeline/current-selection';
import { FRAME_ACTIONS, TIMELINE_PANEL_TEXT } from '../TimelinePanel.constants';
import type { FooterProps } from '../TimelinePanel.type';
import { ActionBar } from './ActionBar';
import { DurationFields } from './DurationFields';
import { OffsetFields } from './OffsetFields';
import { PivotFields } from './PivotFields';

const SelectionFooter = ({ focus, short }: FooterProps) => {
  useTimelineStore((state) => state.selection);
  const count = currentSelection(focus).length;
  return (
    <Flex gap="md" align="center" wrap className="timeline__footer" role="group" aria-label={TIMELINE_PANEL_TEXT.frameFields}>
      <Text variant="caption" tone="muted" role="status" aria-live="polite" className="timeline__picked">{TIMELINE_PANEL_TEXT.picked(count)}</Text>
      {short ? (
        <ControlMenu trigger={{ label: TIMELINE_PANEL_TEXT.frameFields }} label={TIMELINE_PANEL_TEXT.frameFields} size="sm" variant="secondary">
          <ControlMenuRow label={TIMELINE_PANEL_TEXT.durationCaption}>
            <DurationFields focus={focus} />
          </ControlMenuRow>
          <ControlMenuRow label={TIMELINE_PANEL_TEXT.offsetCaption}>
            <OffsetFields focus={focus} />
          </ControlMenuRow>
          <ControlMenuRow label={TIMELINE_PANEL_TEXT.pivotCaption}>
            <PivotFields focus={focus} />
          </ControlMenuRow>
        </ControlMenu>
      ) : (
        <>
          <DurationFields focus={focus} />
          <OffsetFields focus={focus} />
          <PivotFields focus={focus} />
        </>
      )}
      <Box className="timeline__footer-actions">
        <ActionBar label={TIMELINE_PANEL_TEXT.frames} actions={FRAME_ACTIONS} disabled={focus.readOnly} />
      </Box>
    </Flex>
  );
};

export { SelectionFooter };
