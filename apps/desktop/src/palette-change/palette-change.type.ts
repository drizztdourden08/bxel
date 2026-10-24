/* @layer renderer-app @kind types */
import type { BankId, DocumentId, PaletteBank, Sprite, SpriteId } from '@bxel/document';
import type { RgbaImage } from '@bxel/formats';

type ChangeKind = 'delete' | 'merge' | 'limit';

type RequestKind = ChangeKind | 'switch';

interface ChangeRequest {
  kind: RequestKind;
  documentId: DocumentId;
  bankId: BankId;
  swatch: number;
  other: number | null;
  cap: number;
  spriteId?: SpriteId;
  toBankId?: BankId;
}

interface AffectedSprite {
  id: string;
  name: string;
  frames: string;
  pixels: number;
}

interface SpriteUse {
  pixels: number;
  frames: readonly number[];
}

interface ChangePicture {
  spriteName: string;
  before: RgbaImage;
  after: RgbaImage;
}

interface ChangePreview {
  swatchLine: string;
  bankName: string;
  affected: readonly AffectedSprite[];
  totalSprites: number;
  pixels: number;
  picture: ChangePicture | null;
  countBefore: string;
  countAfter: string;
  error: string | null;
}

interface PictureInput {
  sprite: Sprite;
  bank: PaletteBank;
  frame: number;
  removed: number;
  other: number;
}

interface ToolColours {
  foreground: number;
  background: number;
}

interface SwatchChoice {
  value: string;
  label: string;
}

type ChangeOutcome = { ok: true } | { ok: false; message: string };

type ProposeResult = { ok: true; request: ChangeRequest } | { ok: false; message: string };

export type { AffectedSprite, ChangeKind, ChangeOutcome, ChangePicture, ChangePreview, ChangeRequest, PictureInput, ProposeResult, RequestKind, SpriteUse, SwatchChoice, ToolColours };
