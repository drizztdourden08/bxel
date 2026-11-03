/* @layer renderer-app @kind types */
interface KeptCanvas<Canvas> {
  sprite: object;
  bank: object | undefined;
  canvas: Canvas;
}

interface KeepInput<Canvas> {
  kept: Map<string, KeptCanvas<Canvas>>;
  key: string;
  sprite: object;
  bank: object | undefined;
  limit: number;
  make: () => Canvas;
}

export type { KeepInput, KeptCanvas };
