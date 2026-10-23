/* @layer core @kind types */
type KnownIds = {
  readonly banks: ReadonlySet<string>;
  readonly sprites: ReadonlySet<string>;
  readonly sheets: ReadonlySet<string>;
  readonly tilesets: ReadonlySet<string>;
};

export type { KnownIds };
