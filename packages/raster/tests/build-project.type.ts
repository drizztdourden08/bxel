/* @layer tests @kind types */
type LayerSpec = {
  readonly id: string;
  readonly name: string;
  readonly locked?: boolean;
  readonly visible?: boolean;
  readonly cels?: Readonly<Record<string, string>>;
};

type SpriteSpec = {
  readonly id: string;
  readonly name: string;
  readonly width: number;
  readonly height: number;
  readonly frames: readonly string[];
  readonly layers: readonly LayerSpec[];
  readonly cels: Readonly<Record<string, readonly string[]>>;
};

export type { LayerSpec, SpriteSpec };
