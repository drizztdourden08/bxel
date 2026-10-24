/* @layer renderer-app @kind constants */
import { platformGroups } from '../../platform-preset/platform-groups';
import type { SnapChange } from '../../platform-preset/snap-plan.type';
import type { HintSpec } from '../ActionHint';

const PALETTE_SETTINGS_TEXT = {
  open: 'Palette settings',
  title: 'Palette settings',
  close: 'Close',
  setLabel: 'Swatch set',
  setPlaceholder: 'Choose a set',
  addColors: 'Add colours',
  replaceColors: 'Replace colours',
} as const;

const SETTINGS_HINT: HintSpec = {
  name: PALETTE_SETTINGS_TEXT.open,
  description: 'Load a swatch set, choose the palette bank and set the platform rules for this file.',
};

const PLATFORM_GROUPS = platformGroups();

const NO_CHANGES: readonly SnapChange[] = [];

export { NO_CHANGES, PALETTE_SETTINGS_TEXT, PLATFORM_GROUPS, SETTINGS_HINT };
