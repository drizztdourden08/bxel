/* @layer renderer-app @kind constants */
import { VIEW_DEFAULTS } from '../stores/timeline-store.constants';
import type { SavedView } from './saved-view.type';

const EMPTY_VIEW: SavedView = { zooms: {}, timeMode: VIEW_DEFAULTS.timeMode, units: VIEW_DEFAULTS.units };

const UNIT_CHOICES = ['ms', 'seconds', 'ticks'] as const;

export { EMPTY_VIEW, UNIT_CHOICES };
