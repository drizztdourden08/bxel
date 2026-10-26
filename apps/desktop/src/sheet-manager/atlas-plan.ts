/* @layer renderer-app @kind logic */
import { planAtlas } from '@bxel/formats';
import { NO_CURRENT } from '../editor/current-pick.constants';
import { DEFAULT_EXPORT_SETTINGS } from '../export/export.constants';
import { resolveTargets } from '../export/resolve-targets';
import { sheetInput } from '../export/sheet-input';
import { atlasExportSettings } from './atlas-export-settings';
import type { AtlasPlanned, AtlasInput } from './manager.type';

const atlasPlan = ({ sheet, artwork, ...atlas }: AtlasInput): AtlasPlanned => {
  const settings = { ...DEFAULT_EXPORT_SETTINGS, ...atlasExportSettings(sheet, atlas) };
  const resolved = resolveTargets(artwork, settings, [], NO_CURRENT);
  if (!resolved.ok) return { ok: false, message: resolved.message };
  const { sprites, settings: pack, trim, mergeIdentical } = sheetInput(resolved.targets, settings);
  const plan = planAtlas({ sprites, settings: pack, trim, pageSide: settings.pageSide, mergeIdentical: mergeIdentical === true });
  return plan.ok ? { ok: true, targets: resolved.targets, plan } : { ok: false, message: plan.message };
};

export { atlasPlan };
