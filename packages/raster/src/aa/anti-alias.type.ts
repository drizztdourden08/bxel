/* @layer core @kind types */
interface AntiAliasInput {
  readonly pixels: Uint8Array;
  readonly width: number;
  readonly height: number;
  /** The index of the line colour whose stair steps are softened. */
  readonly edge: number;
  /** The index written at the corners. It is always an index the caller picked, never a new colour. */
  readonly mid: number;
  /** Write over filled pixels beside the line (true) or only over empty pixels (false). */
  readonly inside: boolean;
}

interface AntiAliasPixel {
  readonly x: number;
  readonly y: number;
  readonly index: number;
}

export type { AntiAliasInput, AntiAliasPixel };
