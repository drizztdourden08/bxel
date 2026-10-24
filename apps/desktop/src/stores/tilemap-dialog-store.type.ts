/* @layer renderer-app @kind types */
type TilemapDialogKind = 'tileset' | 'tilemap' | 'delete';

interface TilemapDialogState {
  kind: TilemapDialogKind | null;
  tileKey: number | null;
  show: (kind: TilemapDialogKind, tileKey?: number) => void;
  hide: () => void;
}

export type { TilemapDialogState };
