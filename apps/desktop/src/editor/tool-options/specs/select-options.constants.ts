/* @layer renderer-app @kind constants */
import type { CombineMode, Connectivity } from '@bxel/raster';
import { OPTION_COMMAND } from '../../../keymap/option-command-id.constants';
import { SELECTION_COMMAND_ID } from '../../../keymap/selection-command-id.constants';
import { useSelectionStore } from '../../../stores/useSelectionStore';
import type { MatchKind, SampleSource } from '../../selection/selection.type';
import { resizeSelection } from '../../selection/resize-selection';
import { SELECT_MODES, SELECT_VARIANTS } from '../../selection/selection.constants';
import { numberSpec } from './number-spec';
import { MATCH_CHOICES, NEIGHBOUR_CHOICES, OPTION_TEXT, SAMPLE_CHOICES, SELECT_MODE_CHOICES, SELECT_SHAPE_CHOICES } from '../tool-options.constants';
import type { OptionSpec } from '../tool-options.type';

const selection = () => useSelectionStore.getState();

const base = { tool: 'select', surface: 'paint', memory: 'global' } as const;

const asMode = (value: unknown): CombineMode => SELECT_MODES.find((mode) => mode === value) ?? 'replace';

const asVariant = (value: unknown) => SELECT_VARIANTS.find((variant) => variant === value) ?? 'rect';

const asSample = (value: unknown): SampleSource => (value === 'visible' || value === 'all' ? value : 'layer');

const asMatch = (value: unknown): MatchKind => (value === 'ramp' || value === 'similar' ? value : 'exact');

const picksColour = (): boolean => selection().variant === 'wand' || selection().variant === 'colour';

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
  write: () => resizeSelection(delta * selection().amount),
});

const nudgeOption: OptionSpec = numberSpec({
  tool: 'move', name: 'nudge', label: OPTION_TEXT.nudge, description: OPTION_TEXT.nudgeDescription, priority: 10, group: 'move', default: 1, min: 1, max: 64,
  read: () => selection().nudge, write: (value) => selection().setNudge(value),
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
    appliesWhen: () => selection().variant === 'wand',
  },
  {
    ...base,
    id: 'select.sample',
    name: 'sample',
    kind: 'choice',
    label: OPTION_TEXT.sampleSource,
    description: OPTION_TEXT.sampleSourceDescription,
    tier: 1,
    priority: 40,
    group: 'select',
    default: 'layer',
    choices: SAMPLE_CHOICES,
    flyout: true,
    read: () => selection().sample,
    write: (value) => selection().setSample(asSample(value)),
    appliesWhen: () => selection().variant === 'wand' || selection().variant === 'colour',
  },
  {
    ...base,
    id: 'select.match',
    name: 'match',
    kind: 'choice',
    label: OPTION_TEXT.matchMode,
    description: OPTION_TEXT.matchModeDescription,
    tier: 1,
    priority: 42,
    group: 'select',
    default: 'exact',
    choices: MATCH_CHOICES,
    flyout: true,
    read: () => selection().match,
    write: (value) => selection().setMatch(asMatch(value)),
    appliesWhen: picksColour,
  },
  {
    ...base,
    id: 'select.distance',
    name: 'distance',
    kind: 'number',
    label: OPTION_TEXT.distance,
    description: OPTION_TEXT.distanceDescription,
    tier: 1,
    priority: 44,
    group: 'select',
    default: 32,
    min: 0,
    max: 255,
    step: 1,
    read: () => selection().distance,
    write: (value) => selection().setDistance(Number(value)),
    appliesWhen: () => picksColour() && selection().match === 'similar',
  },
  {
    ...base,
    id: 'select.ignore_transparent',
    name: 'ignoreTransparent',
    kind: 'toggle',
    label: OPTION_TEXT.ignoreTransparent,
    description: OPTION_TEXT.ignoreTransparentDescription,
    tier: 1,
    priority: 46,
    group: 'select',
    default: false,
    read: () => selection().ignoreTransparent,
    write: (value) => selection().setIgnoreTransparent(value === true),
    appliesWhen: picksColour,
  },
  {
    ...base,
    id: 'select.in_selection',
    name: 'inSelection',
    kind: 'toggle',
    label: OPTION_TEXT.inSelection,
    description: OPTION_TEXT.inSelectionDescription,
    tier: 1,
    priority: 48,
    group: 'select',
    default: false,
    read: () => selection().inSelection,
    write: (value) => selection().setInSelection(value === true),
    appliesWhen: picksColour,
  },
  {
    ...base,
    id: 'select.amount',
    name: 'amount',
    kind: 'number',
    label: OPTION_TEXT.amount,
    description: OPTION_TEXT.amountDescription,
    tier: 1,
    priority: 50,
    group: 'actions',
    default: 1,
    min: 1,
    max: 64,
    step: 1,
    read: () => selection().amount,
    write: (value) => selection().setAmount(Number(value)),
  },
  resizeOption('expand', 1, 60),
  resizeOption('shrink', -1, 70),
  nudgeOption,
];

export { SELECT_OPTIONS };
