/* @layer renderer-app @kind logic */
import { buildMapFiles } from './build-map-files';
import { EXPORT_FALLBACK_NAME, NO_INDEXED } from './export.constants';
import type { ExportPlan, PlanInput } from './export.type';
import { MAP_EXPORT_TEXT } from './map-export.constants';
import { pickExportMap } from './pick-export-map';
import { safeName } from './safe-name';

const planMap = (input: PlanInput): ExportPlan => {
  const { artwork, revision } = input.frozen;
  const { settings } = input;
  const common = { spriteCount: 1, indexed: NO_INDEXED, revision };
  const pick = pickExportMap(artwork, input.current?.tilemapId);
  if (typeof pick === 'string') return { ...common, files: [], notes: [], problem: pick };
  const base = safeName(settings.fileName) || safeName(pick.tilemap.name) || EXPORT_FALLBACK_NAME;
  const files = buildMapFiles(artwork, pick, settings, base);
  if (typeof files === 'string') return { ...common, files: [], notes: [], problem: files };
  const note = settings.mapFormat === 'tiled' ? MAP_EXPORT_TEXT.tiledNote : MAP_EXPORT_TEXT.bxelNote;
  return { ...common, files, notes: [note], problem: null };
};

export { planMap };
