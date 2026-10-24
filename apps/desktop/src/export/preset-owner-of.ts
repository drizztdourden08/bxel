/* @layer renderer-app @kind logic */
import type { ExportSettings } from './export.type';
import { PRESET_KINDS } from './preset-list.constants';
import type { PresetContext, PresetOwnerChoice } from './preset-entry.type';

const sheetNamed = (context: PresetContext, id: string): PresetOwnerChoice | null => {
  const found = context.artwork.sheets.find((sheet) => sheet.id === id);
  return found ? { sheet: found.id } : null;
};

const sheetOwner = (settings: ExportSettings, context: PresetContext): PresetOwnerChoice | null => {
  const open = context.tab?.kind === 'sheet' ? context.tab.id : '';
  return sheetNamed(context, settings.sheetId !== '' ? settings.sheetId : open);
};

const spriteOwner = (settings: ExportSettings, context: PresetContext): PresetOwnerChoice | null => {
  if (settings.sprites !== 'current' || !PRESET_KINDS.sprite.includes(settings.kind)) return null;
  const found = context.artwork.sprites.find((sprite) => sprite.id === context.spriteId);
  return found ? { sprite: found.id } : null;
};

const openAssetOwner = (context: PresetContext): PresetOwnerChoice | null => {
  const { tab, artwork } = context;
  const sprite = tab?.kind === 'sprite' ? artwork.sprites.find((each) => each.id === tab.id) : undefined;
  if (sprite) return { sprite: sprite.id };
  return tab?.kind === 'sheet' ? sheetNamed(context, tab.id) : null;
};

const presetOwnerOf = (settings: ExportSettings, context: PresetContext): PresetOwnerChoice | null =>
  (settings.kind === 'sheet' ? sheetOwner(settings, context) : spriteOwner(settings, context)) ?? (context.project ? { project: true } : openAssetOwner(context));

export { presetOwnerOf };
