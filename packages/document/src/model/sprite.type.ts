/* @layer core @kind types */
import type { Pivot2, Rect } from './geometry.type';
import type { BankId, CelId, FrameId, LayerId, SliceId, SpriteId, TagId } from './ids.type';

type SpriteRole = 'sprite' | 'tile';
type TagDirection = 'forward' | 'reverse' | 'pingpong';

type Cel = { readonly id: CelId; readonly pixels: Uint8Array };

type Layer = {
  readonly id: LayerId;
  readonly name: string;
  readonly visible: boolean;
  readonly locked: boolean;
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
};

type Slice = {
  readonly id: SliceId;
  readonly name: string;
  readonly rect: Rect;
  readonly pivot: Pivot2 | null;
  readonly center: Rect | null;
};

type Sprite = {
  readonly id: SpriteId;
  readonly name: string;
  readonly role: SpriteRole;
  readonly bankId: BankId;
  readonly width: number;
  readonly height: number;
  readonly pivot: Pivot2;
  readonly layers: readonly Layer[];
  readonly frames: readonly Frame[];
  readonly tags: readonly Tag[];
  readonly slices: readonly Slice[];
  readonly cels: Readonly<Record<CelId, Cel>>;
};

type SpriteShell = Omit<Sprite, 'cels'>;

export type { Cel, Frame, Layer, Slice, Sprite, SpriteRole, SpriteShell, Tag, TagDirection };
