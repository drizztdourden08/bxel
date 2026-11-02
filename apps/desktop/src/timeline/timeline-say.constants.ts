/* @layer renderer-app @kind constants */

const plural = (count: number, word: string): string => `${count} ${word}${count === 1 ? '' : 's'}`;

const TIMELINE_SAY = {
  added: (position: number, total: number): string => `Frame added at position ${position}. ${plural(total, 'frame')} in the animation`,
  deleted: (count: number, left: number): string => `Deleted ${plural(count, 'frame')}. ${plural(left, 'frame')} left`,
  moved: (position: number, total: number): string => `Moved to position ${position} of ${total}`,
  duration: (count: number, ms: number | null): string =>
    ms === null ? `Changed the duration of ${plural(count, 'frame')}` : `Duration ${ms} milliseconds for ${plural(count, 'frame')}`,
  tagAdded: (name: string): string => `Tag ${name} added`,
  tagDeleted: 'Tag deleted',
  tagChanged: (name: string): string => `Tag ${name} changed`,
  tagResized: (name: string, from: number, to: number): string => `Tag ${name} covers ${from === to ? `frame ${from}` : `frames ${from} to ${to}`}`,
  mirrored: 'Mirror tag added',
  playing: 'Playing',
  playingFrom: (frame: number): string => `Playing from frame ${frame}`,
  playingTag: (name: string): string => `Playing tag ${name}`,
  paused: (frame: number): string => `Paused at frame ${frame}`,
  rewound: (frame: number): string => `Stopped and rewound to frame ${frame}`,
} as const;

export { TIMELINE_SAY };
