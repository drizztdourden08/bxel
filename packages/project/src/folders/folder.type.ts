/* @layer core @kind types */
import type { FolderId } from '../ids/id.type';

type ResolvedFolder = {
  readonly folderId: FolderId;
  readonly name: string;
  readonly path: string;
};

export type { ResolvedFolder };
