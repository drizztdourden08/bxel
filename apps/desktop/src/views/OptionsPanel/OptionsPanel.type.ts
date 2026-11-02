/* @layer renderer-app @kind types */
type LibraryKind = 'brush' | 'pattern';

type LibraryItem = {
  readonly id: string;
  readonly name: string;
  readonly width: number;
  readonly height: number;
  readonly pixels: string;
};

export type { LibraryItem, LibraryKind };
