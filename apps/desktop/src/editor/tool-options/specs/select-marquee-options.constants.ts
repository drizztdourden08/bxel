/* @layer renderer-app @kind constants */
import { FIXED_LIMIT } from '../../../stores/selection-store.constants';
import { useSelectionStore } from '../../../stores/useSelectionStore';
import type { FixedMarquee, PasteColours, VertexSnap } from '../../selection/selection.type';
import type { OptionSpec } from '../tool-options.type';
import { choiceSpec } from './choice-spec';
import { numberSpec } from './number-spec';
import { FIXED_CHOICES, MARQUEE_TEXT, PASTE_COLOUR_CHOICES, VERTEX_SNAP_CHOICES } from './select-marquee-text.constants';
import { toggleSpec } from './toggle-spec';

const selection = () => useSelectionStore.getState();

const isMarquee = (): boolean => selection().variant === 'rect' || selection().variant === 'ellipse';

const isFixed = (): boolean => isMarquee() && selection().fixed !== 'free';

const mirrors = (): boolean => selection().variant !== 'wand' && selection().variant !== 'colour';

const asFixed = (value: string): FixedMarquee => (value === 'ratio' || value === 'size' ? value : 'free');

const asVertexSnap = (value: string): VertexSnap => (value === 'corner' ? 'corner' : 'centre');

const asPasteColours = (value: string): PasteColours => (value === 'keep' ? 'keep' : 'nearest');

const isFreehand = (): boolean => selection().variant === 'lasso' || selection().variant === 'polygon';

const SELECT_MARQUEE_OPTIONS: readonly OptionSpec[] = [
  choiceSpec({
    tool: 'select',
    name: 'fixed',
    label: MARQUEE_TEXT.fixed,
    description: MARQUEE_TEXT.fixedDescription,
    priority: 12,
    group: 'select',
    default: 'free',
    choices: FIXED_CHOICES,
    read: () => selection().fixed,
    write: (value) => selection().setFixed(asFixed(value)),
    appliesWhen: isMarquee,
  }),
  numberSpec({
    tool: 'select',
    name: 'fixed_width',
    label: MARQUEE_TEXT.width,
    description: MARQUEE_TEXT.widthDescription,
    priority: 14,
    group: 'select',
    default: 16,
    min: 1,
    max: FIXED_LIMIT,
    read: () => selection().fixedWidth,
    write: (value) => selection().setFixedWidth(value),
    appliesWhen: isFixed,
  }),
  numberSpec({
    tool: 'select',
    name: 'fixed_height',
    label: MARQUEE_TEXT.height,
    description: MARQUEE_TEXT.heightDescription,
    priority: 16,
    group: 'select',
    default: 16,
    min: 1,
    max: FIXED_LIMIT,
    read: () => selection().fixedHeight,
    write: (value) => selection().setFixedHeight(value),
    appliesWhen: isFixed,
  }),
  toggleSpec({
    tool: 'select',
    name: 'mirror',
    label: MARQUEE_TEXT.mirror,
    description: MARQUEE_TEXT.mirrorDescription,
    priority: 18,
    group: 'select',
    default: true,
    icon: 'pixel-mirror-x',
    read: () => selection().mirror,
    write: (on) => selection().setMirror(on),
    appliesWhen: mirrors,
  }),
  choiceSpec({
    tool: 'select',
    name: 'vertex_snap',
    label: MARQUEE_TEXT.vertexSnap,
    description: MARQUEE_TEXT.vertexSnapDescription,
    priority: 19,
    group: 'select',
    default: 'centre',
    choices: VERTEX_SNAP_CHOICES,
    read: () => selection().vertexSnap,
    write: (value) => selection().setVertexSnap(asVertexSnap(value)),
    appliesWhen: isFreehand,
  }),
  choiceSpec({
    tool: 'select',
    name: 'paste_colours',
    label: MARQUEE_TEXT.pasteColours,
    description: MARQUEE_TEXT.pasteColoursDescription,
    priority: 21,
    group: 'select',
    default: 'nearest',
    choices: PASTE_COLOUR_CHOICES,
    read: () => selection().pasteColours,
    write: (value) => selection().setPasteColours(asPasteColours(value)),
  }),
];

export { SELECT_MARQUEE_OPTIONS };
