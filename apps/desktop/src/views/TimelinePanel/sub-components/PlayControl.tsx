/* @layer renderer-app @kind component */
import { Icon, SplitButton } from '@drizztdourden08/tessera';
import type { MenuNode } from '@drizztdourden08/tessera';
import { SPEEDS } from '../../../stores/timeline-store.constants';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { togglePlayback } from '../../../timeline/toggle-playback';
import { TIMELINE_PANEL_TEXT } from '../TimelinePanel.constants';
import { MODES } from './PlayControl.constants';

const PlayControl = () => {
  const playing = useTimelineStore((state) => state.playing);
  const mode = useTimelineStore((state) => state.playMode);
  const subtags = useTimelineStore((state) => state.subtags);
  const rewind = useTimelineStore((state) => state.rewind);
  const speed = useTimelineStore((state) => state.speed);
  const store = useTimelineStore.getState();
  const items: MenuNode[] = [
    ...MODES.map((each) => ({ id: each.id, label: each.label, kind: 'radio' as const, checked: mode === each.id, onSelect: () => store.setPlayMode(each.id) })),
    { separator: true },
    { id: 'subtags', label: TIMELINE_PANEL_TEXT.subtags, kind: 'check', checked: subtags, onSelect: () => store.setSubtags(!subtags) },
    { id: 'rewind', label: TIMELINE_PANEL_TEXT.rewind, kind: 'check', checked: rewind, onSelect: () => store.setRewind(!rewind) },
    { separator: true },
    {
      id: 'speed',
      label: `${TIMELINE_PANEL_TEXT.speed} ${speed}x`,
      children: SPEEDS.map((each) => ({ id: `speed-${each}`, label: `${each}x`, kind: 'radio' as const, checked: speed === each, onSelect: () => store.setSpeed(each) })),
    },
  ];
  return (
    <SplitButton
      size="sm"
      variant="secondary"
      label={playing ? TIMELINE_PANEL_TEXT.pause : TIMELINE_PANEL_TEXT.play}
      icon={<Icon name={playing ? 'pixel-pause' : 'pixel-play'} />}
      pressed={playing}
      menuLabel={TIMELINE_PANEL_TEXT.playOptions}
      items={items}
      onClick={togglePlayback}
    />
  );
};

export { PlayControl };
