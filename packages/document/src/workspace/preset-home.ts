/* @layer core @kind logic */
import { ID_PREFIX } from '../ids/id-prefix.constants';
import { isId } from '../ids/is-id';
import { ASSET_KIND } from '../model/asset-format.constants';
import type { Artwork } from '../model/artwork.type';
import type { ExportPreset } from '../model/export-preset.type';
import type { AssetKey } from './asset-key.type';

const presetHome = (artwork: Artwork, preset: ExportPreset, owners: ReadonlyMap<string, string>): AssetKey | null => {
  if (preset.sheetId !== null) {
    const sheetId = preset.sheetId;
    return artwork.sheets.some((sheet) => sheet.id === sheetId) ? { kind: ASSET_KIND.sheet, id: sheetId } : null;
  }
  const [only, ...rest] = preset.scope.sprites;
  if (typeof only !== 'string' || rest.length > 0) return null;
  const owner = owners.get(only);
  if (owner !== undefined) return isId(owner, ID_PREFIX.animation) ? { kind: ASSET_KIND.animation, id: owner } : null;
  return artwork.sprites.some((sprite) => sprite.id === only) ? { kind: ASSET_KIND.sprite, id: only } : null;
};

export { presetHome };
