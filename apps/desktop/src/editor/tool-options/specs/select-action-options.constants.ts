/* @layer renderer-app @kind constants */
import { SELECTION_COMMAND_ID } from '../../../keymap/selection-command-id.constants';
import { clearSelection } from '../../selection/clear-selection';
import { invertSelection } from '../../selection/invert-selection';
import { OPTION_TEXT } from '../tool-options.constants';
import type { OptionSpec } from '../tool-options.type';

const wholeSelectionAction = (name: 'invert' | 'deselect', priority: number, run: () => void): OptionSpec => ({
  tool: 'select',
  surface: 'paint',
  memory: 'global',
  id: `select.${name}`,
  name,
  kind: 'action',
  label: name === 'invert' ? OPTION_TEXT.invert : OPTION_TEXT.deselect,
  description: name === 'invert' ? OPTION_TEXT.invertDescription : OPTION_TEXT.deselectDescription,
  tier: 2,
  priority,
  group: 'actions',
  default: false,
  ...(name === 'deselect' ? { icon: 'x' as const } : {}),
  caption: name === 'invert' ? OPTION_TEXT.invert : OPTION_TEXT.deselect,
  shortcuts: [{ command: name === 'invert' ? SELECTION_COMMAND_ID.invert : SELECTION_COMMAND_ID.clear }],
  read: () => false,
  write: run,
});

const SELECT_ACTION_OPTIONS: readonly OptionSpec[] = [
  wholeSelectionAction('invert', 80, invertSelection),
  wholeSelectionAction('deselect', 90, clearSelection),
];

export { SELECT_ACTION_OPTIONS };
