/* @layer core @kind types */
type Brand<T, B extends string> = T & { readonly __brand: B };

type DocumentId = Brand<string, 'doc'>;
type ProjectId = Brand<string, 'prj'>;
type BankId = Brand<string, 'bnk'>;
type SwatchId = Brand<string, 'sw'>;
type RampId = Brand<string, 'rmp'>;
type SpriteId = Brand<string, 'spr'>;
type LayerId = Brand<string, 'lay'>;
type FrameId = Brand<string, 'frm'>;
type CelId = Brand<string, 'cel'>;
type TagId = Brand<string, 'tag'>;
type SliceId = Brand<string, 'slc'>;
type SheetId = Brand<string, 'sht'>;
type PresetId = Brand<string, 'exp'>;
type TilesetId = Brand<string, 'tls'>;
type TileId = Brand<string, 'til'>;
type TilemapId = Brand<string, 'tlm'>;
type MapLayerId = Brand<string, 'tml'>;

export type {
  BankId,
  Brand,
  CelId,
  DocumentId,
  FrameId,
  LayerId,
  MapLayerId,
  PresetId,
  ProjectId,
  RampId,
  SheetId,
  SliceId,
  SpriteId,
  SwatchId,
  TagId,
  TileId,
  TilemapId,
  TilesetId,
};
