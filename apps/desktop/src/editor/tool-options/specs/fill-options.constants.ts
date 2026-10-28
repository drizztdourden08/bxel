/* @layer renderer-app @kind constants */
import type { Connectivity, FillMode } from '@bxel/raster';
import { OPTION_COMMAND } from '../../../keymap/option-command-id.constants';
import { useToolStore } from '../../../stores/useToolStore';
import { FILL_AREA_CHOICES, NEIGHBOUR_CHOICES, OPTION_TEXT } from '../tool-options.constants';
import type { OptionSpec } from '../tool-options.type';

const tools = () => useToolStore.getState();

const asArea = (value: unknown): FillMode => (value === 'global' ? 'global' : 'contiguous');

const asNeighbours = (value: unknown): Connectivity => (String(value) === '8' ? 8 : 4);

const FILL_OPTIONS: readonly OptionSpec[] = [
  {
    id: 'fill.area',
    name: 'area',
    tool: 'fill',
    surface: 'paint',
    memory: 'global',
    kind: 'choice',
    label: OPTION_TEXT.fillArea,
    description: OPTION_TEXT.fillAreaDescription,
    tier: 1,
    priority: 10,
    group: 'area',
    default: 'contiguous',
    choices: FILL_AREA_CHOICES,
    command: OPTION_COMMAND.fillArea,
    flyout: true,
    read: () => tools().fillMode,
    write: (value) => tools().setFillMode(asArea(value)),
  },
  {
    id: 'fill.neighbours',
    name: 'neighbours',
    tool: 'fill',
    surface: 'paint',
    memory: 'global',
    kind: 'choice',
    label: OPTION_TEXT.neighbours,
    description: OPTION_TEXT.neighboursDescription,
    tier: 1,
    priority: 20,
    group: 'area',
    default: '4',
    choices: NEIGHBOUR_CHOICES,
    command: OPTION_COMMAND.fillNeighbours,
    flyout: true,
    read: () => String(tools().connectivity),
    write: (value) => tools().setConnectivity(asNeighbours(value)),
  },
];

export { FILL_OPTIONS };
