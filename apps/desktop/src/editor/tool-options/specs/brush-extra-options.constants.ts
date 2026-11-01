/* @layer renderer-app @kind constants */
import { BRUSH_SPACING_MAX, BRUSH_SPACING_MIN } from '@bxel/raster';
import { BRUSH_ANGLE_TOOLS, LOCK_TOOLS } from '../../../keymap/drawing-command-id.constants';
import { useDrawingStore } from '../../../stores/useDrawingStore';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import type { OptionSpec } from '../tool-options.type';
import { brushChoices } from './brush-choices';
import { choiceSpec } from './choice-spec';
import { DRAWING_TEXT, TURN_CHOICES } from './drawing-text.constants';
import { numberSpec } from './number-spec';
import { toggleSpec } from './toggle-spec';

const d = () => useDrawingStore.getState();

const hasBrush = (): boolean => d().brushId !== null;

const asTurn = (value: string): 0 | 90 | 180 | 270 => {
  if (value === '90' || value === '180' || value === '270') return Number(value) as 90 | 180 | 270;
  return 0;
};

const BRUSH_EXTRAS: readonly OptionSpec[] = [
  choiceSpec({
    tool: 'pencil', name: 'custom_brush', label: DRAWING_TEXT.customBrush, description: DRAWING_TEXT.customBrushDescription, priority: 45, group: 'brush', default: '',
    choices: brushChoices, read: () => d().brushId ?? '', write: (value) => d().patch({ brushId: value === '' ? null : value }),
  }),
  toggleSpec({
    tool: 'pencil', name: 'brush_stencil', label: DRAWING_TEXT.brushStencil, description: DRAWING_TEXT.brushStencilDescription, priority: 46, group: 'brush', tier: 2,
    icon: 'pixel-brush-custom', read: () => d().brushMode === 'stencil', write: (on) => d().patch({ brushMode: on ? 'stencil' : 'colour' }), appliesWhen: hasBrush,
  }),
  toggleSpec({
    tool: 'pencil', name: 'brush_flip_x', label: DRAWING_TEXT.brushFlipX, description: DRAWING_TEXT.brushFlipXDescription, priority: 47, group: 'brush', tier: 2,
    icon: 'pixel-flip-h', read: () => d().brushFlipX, write: (on) => d().patch({ brushFlipX: on }), appliesWhen: hasBrush,
  }),
  toggleSpec({
    tool: 'pencil', name: 'brush_flip_y', label: DRAWING_TEXT.brushFlipY, description: DRAWING_TEXT.brushFlipYDescription, priority: 48, group: 'brush', tier: 2,
    icon: 'pixel-flip-v', read: () => d().brushFlipY, write: (on) => d().patch({ brushFlipY: on }), appliesWhen: hasBrush,
  }),
  choiceSpec({
    tool: 'pencil', name: 'brush_turn', label: DRAWING_TEXT.brushTurn, description: DRAWING_TEXT.brushTurnDescription, priority: 49, group: 'brush', tier: 2, default: '0',
    choices: TURN_CHOICES, read: () => String(d().brushTurn), write: (value) => d().patch({ brushTurn: asTurn(value) }), appliesWhen: hasBrush,
  }),
];

const SPACING_LIMITS = { min: BRUSH_SPACING_MIN, max: BRUSH_SPACING_MAX } as const;

/** The saved brush as the tip of every brush tool but the pencil, which stamps it. */
const TIP_OPTIONS: readonly OptionSpec[] = BRUSH_ANGLE_TOOLS.filter((tool) => tool !== 'pencil').map((tool) =>
  choiceSpec({
    tool, name: 'custom_brush', label: DRAWING_TEXT.customBrush, description: DRAWING_TEXT.customBrushDescription, priority: 45, group: 'brush', default: '',
    choices: brushChoices, read: () => d().brushId ?? '', write: (value) => d().patch({ brushId: value === '' ? null : value }),
  }),
);

const SPACING_OPTIONS: readonly OptionSpec[] = BRUSH_ANGLE_TOOLS.map((tool) =>
  numberSpec({
    tool, name: 'brush_spacing', label: DRAWING_TEXT.brushSpacing, description: DRAWING_TEXT.brushSpacingDescription, priority: 44, group: 'brush', tier: 2,
    default: SPACING_LIMITS.min, min: SPACING_LIMITS.min, max: SPACING_LIMITS.max, read: () => d().brushSpacing,
    write: (value) => d().patch({ brushSpacing: Math.min(SPACING_LIMITS.max, Math.max(SPACING_LIMITS.min, Math.round(value))) }), appliesWhen: hasBrush,
  }),
);

const LOCK_OPTIONS: readonly OptionSpec[] = LOCK_TOOLS.map((tool) =>
  toggleSpec({
    tool, name: 'lock_tile', label: DRAWING_TEXT.lockTile, description: DRAWING_TEXT.lockTileDescription, priority: 60, group: 'tile', icon: 'lock',
    read: () => d().lockToTile, write: (on) => d().patch({ lockToTile: on }), appliesWhen: () => useTilemapStore.getState().editMode === 'edit',
  }),
);

export { BRUSH_EXTRAS, LOCK_OPTIONS, SPACING_OPTIONS, TIP_OPTIONS };
