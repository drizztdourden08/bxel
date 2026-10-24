/* @layer renderer-app @kind types */
import type { Artwork, AssetKey, DocumentId } from '@bxel/document';
import type { FieldResult, SourceField } from '../config-source/config-source.type';

type AssetFocus = {
  readonly documentId: DocumentId;
  readonly key: AssetKey;
  readonly artwork: Artwork;
  readonly readOnly: boolean;
};

type AssetField = SourceField<AssetFocus>;

type AssetFields = Readonly<Record<string, AssetField>>;

type GridPatch = { columns?: number; cellWidth?: number; cellHeight?: number; order?: string };

type AssetOutcome = Extract<FieldResult, string | null>;

export type { AssetField, AssetFields, AssetFocus, AssetOutcome, GridPatch };
