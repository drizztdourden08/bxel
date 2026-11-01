/* @layer renderer-app @kind constants */
import type { ProjectViewSettings } from '../../../panel-browser/browser-state.type';

const STEPS: readonly Partial<ProjectViewSettings>[] = [
  { density: 'compact' },
  { density: 'comfortable' },
  { mode: 'list', density: 'grid', tile: 48 },
  { mode: 'list', density: 'grid', tile: 64 },
  { mode: 'list', density: 'grid', tile: 96 },
];

export { STEPS };
