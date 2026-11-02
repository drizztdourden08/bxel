/* @layer renderer-app @kind logic */
import type { MenuGroup } from '@drizztdourden08/tessera';
import { SPEEDS } from '../../../stores/timeline-store.constants';
import { TILE_TEXT } from '../../../tilemap/tile-mode.constants';

const tileSpeedGroups = (speed: number, setSpeed: (speed: number) => void): MenuGroup[] => [
  {
    id: 'tile-speed',
    label: TILE_TEXT.clockSpeed,
    items: SPEEDS.map((each) => ({ id: `tile-speed-${each}`, label: `${each}x`, kind: 'radio' as const, checked: speed === each, onSelect: () => setSpeed(each) })),
  },
];

export { tileSpeedGroups };
