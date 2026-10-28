/* @layer renderer-app @kind component */
import { Box, DropdownMenu, Icon, IconButton, Tooltip } from '@drizztdourden08/tessera';
import { SPEEDS } from '../../../stores/timeline-store.constants';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import type { PlayMode } from '../../../stores/timeline-store.type';
import { togglePlayback } from '../../../timeline/toggle-playback';
import { TIMELINE_PANEL_TEXT } from '../TimelinePanel.constants';

const MODES: readonly { id: PlayMode; label: string }[] = [
  { id: 'loop', label: TIMELINE_PANEL_TEXT.loop },
  { id: 'once', label: TIMELINE_PANEL_TEXT.once },
  { id: 'pingpong', label: TIMELINE_PANEL_TEXT.pingpong },
];

const PlayControl = () => {
  const playing = useTimelineStore((state) => state.playing);
  const mode = useTimelineStore((state) => state.playMode);
  const subtags = useTimelineStore((state) => state.subtags);
  const rewind = useTimelineStore((state) => state.rewind);
  const speed = useTimelineStore((state) => state.speed);
  const store = useTimelineStore.getState();
  const name = playing ? TIMELINE_PANEL_TEXT.pause : TIMELINE_PANEL_TEXT.play;
  const groups = [
    { id: 'mode', items: MODES.map((each) => ({ id: each.id, label: each.label, kind: 'radio' as const, checked: mode === each.id, onSelect: () => store.setPlayMode(each.id) })) },
    {
      id: 'options',
      items: [
        { id: 'subtags', label: TIMELINE_PANEL_TEXT.subtags, kind: 'check' as const, checked: subtags, onSelect: () => store.setSubtags(!subtags) },
        { id: 'rewind', label: TIMELINE_PANEL_TEXT.rewind, kind: 'check' as const, checked: rewind, onSelect: () => store.setRewind(!rewind) },
      ],
    },
    {
      id: 'speed',
      items: [
        {
          id: 'speed',
          label: `${TIMELINE_PANEL_TEXT.speed} ${speed}x`,
          children: SPEEDS.map((each) => ({ id: `speed-${each}`, label: `${each}x`, kind: 'radio' as const, checked: speed === each, onSelect: () => store.setSpeed(each) })),
        },
      ],
    },
  ];
  return (
    <Box className="split-button" role="group" aria-label={TIMELINE_PANEL_TEXT.transport}>
      <Tooltip content={`${name} (Enter)`} placement="top">
        <IconButton label={name} size="sm" active={playing} aria-pressed={playing} onClick={togglePlayback}>
          <Icon name={playing ? 'pixel-pause' : 'pixel-play'} />
        </IconButton>
      </Tooltip>
      <DropdownMenu size="sm" variant="secondary" label={TIMELINE_PANEL_TEXT.playOptions} trigger={{ label: TIMELINE_PANEL_TEXT.playOptions, icon: 'chevron-down', iconOnly: true }} groups={groups} />
    </Box>
  );
};

export { PlayControl };
