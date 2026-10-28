/* @layer renderer-app @kind constants */
import type { IconName } from '@drizztdourden08/tessera';
import type { TileFilter, TilesetMode } from '../../stores/tileset-view-store.type';
import type { ZoomChoice } from './TilesetPanel.type';

const MODES: readonly { value: TilesetMode; label: string; icon: IconName; description: string }[] = [
  { value: 'tiles', label: 'Tiles', icon: 'pixel-tileset', description: 'Pick tiles, set their name, type and probability.' },
  { value: 'terrain', label: 'Terrain', icon: 'waves', description: 'See which tiles take part in the terrain rules.' },
  { value: 'collision', label: 'Collision', icon: 'square', description: 'Draw collision shapes on named layers, or paint one over many tiles.' },
  { value: 'data', label: 'Data', icon: 'tag', description: 'Give tiles typed custom data, or paint a value over many tiles.' },
  { value: 'animation', label: 'Animation', icon: 'pixel-animation', description: 'Link tiles to animations, or build one from the selected tiles.' },
];

const MODE_OPTIONS = MODES.map((mode) => ({
  value: mode.value,
  icon: mode.icon,
  title: `${mode.label} (${MODES.indexOf(mode) + 1})`,
  hint: { label: mode.label, description: mode.description },
}));

const FILTERS: readonly { value: TileFilter; label: string }[] = [
  { value: 'used', label: 'Used' },
  { value: 'unused', label: 'Unused' },
  { value: 'animated', label: 'Animated' },
  { value: 'collision', label: 'Collision' },
  { value: 'terrain', label: 'Terrain' },
];

const ZOOMS: readonly ZoomChoice[] = [
  { zoom: 'fit', label: 'Fit' },
  { zoom: 1, label: '1x' },
  { zoom: 2, label: '2x' },
  { zoom: 3, label: '3x' },
  { zoom: 4, label: '4x' },
];

export { FILTERS, MODE_OPTIONS, MODES, ZOOMS };
