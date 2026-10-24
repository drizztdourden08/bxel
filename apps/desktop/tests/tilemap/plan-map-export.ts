/* @layer renderer-app @kind helper */
import type { Artwork } from '@bxel/document';
import { DEFAULT_EXPORT_SETTINGS } from '../../src/export/export.constants';
import type { ExportPlan, ExportSettings } from '../../src/export/export.type';
import { planExport } from '../../src/export/plan-export';
import { mapNow } from './map-harness';

const planMapExport = (artwork: Artwork, patch: Partial<ExportSettings>): ExportPlan =>
  planExport({
    frozen: { revision: 1, artwork },
    settings: { ...DEFAULT_EXPORT_SETTINGS, kind: 'map', fileName: 'level', ...patch },
    selectedIds: [],
    current: { spriteId: null, frameId: null, tilemapId: mapNow().id },
  });

export { planMapExport };
