/* @layer core @kind types */
import type { Cel, CelId, Frame, FrameId, IdSource, LayerId, Pivot2, Sprite, Tag } from '@bxel/document';
import type { Rect, Size } from '../../geometry.type';

type LayerBuild = {
  readonly id: LayerId;
  readonly name: string;
  readonly visible: boolean;
  readonly locked: boolean;
  readonly cels: Record<FrameId, CelId>;
};

type SpriteParts = {
  readonly layers: LayerBuild[];
  readonly frames: Frame[];
  readonly cels: Record<CelId, Cel>;
  readonly tags: Tag[];
};

type MergeSource = {
  readonly ids: IdSource;
  readonly source: Sprite;
  readonly frame: Rect;
};

type MergeSpec = {
  readonly name: string;
  readonly anchor: string;
};

type PieceSpec = {
  readonly name: string;
  readonly size: Size;
  readonly frames: readonly number[];
  readonly crop: Rect | null;
  readonly pivot: Pivot2;
};

type SliceGrid = {
  readonly columns: number;
  readonly rows: number;
  readonly cellWidth: number;
  readonly cellHeight: number;
};

type SliceCell = {
  readonly index: number;
  readonly rect: Rect;
};

type SliceRequest = {
  readonly columns?: number | undefined;
  readonly rows?: number | undefined;
  readonly cellWidth?: number | undefined;
  readonly cellHeight?: number | undefined;
};

type SpriteSliceRequest = SliceRequest & {
  readonly pattern: string;
  readonly start: number;
  readonly skipEmpty: boolean;
};

type CelCopier = (celId: CelId, pixels: () => Uint8Array) => CelId;

export type { CelCopier, LayerBuild, MergeSource, MergeSpec, PieceSpec, SliceCell, SliceGrid, SliceRequest, SpriteParts, SpriteSliceRequest };
