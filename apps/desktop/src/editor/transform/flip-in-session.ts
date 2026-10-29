/* @layer renderer-app @kind logic */
import type { FlipAxis } from '@bxel/document';
import { flipSpec } from './flip-spec';
import { reviseTransform } from './revise-transform';

const flipInSession = (axis: FlipAxis): boolean => reviseTransform((spec) => flipSpec(spec, axis));

export { flipInSession };
