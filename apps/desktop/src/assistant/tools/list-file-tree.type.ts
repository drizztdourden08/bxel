/* @layer renderer-app @kind types */
import type { EntryKind, ListedEntry } from '@bxel/project';
import type { DocumentsPort } from '@drizztdourden08/brock-core';

type TreeEntry = { readonly entry: ListedEntry; readonly dir: string; readonly path: string; readonly depth: number };

type Tree = { readonly entries: readonly TreeEntry[]; readonly skipped: number; readonly cut: boolean };

type Walk = { readonly documents: DocumentsPort; readonly kinds: readonly EntryKind[]; readonly depth: number };

type Found = { entries: TreeEntry[]; skipped: number; cut: boolean };

type FolderAt = { readonly dir: string; readonly base: string; readonly level: number };

export type { Found, FolderAt, Tree, TreeEntry, Walk };
