/* @layer core @kind types */
import type { FolderId } from '../ids/id.type';

type SplitEntry = { readonly folderId: FolderId; readonly path: string };

export type { SplitEntry };
