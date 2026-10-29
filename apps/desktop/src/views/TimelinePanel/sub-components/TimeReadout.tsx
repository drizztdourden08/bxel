/* @layer renderer-app @kind component */
import { DropdownMenu } from '@drizztdourden08/tessera';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { timeReadout } from '../../../timeline/time-readout';
import { TIMELINE_PANEL_TEXT } from '../TimelinePanel.constants';
import type { FocusProps } from '../TimelinePanel.type';
import { UNITS } from './TimeReadout.constants';

const TimeReadout = ({ focus }: FocusProps) => {
  const units = useTimelineStore((state) => state.units);
  const speed = useTimelineStore((state) => state.speed);
  useTimelineStore((state) => state.cursor);
  const readout = timeReadout(focus, units);
  const text = `${readout.clock}  ${readout.fps}${speed === 1 ? '' : `  ${speed}x`}`;
  return (
    <DropdownMenu
      size="sm"
      variant="ghost"
      label={TIMELINE_PANEL_TEXT.units}
      trigger={{ label: text }}
      groups={[
        {
          id: 'units',
          items: UNITS.map((each) => ({
            id: each,
            label: TIMELINE_PANEL_TEXT.unitNames[each],
            kind: 'radio' as const,
            checked: units === each,
            onSelect: () => useTimelineStore.getState().setUnits(each),
          })),
        },
      ]}
    />
  );
};

export { TimeReadout };
