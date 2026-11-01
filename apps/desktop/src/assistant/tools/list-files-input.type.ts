/* @layer renderer-app @kind types */
type WireFileKind = 'bxel' | 'image' | 'palette' | 'sheet_json' | 'other';

type ListFilesInput = {
  readonly projectId: string;
  readonly folderId: string;
  readonly path?: string;
  readonly kinds: readonly WireFileKind[];
  readonly depth: number;
  readonly offset: number;
  readonly limit: number;
};

export type { ListFilesInput, WireFileKind };
