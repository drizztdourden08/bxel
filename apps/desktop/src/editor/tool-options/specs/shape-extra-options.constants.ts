/* @layer renderer-app @kind constants */
import { FILLED_TOOLS } from '../../../keymap/drawing-command-id.constants';
import { CORNER_RADIUS } from '../../../stores/drawing-store.constants';
import type { FillColour } from '../../../stores/drawing-store.type';
import { useDrawingStore } from '../../../stores/useDrawingStore';
import type { OptionSpec } from '../tool-options.type';
import { choiceSpec } from './choice-spec';
import { DRAWING_TEXT, FILL_COLOUR_CHOICES } from './drawing-text.constants';
import { numberSpec } from './number-spec';
import { TILE_CENTRE_TEXT } from './tile-centre-text.constants';
import { toggleSpec } from './toggle-spec';

const d = () => useDrawingStore.getState();

const filledSpecs = (tool: (typeof FILLED_TOOLS)[number]): OptionSpec[] => [
  toggleSpec({
    tool, name: 'filled', label: DRAWING_TEXT.filled, description: DRAWING_TEXT.filledDescription, priority: 20, group: 'shape', default: tool === 'contour',
    icon: 'pixel-shape-rect-filled', read: () => d().filled[tool], write: (on) => d().setFilled(tool, on),
  }),
  choiceSpec({
    tool, name: 'fill_colour', label: DRAWING_TEXT.fillColour, description: DRAWING_TEXT.fillColourDescription, priority: 21, group: 'shape', default: 'same',
    choices: FILL_COLOUR_CHOICES, read: () => d().fillColour, write: (value) => d().patch({ fillColour: value as FillColour }), appliesWhen: () => d().filled[tool],
  }),
];

const centreSpec = (tool: 'line' | 'rect' | 'ellipse'): OptionSpec =>
  toggleSpec({
    tool, name: 'from_centre', label: TILE_CENTRE_TEXT.fromCentre, description: TILE_CENTRE_TEXT.fromCentreDescription, priority: 27, group: 'shape', tier: 2,
    icon: 'maximize-2', read: () => d().shapeFromCentre, write: (on) => d().patch({ shapeFromCentre: on }),
  });

const EXTRAS: readonly OptionSpec[] = [
  numberSpec({
    tool: 'rect', name: 'radius', label: DRAWING_TEXT.radius, description: DRAWING_TEXT.radiusDescription, priority: 25, group: 'shape', default: 0,
    min: CORNER_RADIUS.min, max: CORNER_RADIUS.max, read: () => d().cornerRadius, write: (value) => d().patch({ cornerRadius: value }),
  }),
  toggleSpec({
    tool: 'line', name: 'even_steps', label: DRAWING_TEXT.evenSteps, description: DRAWING_TEXT.evenStepsDescription, priority: 25, group: 'shape',
    icon: 'pixel-shape-line', read: () => d().evenSteps, write: (on) => d().patch({ evenSteps: on }),
  }),
  toggleSpec({
    tool: 'curve', name: 'perfect', label: DRAWING_TEXT.perfect, description: DRAWING_TEXT.perfectDescription, priority: 25, group: 'shape', default: true,
    read: () => d().curvePerfect, write: (on) => d().patch({ curvePerfect: on }),
  }),
  toggleSpec({
    tool: 'curve', name: 'cubic', label: DRAWING_TEXT.cubic, description: DRAWING_TEXT.cubicDescription, priority: 26, group: 'shape',
    icon: 'pixel-shape-curve', read: () => d().curveCubic, write: (on) => d().patch({ curveCubic: on }),
  }),
  toggleSpec({
    tool: 'contour', name: 'perfect', label: DRAWING_TEXT.perfect, description: DRAWING_TEXT.perfectDescription, priority: 25, group: 'shape',
    read: () => d().contourPerfect, write: (on) => d().patch({ contourPerfect: on }),
  }),
];

const SHAPE_EXTRA_OPTIONS: readonly OptionSpec[] = [...FILLED_TOOLS.flatMap(filledSpecs), ...EXTRAS, centreSpec('line'), centreSpec('rect'), centreSpec('ellipse')];

export { SHAPE_EXTRA_OPTIONS };
