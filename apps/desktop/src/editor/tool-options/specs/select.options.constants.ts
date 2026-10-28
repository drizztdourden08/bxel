/* @layer renderer-app @kind constants */
import type { CombineMode, Connectivity } from '@bxel/raster';
import { OPTION_COMMAND } from '../../../keymap/option-command-id.constants';
import { SELECTION_COMMAND_ID } from '../../../keymap/selection-command-id.constants';
import { useSelectionStore } from '../../../stores/useSelectionStore';
import { resizeSelection } from '../../selection/resize-selection';
import { SELECT_MODES, SELECT_VARIANTS } from '../../selection/selection.constants';
import { NEIGHBOUR_CHOICES, OPTION_TEXT, SELECT_MODE_CHOICES, SELECT_SHAPE_CHOICES } from '../tool-options.constants';
import type { OptionSpec } from '../tool-options.type';

const selection = () => useSelectionStore.getState();

const base = { tool: 'select', surface: 'paint', memory: 'global' } as const;

const asMode = (value: unknown): CombineMode => SELECT_MODES.find((mode) => mode === value) ?? 'replace';

const asVariant = (value: unknown) => SELECT_VARIANTS.find((variant) => variant === value) ?? 'rect';

const asNeighbours = (value: unknown): Connectivity => (String(value) === '8' ? 8 : 4);

const resizeOption = (name: 'expand' | 'shrink', delta: number, priority: number): OptionSpec => ({
  ...base,
  id: `select.${name}`,
  name,
  kind: 'action',
  label: name === 'expand' ? OPTION_TEXT.expand : OPTION_TEXT.shrink,
  description: name === 'expand' ? OPTION_TEXT.expandDescription : OPTION_TEXT.shrinkDescription,
  tier: 1,
  priority,
  group: 'actions',
  default: false,
  icon: name === 'expand' ? 'maximize-2' : 'minimize-2',
  caption: name === 'expand' ? OPTION_TEXT.expand : OPTION_TEXT.shrink,
  shortcuts: [{ command: name === 'expand' ? SELECTION_COMMAND_ID.expand : SELECTION_COMMAND_ID.shrink }],
  read: () => false,
  write: () => resizeSelection(delta),
});

const SELECT_OPTIONS: readonly OptionSpec[] = [
  {
    ...base,
    id: 'select.shape',
    name: 'shape',
    kind: 'choice',
    label: OPTION_TEXT.selectShape,
    description: OPTION_TEXT.selectShapeDescription,
    tier: 1,
    priority: 10,
    group: 'select',
    default: 'rect',
    choices: SELECT_SHAPE_CHOICES,
    command: OPTION_COMMAND.selectShape,
    read: () => selection().variant,
    write: (value) => selection().setVariant(asVariant(value)),
  },
  {
    ...base,
    id: 'select.mode',
    name: 'mode',
    kind: 'choice',
    label: OPTION_TEXT.selectMode,
    description: OPTION_TEXT.selectModeDescription,
    tier: 1,
    priority: 20,
    group: 'select',
    default: 'replace',
    choices: SELECT_MODE_CHOICES,
    command: OPTION_COMMAND.selectMode,
    flyout: true,
    read: () => selection().mode,
    write: (value) => selection().setMode(asMode(value)),
  },
  {
    ...base,
    id: 'select.neighbours',
    name: 'neighbours',
    kind: 'choice',
    label: OPTION_TEXT.wandNeighbours,
    description: OPTION_TEXT.wandNeighboursDescription,
    tier: 1,
    priority: 30,
    group: 'select',
    default: '4',
    choices: NEIGHBOUR_CHOICES,
    flyout: true,
    read: () => String(selection().connectivity),
    write: (value) => selection().setConnectivity(asNeighbours(value)),
    disabledReason: () => (selection().variant === 'wand' ? undefined : OPTION_TEXT.wandOnly),
  },
  resizeOption('expand', 1, 60),
  resizeOption('shrink', -1, 70),
];

export { SELECT_OPTIONS };
