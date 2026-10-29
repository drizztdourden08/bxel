/* @layer renderer-app @kind logic */
import type { TurnDirection } from '@bxel/document';
import { reviseTransform } from './revise-transform';
import { turnSpec } from './turn-spec';

const turnInSession = (direction: TurnDirection): boolean => reviseTransform((spec) => turnSpec(spec, direction));

export { turnInSession };
