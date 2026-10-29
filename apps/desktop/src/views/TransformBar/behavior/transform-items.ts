/* @layer renderer-app @kind logic */
import type { ToolbarItem } from '@drizztdourden08/tessera';
import { flipInSession } from '../../../editor/transform/flip-in-session';
import { reviseTransform } from '../../../editor/transform/revise-transform';
import { IDENTITY } from '../../../editor/transform/transform.constants';
import { turnInSession } from '../../../editor/transform/turn-in-session';
import { TRANSFORM_BAR_TEXT } from '../TransformBar.constants';

const actionItems = (): ToolbarItem[] => [
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

export { actionItems };
