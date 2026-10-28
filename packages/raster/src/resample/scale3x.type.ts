/* @layer core @kind types */
type Same = (a: number, b: number) => boolean;

type Three = {
  readonly a: number;
  readonly b: number;
  readonly c: number;
  readonly d: number;
  readonly e: number;
  readonly f: number;
  readonly g: number;
  readonly h: number;
  readonly i: number;
  readonly same: Same;
};

type Claim = readonly [boolean, number];

export type { Claim, Same, Three };
