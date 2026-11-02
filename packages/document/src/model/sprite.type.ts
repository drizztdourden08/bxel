/* @layer core @kind types */
import type { Pivot2, Rect, Size } from './geometry.type';
import type { BankId, CelId, FrameId, LayerId, SliceId, SpriteId, TagId } from './ids.type';

type SpriteRole = 'sprite' | 'tile' | 'frame';
type TagDirection = 'forward' | 'reverse' | 'pingpong';

type Cel = { readonly id: CelId; readonly pixels: Uint8Array };

type LayerKind = 'pixel' | 'group' | 'reference';

type LayerLock = { readonly pixels: boolean; readonly transparency: boolean; readonly position: boolean };

type LayerReference = { readonly path: string; readonly x: number; readonly y: number };

type Layer = {
  readonly id: LayerId;
  readonly name: string;
  readonly visible: boolean;
  readonly lock: LayerLock;
  readonly kind?: LayerKind;
  readonly parentId?: LayerId;
  readonly viewOpacity?: number;
  readonly clip?: boolean;
  readonly colour?: string;
  readonly exported?: boolean;
  readonly reference?: LayerReference;
  readonly cels: Readonly<Record<FrameId, CelId>>;
};

type Frame = { readonly id: FrameId; readonly durationMs: number };

type Tag = {
  readonly id: TagId;
  readonly name: string;
  readonly from: FrameId;
  readonly to: FrameId;
  readonly direction: TagDirection;
  readonly repeat: number;
  readonly colour?: string;
};

type Slice = {
  readonly id: SliceId;
  readonly name: string;
  readonly rect: Rect;
  readonly pivot: Pivot2 | null;
  readonly center: Rect | null;
  readonly colour?: string;
};

type SavedRun = readonly [y: number, x0: number, x1: number];

type SavedSelection = { readonly name: string; readonly width: number; readonly height: number; readonly runs: readonly SavedRun[] };

type Guides = { readonly x: readonly number[]; readonly y: readonly number[] };

type SpriteSymmetry = {
  readonly x: boolean;
  readonly y: boolean;
  readonly axisX: number | null;
  readonly axisY: number | null;
  readonly diagonal: boolean;
  readonly turn: boolean;
};

type Sprite = {
  readonly id: SpriteId;
  readonly name: string;
  readonly created?: number;
  readonly role: SpriteRole;
  readonly bankId: BankId;
  readonly width: number;
  readonly height: number;
  readonly pivot: Pivot2;
  readonly platformId?: string;
  readonly platformStrict?: boolean;
  readonly pixelGrid?: Size;
  readonly guides?: Guides;
  readonly selections?: readonly SavedSelection[];
  readonly symmetry?: SpriteSymmetry;
  readonly layers: readonly Layer[];
  readonly frames: readonly Frame[];
  readonly tags: readonly Tag[];
  readonly slices: readonly Slice[];
  readonly cels: Readonly<Record<CelId, Cel>>;
};

type SpriteShell = Omit<Sprite, 'cels'>;

export type { Cel, Frame, Guides, Layer, LayerKind, LayerLock, LayerReference, SavedRun, SavedSelection, Slice, Sprite, SpriteRole, SpriteShell, SpriteSymmetry, Tag, TagDirection };
