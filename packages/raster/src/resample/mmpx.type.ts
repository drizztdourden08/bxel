/* @layer core @kind types */
/**
 * The neighbourhood of one source pixel E:
 *
 *     P
 *    ABC
 *  QDEFR
 *    GHI
 *     S
 */
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

export type { Hood, Quad };
