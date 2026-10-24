/* @layer core @kind types */
import type { RuleName, RuleTier } from '../model/preset.type';
import type { SpriteSize } from '../model/sprite-size.type';

type RuleFinding = {
  readonly rule: RuleName;
  readonly tier: RuleTier;
  readonly message: string;
  readonly key: string;
  readonly excess: number;
};

type BankFacts = {
  readonly id: string;
  readonly name: string;
  readonly cap: number;
  readonly transparent: boolean;
  readonly colours: readonly string[];
};

type PlatformFacts = {
  readonly banks: readonly BankFacts[];
  readonly sprites: readonly SpriteSize[];
};

export type { BankFacts, PlatformFacts, RuleFinding };
