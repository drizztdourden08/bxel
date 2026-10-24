/* @layer core @kind types */
type ManifestCore = {
  readonly formatVersion: number;
  readonly minReaderVersion: number;
  readonly entries: readonly { readonly path: string }[];
};

export type { ManifestCore };
