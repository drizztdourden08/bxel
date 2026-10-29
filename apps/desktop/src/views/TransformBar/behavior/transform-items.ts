/* @layer renderer-app @kind logic */
import { ALGORITHM_LABELS, ALGORITHM_NOTES } from '@bxel/raster';
import type { ToolbarChoice, ToolbarItem } from '@drizztdourden08/tessera';
import { Text } from '@drizztdourden08/tessera';
import { createElement } from 'react';
import { flipInSession } from '../../../editor/transform/flip-in-session';
import { reviseTransform } from '../../../editor/transform/revise-transform';
import { IDENTITY } from '../../../editor/transform/transform.constants';
import { turnInSession } from '../../../editor/transform/turn-in-session';
import type { TransformSpec } from '../../../editor/transform/transform.type';
import { BOUNDS_BAR_CHOICES, BOUNDS_BAR_NOTES, METHOD_CHOICES, METHOD_GLYPHS, OVERFLOW_GLYPHS, TRANSFORM_BAR_TEXT } from '../TransformBar.constants';

const glyph = (text: string) => createElement(Text, { as: 'span', variant: 'label', numeric: true }, text);

const methodChoices = (): ToolbarChoice[] =>
  METHOD_CHOICES.map((each) => ({ value: each, label: ALGORITHM_LABELS[each], description: ALGORITHM_NOTES[each], icon: glyph(METHOD_GLYPHS[each]) }));

const overflowChoices = (): ToolbarChoice[] =>
  BOUNDS_BAR_CHOICES.map((each) => ({ value: each.value, label: each.label, description: BOUNDS_BAR_NOTES[each.value], icon: glyph(OVERFLOW_GLYPHS[each.value] ?? '') }));

const transformItems = (spec: TransformSpec): ToolbarItem[] => [
  {
    kind: 'group',
    id: 'transform-method',
    label: TRANSFORM_BAR_TEXT.methodName,
    value: spec.algorithm,
    choices: methodChoices(),
    onChange: (value) => reviseTransform((current) => ({ ...current, algorithm: METHOD_CHOICES.find((each) => each === value) ?? current.algorithm })),
  },
  {
    kind: 'group',
    id: 'transform-overflow',
    label: TRANSFORM_BAR_TEXT.boundsName,
    value: spec.bounds,
    choices: overflowChoices(),
    onChange: (value) => reviseTransform((current) => ({ ...current, bounds: value === 'expand' ? 'expand' : 'crop' })),
  },
  { kind: 'separator', id: 'transform-split' },
  { kind: 'button', id: 'transform-flip-h', label: TRANSFORM_BAR_TEXT.flipHorizontal, icon: 'pixel-flip-h', onSelect: () => flipInSession('horizontal') },
  { kind: 'button', id: 'transform-flip-v', label: TRANSFORM_BAR_TEXT.flipVertical, icon: 'pixel-flip-v', onSelect: () => flipInSession('vertical') },
  { kind: 'button', id: 'transform-turn', label: TRANSFORM_BAR_TEXT.turn, icon: 'pixel-turn-right', onSelect: () => turnInSession('clockwise') },
  {
    kind: 'button',
    id: 'transform-reset',
    label: TRANSFORM_BAR_TEXT.reset,
    icon: 'pixel-undo',
    onSelect: () => reviseTransform((current) => ({ ...IDENTITY, algorithm: current.algorithm, bounds: current.bounds })),
  },
];

export { transformItems };
