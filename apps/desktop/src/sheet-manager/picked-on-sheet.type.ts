/* @layer renderer-app @kind types */
import type { Sheet } from '@bxel/document';
import type { AnimationFacts } from './manager.type';

interface PickedOnSheet {
  readonly sheet: Sheet;
  readonly facts: AnimationFacts[];
}

export type { PickedOnSheet };
