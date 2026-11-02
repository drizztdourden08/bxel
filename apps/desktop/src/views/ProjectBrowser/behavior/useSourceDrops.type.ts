/* @layer renderer-app @kind types */
import type { SourceDrop } from '../ProjectBrowser.type';

type SourceDrops = { readonly folders: SourceDrop; readonly tags: SourceDrop; readonly collections: SourceDrop };

export type { SourceDrops };
