/* @layer renderer-app @kind types */
import type { ResizeSpec } from '../../sheet-manager/manager.type';

interface TileSize {
  width: number;
  height: number;
}

interface CanvasSizeForm {
  spec: ResizeSpec;
  clips: number;
  valid: boolean;
  tile: TileSize | null;
  tileMultiple: boolean;
  setTileMultiple: (on: boolean) => void;
  update: (change: Partial<ResizeSpec>) => void;
}

interface SizeFieldsProps {
  spec: ResizeSpec;
  update: CanvasSizeForm['update'];
  tile: TileSize | null;
  tileMultiple: boolean;
  setTileMultiple: CanvasSizeForm['setTileMultiple'];
}

export type { CanvasSizeForm, SizeFieldsProps, TileSize };
