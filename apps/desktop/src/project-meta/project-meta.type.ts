/* @layer renderer-app @kind types */
import type { Artwork } from '@bxel/document';
import type { ResolvedFolder } from '@bxel/project';

type MetaSource = {
  readonly artwork: Artwork;
  readonly paths: ReadonlyMap<string, string>;
  readonly folders: readonly ResolvedFolder[];
};

export type { MetaSource };
