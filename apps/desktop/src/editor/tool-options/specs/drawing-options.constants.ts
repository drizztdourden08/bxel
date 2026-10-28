/* @layer renderer-app @kind constants */
import type { DitherPattern, GradientPattern } from '@bxel/raster';
import { FILLED_TOOLS, INK_COMMAND, INK_TOOLS, LOCK_TOOLS } from '../../../keymap/drawing-command-id.constants';
import { SPRAY_LIMITS, CORNER_RADIUS } from '../../../stores/drawing-store.constants';
import type { FillColour, FillMatch, FillSample, FilledTool, GradientMode, InkKind, PickSample } from '../../../stores/drawing-store.type';
import { useDrawingStore } from '../../../stores/useDrawingStore';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import type { ToolId } from '../../tool.type';
import type { OptionBase, OptionSpec } from '../tool-options.type';
import { brushChoices, rampChoices } from './drawing-live';
import {
  BAYER_SIZE_CHOICES, DITHER_PATTERN_CHOICES, DRAWING_TEXT, FILL_COLOUR_CHOICES, FILL_MATCH_CHOICES, FILL_SAMPLE_CHOICES, GRADIENT_KIND_CHOICES, GRADIENT_MODE_CHOICES,
  GRADIENT_PATTERN_CHOICES, INK_CHOICES, PICK_SAMPLE_CHOICES, SHADE_MODE_CHOICES, TURN_CHOICES,
} from './drawing-text.constants';

const d = () => useDrawingStore.getState();

const base = (tool: ToolId): OptionBase => ({ tool, surface: 'paint', memory: 'global' });

const SHADING: readonly InkKind[] = ['shade', 'lighten', 'darken'];

const asInk = (value: unknown): InkKind => INK_CHOICES.find((choice) => choice.value === value)?.value as InkKind | undefined ?? 'normal';

const editingTile = (): boolean => useTilemapStore.getState().editMode === 'edit';

const inkOptions = (tool: (typeof INK_TOOLS)[number]): OptionSpec[] => [
  {
    ...base(tool),
    id: `${tool}.ink`,
    name: 'ink',
    kind: 'choice',
    label: DRAWING_TEXT.ink,
    description: DRAWING_TEXT.inkDescription,
    tier: 1,
    priority: 50,
    group: 'ink',
    default: 'normal',
    choices: INK_CHOICES,
    command: INK_COMMAND,
    chord: 'Shift+S',
    read: () => d().inkKind,
    write: (value) => d().patch({ inkKind: asInk(value) }),
  },
  {
    ...base(tool),
    id: `${tool}.dither_pattern`,
    name: 'dither_pattern',
    kind: 'choice',
    label: DRAWING_TEXT.ditherPattern,
    description: DRAWING_TEXT.ditherPatternDescription,
    tier: 2,
    priority: 52,
    group: 'ink',
    default: 'checker',
    choices: DITHER_PATTERN_CHOICES,
    read: () => d().ditherPattern,
    write: (value) => d().patch({ ditherPattern: String(value) as DitherPattern }),
    appliesWhen: () => d().inkKind === 'dither',
  },
  {
    ...base(tool),
    id: `${tool}.dither_level`,
    name: 'dither_level',
    kind: 'number',
    label: DRAWING_TEXT.ditherLevel,
    description: DRAWING_TEXT.ditherLevelDescription,
    tier: 2,
    priority: 53,
    group: 'ink',
    default: 8,
    min: 1,
    max: 15,
    step: 1,
    read: () => d().ditherLevel,
    write: (value) => d().patch({ ditherLevel: Number(value) }),
    appliesWhen: () => d().inkKind === 'dither' && d().ditherPattern === 'bayer',
  },
  {
    ...base(tool),
    id: `${tool}.shade_steps`,
    name: 'shade_steps',
    kind: 'number',
    label: DRAWING_TEXT.shadeSteps,
    description: DRAWING_TEXT.shadeStepsDescription,
    tier: 2,
    priority: 54,
    group: 'ink',
    default: 1,
    min: 1,
    max: 4,
    step: 1,
    read: () => d().shadeSteps,
    write: (value) => d().patch({ shadeSteps: Number(value) }),
    appliesWhen: () => SHADING.includes(d().inkKind),
  },
  {
    ...base(tool),
    id: `${tool}.shade_ramp`,
    name: 'shade_ramp',
    kind: 'choice',
    label: DRAWING_TEXT.shadeRamp,
    description: DRAWING_TEXT.shadeRampDescription,
    tier: 2,
    priority: 55,
    group: 'ink',
    default: '',
    get choices() {
      return rampChoices();
    },
    read: () => d().shadeRamp ?? '',
    write: (value) => d().patch({ shadeRamp: value === '' ? null : String(value) }),
    appliesWhen: () => d().inkKind === 'shade',
  },
];

const filledOptions = (tool: FilledTool): OptionSpec[] => [
  {
    ...base(tool),
    id: `${tool}.filled`,
    name: 'filled',
    kind: 'toggle',
    label: DRAWING_TEXT.filled,
    description: DRAWING_TEXT.filledDescription,
    tier: 1,
    priority: 20,
    group: 'shape',
    default: tool === 'contour',
    icon: 'pixel-shape-rect-filled',
    caption: DRAWING_TEXT.filled,
    read: () => d().filled[tool],
    write: (value) => d().setFilled(tool, value === true),
  },
  {
    ...base(tool),
    id: `${tool}.fill_colour`,
    name: 'fill_colour',
    kind: 'choice',
    label: DRAWING_TEXT.fillColour,
    description: DRAWING_TEXT.fillColourDescription,
    tier: 1,
    priority: 21,
    group: 'shape',
    default: 'same',
    choices: FILL_COLOUR_CHOICES,
    read: () => d().fillColour,
    write: (value) => d().patch({ fillColour: String(value) as FillColour }),
    appliesWhen: () => d().filled[tool],
  },
];

const toggle = (tool: ToolId, name: string, label: string, description: string, priority: number, read: () => boolean, write: (on: boolean) => void): OptionSpec => ({
  ...base(tool),
  id: `${tool}.${name}`,
  name,
  kind: 'toggle',
  label,
  description,
  tier: 1,
  priority,
  group: 'shape',
  default: false,
  icon: 'pixel-pixel-perfect',
  caption: label,
  read,
  write: (value) => write(value === true),
});

const shapeExtras: OptionSpec[] = [
  {
    ...base('rect'),
    id: 'rect.radius',
    name: 'radius',
    kind: 'number',
    label: DRAWING_TEXT.radius,
    description: DRAWING_TEXT.radiusDescription,
    tier: 1,
    priority: 25,
    group: 'shape',
    default: 0,
    min: CORNER_RADIUS.min,
    max: CORNER_RADIUS.max,
    step: 1,
    read: () => d().cornerRadius,
    write: (value) => d().patch({ cornerRadius: Number(value) }),
  },
  { ...toggle('line', 'even_steps', DRAWING_TEXT.evenSteps, DRAWING_TEXT.evenStepsDescription, 25, () => d().evenSteps, (on) => d().patch({ evenSteps: on })), icon: 'pixel-shape-line' },
  { ...toggle('curve', 'perfect', DRAWING_TEXT.perfect, DRAWING_TEXT.perfectDescription, 25, () => d().curvePerfect, (on) => d().patch({ curvePerfect: on })), default: true },
  toggle('contour', 'perfect', DRAWING_TEXT.perfect, DRAWING_TEXT.perfectDescription, 25, () => d().contourPerfect, (on) => d().patch({ contourPerfect: on })),
];

const choice = (tool: ToolId, name: string, spec: Pick<OptionSpec, 'label' | 'description' | 'choices' | 'default' | 'tier' | 'priority' | 'group' | 'read' | 'write'> & Partial<OptionSpec>): OptionSpec => ({
  ...base(tool),
  id: `${tool}.${name}`,
  name,
  kind: 'choice',
  ...spec,
});

const shadeOptions: OptionSpec[] = [
  choice('shade', 'mode', {
    label: DRAWING_TEXT.shadeMode, description: DRAWING_TEXT.shadeModeDescription, choices: SHADE_MODE_CHOICES, default: 'shade', tier: 1, priority: 40, group: 'ink',
    read: () => d().shadeMode, write: (value) => d().patch({ shadeMode: value === 'lighten' || value === 'darken' ? value : 'shade' }),
  }),
  {
    ...base('shade'),
    id: 'shade.steps',
    name: 'steps',
    kind: 'number',
    label: DRAWING_TEXT.shadeSteps,
    description: DRAWING_TEXT.shadeStepsDescription,
    tier: 1,
    priority: 41,
    group: 'ink',
    default: 1,
    min: 1,
    max: 4,
    step: 1,
    read: () => d().shadeSteps,
    write: (value) => d().patch({ shadeSteps: Number(value) }),
  },
  {
    ...base('shade'),
    id: 'shade.ramp',
    name: 'ramp',
    kind: 'choice',
    label: DRAWING_TEXT.shadeRamp,
    description: DRAWING_TEXT.shadeRampDescription,
    tier: 2,
    priority: 42,
    group: 'ink',
    default: '',
    get choices() {
      return rampChoices();
    },
    read: () => d().shadeRamp ?? '',
    write: (value) => d().patch({ shadeRamp: value === '' ? null : String(value) }),
    appliesWhen: () => d().shadeMode === 'shade',
  },
];

const toolExtras: OptionSpec[] = [
  choice('picker', 'sample', {
    label: DRAWING_TEXT.pickSample, description: DRAWING_TEXT.pickSampleDescription, choices: PICK_SAMPLE_CHOICES, default: 'visible', tier: 1, priority: 10, group: 'pick',
    read: () => d().pickSample, write: (value) => d().patch({ pickSample: String(value) as PickSample }),
  }),
  choice('fill', 'sample', {
    label: DRAWING_TEXT.fillSample, description: DRAWING_TEXT.fillSampleDescription, choices: FILL_SAMPLE_CHOICES, default: 'layer', tier: 2, priority: 30, group: 'area',
    read: () => d().fillSample, write: (value) => d().patch({ fillSample: String(value) as FillSample }),
  }),
  choice('fill', 'match', {
    label: DRAWING_TEXT.fillMatch, description: DRAWING_TEXT.fillMatchDescription, choices: FILL_MATCH_CHOICES, default: 'index', tier: 2, priority: 31, group: 'area',
    read: () => d().fillMatch, write: (value) => d().patch({ fillMatch: String(value) as FillMatch }),
  }),
  {
    ...base('spray'),
    id: 'spray.size',
    name: 'size',
    kind: 'number',
    label: DRAWING_TEXT.sprayRadius,
    description: DRAWING_TEXT.sprayRadiusDescription,
    tier: 1,
    priority: 10,
    group: 'spray',
    default: 8,
    min: SPRAY_LIMITS.sizeMin,
    max: SPRAY_LIMITS.sizeMax,
    step: 1,
    read: () => d().spraySize,
    write: (value) => d().patch({ spraySize: Number(value) }),
  },
  {
    ...base('spray'),
    id: 'spray.density',
    name: 'density',
    kind: 'number',
    label: DRAWING_TEXT.sprayDensity,
    description: DRAWING_TEXT.sprayDensityDescription,
    tier: 1,
    priority: 11,
    group: 'spray',
    default: 6,
    min: SPRAY_LIMITS.densityMin,
    max: SPRAY_LIMITS.densityMax,
    step: 1,
    read: () => d().sprayDensity,
    write: (value) => d().patch({ sprayDensity: Number(value) }),
  },
  {
    ...base('spray'),
    id: 'spray.seed',
    name: 'seed',
    kind: 'toggle',
    label: DRAWING_TEXT.spraySeed,
    description: DRAWING_TEXT.spraySeedDescription,
    tier: 2,
    priority: 12,
    group: 'spray',
    default: false,
    icon: 'lock',
    caption: DRAWING_TEXT.spraySeed,
    read: () => d().spraySeed !== null,
    write: (value) => d().patch({ spraySeed: value === true ? 1 : null }),
  },
  {
    ...base('spray'),
    id: 'map.spray.seed',
    name: 'seed',
    surface: 'map',
    kind: 'toggle',
    label: DRAWING_TEXT.scatterSeed,
    description: DRAWING_TEXT.scatterSeedDescription,
    tier: 1,
    priority: 12,
    group: 'spray',
    default: false,
    icon: 'lock',
    caption: DRAWING_TEXT.scatterSeed,
    read: () => d().spraySeed !== null,
    write: (value) => d().patch({ spraySeed: value === true ? 1 : null }),
  },
];

const gradientOptions: OptionSpec[] = [
  choice('gradient', 'kind', {
    label: DRAWING_TEXT.gradientKind, description: DRAWING_TEXT.gradientKindDescription, choices: GRADIENT_KIND_CHOICES, default: 'linear', tier: 1, priority: 10, group: 'gradient',
    read: () => d().gradientKind, write: (value) => d().patch({ gradientKind: value === 'radial' ? 'radial' : 'linear' }),
  }),
  choice('gradient', 'mode', {
    label: DRAWING_TEXT.gradientMode, description: DRAWING_TEXT.gradientModeDescription, choices: GRADIENT_MODE_CHOICES, default: 'bands', tier: 1, priority: 11, group: 'gradient',
    read: () => d().gradientMode, write: (value) => d().patch({ gradientMode: String(value) as GradientMode }),
  }),
  choice('gradient', 'pattern', {
    label: DRAWING_TEXT.gradientPattern, description: DRAWING_TEXT.gradientPatternDescription, choices: GRADIENT_PATTERN_CHOICES, default: 'bayer', tier: 1, priority: 12, group: 'gradient',
    read: () => d().gradientPattern, write: (value) => d().patch({ gradientPattern: String(value) as GradientPattern }),
    appliesWhen: () => d().gradientMode === 'dither',
  }),
  choice('gradient', 'size', {
    label: DRAWING_TEXT.gradientSize, description: DRAWING_TEXT.gradientSizeDescription, choices: BAYER_SIZE_CHOICES, default: '4', tier: 2, priority: 13, group: 'gradient',
    read: () => String(d().gradientSize), write: (value) => d().patch({ gradientSize: Number(value) === 2 ? 2 : Number(value) === 8 ? 8 : 4 }),
    appliesWhen: () => d().gradientMode === 'dither' && d().gradientPattern === 'bayer',
  }),
  toggle('gradient', 'reflect', DRAWING_TEXT.gradientReflect, DRAWING_TEXT.gradientReflectDescription, 14, () => d().gradientReflect, (on) => d().patch({ gradientReflect: on })),
  {
    ...base('gradient'),
    id: 'gradient.ramp',
    name: 'ramp',
    kind: 'choice',
    label: DRAWING_TEXT.gradientRamp,
    description: DRAWING_TEXT.gradientRampDescription,
    tier: 2,
    priority: 15,
    group: 'gradient',
    default: '',
    get choices() {
      return rampChoices();
    },
    read: () => d().gradientRamp ?? '',
    write: (value) => d().patch({ gradientRamp: value === '' ? null : String(value) }),
  },
];

const brushOptions: OptionSpec[] = [
  {
    ...base('pencil'),
    id: 'pencil.custom_brush',
    name: 'custom_brush',
    kind: 'choice',
    label: DRAWING_TEXT.customBrush,
    description: DRAWING_TEXT.customBrushDescription,
    tier: 1,
    priority: 45,
    group: 'brush',
    default: '',
    get choices() {
      return brushChoices();
    },
    read: () => d().brushId ?? '',
    write: (value) => d().patch({ brushId: value === '' ? null : String(value) }),
  },
  {
    ...toggle('pencil', 'brush_stencil', DRAWING_TEXT.brushStencil, DRAWING_TEXT.brushStencilDescription, 46, () => d().brushMode === 'stencil', (on) => d().patch({ brushMode: on ? 'stencil' : 'colour' })),
    group: 'brush',
    icon: 'pixel-brush-square',
    tier: 2,
    appliesWhen: () => d().brushId !== null,
  },
  {
    ...toggle('pencil', 'brush_flip_x', DRAWING_TEXT.brushFlipX, DRAWING_TEXT.brushFlipXDescription, 47, () => d().brushFlipX, (on) => d().patch({ brushFlipX: on })),
    group: 'brush',
    icon: 'pixel-flip-h',
    tier: 2,
    appliesWhen: () => d().brushId !== null,
  },
  {
    ...toggle('pencil', 'brush_flip_y', DRAWING_TEXT.brushFlipY, DRAWING_TEXT.brushFlipYDescription, 48, () => d().brushFlipY, (on) => d().patch({ brushFlipY: on })),
    group: 'brush',
    icon: 'pixel-flip-v',
    tier: 2,
    appliesWhen: () => d().brushId !== null,
  },
  choice('pencil', 'brush_turn', {
    label: DRAWING_TEXT.brushTurn, description: DRAWING_TEXT.brushTurnDescription, choices: TURN_CHOICES, default: '0', tier: 2, priority: 49, group: 'brush',
    read: () => String(d().brushTurn), write: (value) => d().patch({ brushTurn: [90, 180, 270].includes(Number(value)) ? (Number(value) as 90 | 180 | 270) : 0 }),
    appliesWhen: () => d().brushId !== null,
  }),
];

const lockOptions = (tool: (typeof LOCK_TOOLS)[number]): OptionSpec => ({
  ...toggle(tool, 'lock_tile', DRAWING_TEXT.lockTile, DRAWING_TEXT.lockTileDescription, 60, () => d().lockToTile, (on) => d().patch({ lockToTile: on })),
  group: 'tile',
  icon: 'lock',
  appliesWhen: editingTile,
});

const DRAWING_OPTIONS: readonly OptionSpec[] = [
  ...INK_TOOLS.flatMap(inkOptions),
  ...FILLED_TOOLS.flatMap(filledOptions),
  ...shapeExtras,
  ...shadeOptions,
  ...toolExtras,
  ...gradientOptions,
  ...brushOptions,
  ...LOCK_TOOLS.map(lockOptions),
];

export { DRAWING_OPTIONS };
