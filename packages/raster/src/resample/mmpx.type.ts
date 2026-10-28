/* @layer core @kind types */
type Hood = {
  readonly a: number;
  readonly b: number;
  readonly c: number;
  readonly d: number;
  readonly e: number;
  readonly f: number;
  readonly g: number;
  readonly h: number;
  readonly i: number;
  readonly p: number;
  readonly q: number;
  readonly r: number;
  readonly s: number;
  readonly at: (dx: number, dy: number) => number;
  readonly luma: (index: number) => number;
};

type Quad = { j: number; k: number; l: number; m: number };

type Slot = 'j' | 'k' | 'l' | 'm';

type SlopeRule = {
  readonly slot: Slot;
  readonly x: number;
  readonly mate: number;
  readonly others: readonly [number, number];
  readonly corner: number;
  readonly reach: readonly [number, number, number];
  readonly tail: number;
  readonly far: readonly [number, number];
};

type CornerRule = {
  readonly slots: readonly [Slot, Slot];
  readonly x: number;
  readonly holds: boolean;
};

type ShallowRule = {
  readonly holds: boolean;
  readonly dst: Slot;
  readonly src: Slot;
};

type Four = readonly [number, number, number, number];

type CrossingSpec = { readonly x: number; readonly eqE: Four; readonly eqX: readonly [number, number]; readonly far: number };

type TipSpec = { readonly x: number; readonly eqE: Four; readonly noneE: Four };

type ShallowSpec = { readonly guard: boolean; readonly x: number; readonly eq: readonly [number, number, number]; readonly none: readonly [number, number] };

export type { CornerRule, CrossingSpec, ShallowSpec, TipSpec, Hood, Quad, ShallowRule, SlopeRule };
