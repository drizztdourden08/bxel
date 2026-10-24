/* @layer core @kind types */
type ExternalIds = {
  readonly banks: ReadonlySet<string>;
  readonly sprites: ReadonlySet<string>;
  readonly tilesets: ReadonlySet<string>;
};

export type { ExternalIds };
