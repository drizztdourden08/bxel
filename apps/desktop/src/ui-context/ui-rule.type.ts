/* @layer renderer-app @kind types */
import type { BxelContext } from './bxel-context.type';

type Pred = (context: BxelContext) => boolean;

interface UiRule {
  applies: Pred;
  ready?: Pred;
  reason?: (context: BxelContext) => string;
  only?: string;
}

type UiVisibility = 'shown' | 'disabled' | 'hidden';

interface UiState {
  state: UiVisibility;
  reason: string | null;
}

type Need = readonly [Pred, string | ((context: BxelContext) => string)];

interface RuleSpec {
  applies: Pred;
  needs?: readonly Need[];
  only?: string;
}

export type { Need, Pred, RuleSpec, UiRule, UiState };
