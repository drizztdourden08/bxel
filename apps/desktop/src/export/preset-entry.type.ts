/* @layer renderer-app @kind types */
import type { Artwork, AssetKey, SheetId, SpriteId } from '@bxel/document';
import type { ExportSettings } from './export.type';

type PresetOrigin = 'asset' | 'project' | 'app';

type PresetEntry = {
  readonly key: string;
  readonly id: string | null;
  readonly name: string;
  readonly origin: PresetOrigin;
  readonly settings: ExportSettings;
};

type PresetOwnerChoice = { readonly sprite: SpriteId } | { readonly sheet: SheetId } | { readonly project: true };

type PresetContext = {
  readonly artwork: Artwork;
  readonly tab: AssetKey | null;
  readonly spriteId: SpriteId | null;
  readonly project: boolean;
};

type PresetSaved =
  | { readonly ok: true; readonly where: string }
  | { readonly ok: false; readonly message: string };

type PresetMoved = { readonly ok: true; readonly count: number } | { readonly ok: false; readonly message: string };

export type { PresetContext, PresetEntry, PresetMoved, PresetOrigin, PresetOwnerChoice, PresetSaved };
