/* @layer renderer-app @kind logic */
import { planAtlas } from '@bxel/formats';
import { NO_CURRENT } from '../editor/current-pick.constants';
import { animationSources } from '../export/animation-sources';
import { DEFAULT_EXPORT_SETTINGS } from '../export/export.constants';
import type { TargetsResult } from '../export/export.type';
import { resolveTargets } from '../export/resolve-targets';
import { sheetInput } from '../export/sheet-input';
import { atlasExportSettings } from './atlas-export-settings';
import type { AtlasPlanned, AtlasInput } from './manager.type';

const atlasPlan = ({ sheet, artwork, ...atlas }: AtlasInput): AtlasPlanned => {
  const settings = { ...DEFAULT_EXPORT_SETTINGS, ...atlasExportSettings(sheet, atlas) };
  const sources = animationSources(artwork, settings);
  if (typeof sources === 'string') return { ok: false, message: sources };
  const resolved: TargetsResult = sources?.only ? { ok: true, targets: [] } : resolveTargets(artwork, settings, [], NO_CURRENT);
  if (!resolved.ok) return { ok: false, message: resolved.message };
  const extra = sources?.sprites ?? [];
  const { sprites, settings: pack, trim, mergeIdentical } = sheetInput(resolved.targets, settings, extra);
  const plan = planAtlas({ sprites, settings: pack, trim, pageSide: settings.pageSide, mergeIdentical: mergeIdentical === true });
  return plan.ok ? { ok: true, targets: resolved.targets, extra, plan } : { ok: false, message: plan.message };
};

export { atlasPlan };
