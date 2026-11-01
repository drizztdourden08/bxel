/* @layer renderer-app @kind constants */
import { FIXED_LIMIT } from '../../../stores/selection-store.constants';
import { useSelectionStore } from '../../../stores/useSelectionStore';
import type { FixedMarquee } from '../../selection/selection.type';
import type { OptionSpec } from '../tool-options.type';
import { choiceSpec } from './choice-spec';
import { numberSpec } from './number-spec';
import { FIXED_CHOICES, MARQUEE_TEXT } from './select-marquee-text.constants';
import { toggleSpec } from './toggle-spec';

const selection = () => useSelectionStore.getState();

const isMarquee = (): boolean => selection().variant === 'rect' || selection().variant === 'ellipse';

const isFixed = (): boolean => isMarquee() && selection().fixed !== 'free';

const mirrors = (): boolean => selection().variant !== 'wand' && selection().variant !== 'colour';

const asFixed = (value: string): FixedMarquee => (value === 'ratio' || value === 'size' ? value : 'free');

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
];

export { SELECT_MARQUEE_OPTIONS };
