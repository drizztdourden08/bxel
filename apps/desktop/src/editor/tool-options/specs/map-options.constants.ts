/* @layer renderer-app @kind constants */
import { SELECTION_COMMAND_ID } from '../../../keymap/selection-command-id.constants';
import { TERRAIN_COMMAND } from '../../../keymap/terrain-command-id.constants';
import { TILEMAP_COMMAND } from '../../../keymap/tilemap-command-id.constants';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { clearCells } from '../../../tilemap/clear-cells';
import { makeUnique } from '../../../tilemap/make-unique';
import { replaceCells } from '../../../tilemap/replace-cells';
import { turnCells } from '../../../tilemap/turn-cells';
import type { ToolId } from '../../tool.type';
import { OPTION_TEXT } from '../tool-options.constants';
import type { OptionSpec } from '../tool-options.type';
import type { CellAction, TurnSpec } from './map-options.type';

const TURNS: readonly TurnSpec[] = [
  { op: 'flipX', flag: 'flipX', name: 'flip_x', label: OPTION_TEXT.flipX, description: OPTION_TEXT.flipXDescription, icon: 'pixel-flip-tile-x', command: SELECTION_COMMAND_ID.flipHorizontal, priority: 10 },
  { op: 'flipY', flag: 'flipY', name: 'flip_y', label: OPTION_TEXT.flipY, description: OPTION_TEXT.flipYDescription, icon: 'pixel-flip-tile-y', command: SELECTION_COMMAND_ID.flipVertical, priority: 20 },
  { op: 'turn', flag: 'diagonal', name: 'rotate', label: OPTION_TEXT.turn, description: OPTION_TEXT.turnDescription, icon: 'pixel-turn-right', command: SELECTION_COMMAND_ID.turnClockwise, priority: 30 },
];

const CELL_ACTIONS: readonly CellAction[] = [
  { name: 'replace_in', label: OPTION_TEXT.replaceIn, description: OPTION_TEXT.replaceInDescription, icon: 'square', command: TILEMAP_COMMAND.replaceSelection, priority: 50, run: () => replaceCells(false) },
  { name: 'replace_all', label: OPTION_TEXT.replaceAll, description: OPTION_TEXT.replaceAllDescription, icon: 'layout-grid', command: TILEMAP_COMMAND.replaceEverywhere, priority: 60, run: () => replaceCells(true) },
  { name: 'unique', label: OPTION_TEXT.unique, description: OPTION_TEXT.uniqueDescription, icon: 'pixel-tile-unique', command: TILEMAP_COMMAND.makeUnique, priority: 70, run: makeUnique },
  { name: 'clear', label: OPTION_TEXT.clear, description: OPTION_TEXT.clearDescription, icon: 'pixel-map-erase', command: TILEMAP_COMMAND.clearCells, priority: 80, run: clearCells },
];

const maps = () => useTilemapStore.getState();

const mapBase = (tool: ToolId, member: string, name: string) => ({
  id: `map.${member}.${name}`,
  name,
  tool,
  surface: 'map' as const,
  memory: 'global' as const,
});

const turnOptions = (tool: ToolId, member: string): OptionSpec[] =>
  TURNS.map((turn) => ({
    ...mapBase(tool, member, turn.name),
    kind: 'toggle',
    label: turn.label,
    description: turn.description,
    tier: 1,
    priority: turn.priority,
    group: 'turn',
    default: false,
    icon: turn.icon,
    shortcuts: [{ command: turn.command }],
    read: () => maps().flags[turn.flag],
    write: () => turnCells(turn.op),
  }));

const terrainOption = (tool: ToolId, member: string): OptionSpec => ({
  ...mapBase(tool, member, 'terrain'),
  kind: 'toggle',
  label: OPTION_TEXT.terrain,
  description: OPTION_TEXT.terrainDescription,
  tier: 1,
  priority: 40,
  group: 'terrain',
  default: false,
  icon: 'pixel-map-paint',
  caption: OPTION_TEXT.terrain,
  shortcuts: [{ command: TERRAIN_COMMAND.toggleBrush }],
  read: () => maps().terrainBrush,
  write: (value) => maps().setTerrainBrush(value === true),
});

const filledOption: OptionSpec = {
  ...mapBase('shape', 'rect', 'filled'),
  kind: 'toggle',
  label: OPTION_TEXT.filled,
  description: OPTION_TEXT.mapFilledDescription,
  tier: 1,
  priority: 5,
  group: 'shape',
  default: false,
  icon: 'pixel-shape-rect-filled',
  caption: OPTION_TEXT.filled,
  read: () => maps().filled,
  write: (value) => maps().setFilled(value === true),
};

const cellAction = (action: CellAction): OptionSpec => ({
  ...mapBase('select', 'select', action.name),
  kind: 'action',
  label: action.label,
  description: action.description,
  tier: 1,
  priority: action.priority,
  group: 'actions',
  default: false,
  icon: action.icon,
  caption: action.label,
  shortcuts: [{ command: action.command }],
  read: () => false,
  write: () => void action.run(),
  disabledReason: () => (maps().selection === null ? OPTION_TEXT.needSelection : undefined),
});

const MAP_OPTIONS: readonly OptionSpec[] = [
  ...turnOptions('pencil', 'place'),
  terrainOption('pencil', 'place'),
  terrainOption('eraser', 'erase'),
  ...turnOptions('fill', 'fill'),
  terrainOption('fill', 'fill'),
  filledOption,
  ...turnOptions('shape', 'rect'),
  terrainOption('shape', 'rect'),
  ...turnOptions('select', 'select'),
  ...CELL_ACTIONS.map(cellAction),
];

export { MAP_OPTIONS };
