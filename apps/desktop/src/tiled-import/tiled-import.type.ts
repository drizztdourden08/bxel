/* @layer renderer-app @kind types */
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import type { TiledPlan, TiledTileset } from '@bxel/formats';
import type { SourceImage } from '../image-import/image-import.type';

interface TiledImportData {
  mapFile: string;
  plan: TiledPlan;
  atlasColumns: number;
}

interface LoadedTileset {
  readonly tileset: TiledTileset;
  readonly home: string;
}

type TiledFiles = Pick<DocumentsPort, 'read' | 'readText'>;

type TiledRead = { ok: true; image: SourceImage; tiled: TiledImportData } | { ok: false; message: string };

export type { LoadedTileset, TiledFiles, TiledImportData, TiledRead };
