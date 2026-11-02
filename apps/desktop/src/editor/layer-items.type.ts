/* @layer renderer-app @kind types */
interface FrameSpread {
  total: number;
  have: ReadonlyMap<string, number>;
  unit: 'frames' | 'tiles';
}

export type { FrameSpread };
