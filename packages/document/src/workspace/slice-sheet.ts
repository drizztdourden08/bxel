/* @layer core @kind logic */
import { ASSET_KIND } from '../model/asset-format.constants';
import type { AssetSlice } from '../model/asset.type';
import type { SheetId } from '../model/ids.type';
import { requireSheet } from '../read/require-sheet';
import { homedPresets } from './homed-presets';
import { linkTo } from './link-to';
import type { SliceContext } from './slice-context.type';

const sliceSheet = (context: SliceContext, id: string): AssetSlice => {
  const sheet = requireSheet(context.artwork, id as SheetId);
  const presets = homedPresets(context, { kind: ASSET_KIND.sheet, id });
  const exported = presets.flatMap((preset) => preset.scope.sprites.filter((ref) => typeof ref === 'string'));
  return {
    kind: ASSET_KIND.sheet,
    id,
    name: sheet.name,
    artwork: { sheets: [sheet], presets },
    links: linkTo(context, [
      ...sheet.entries.map((entry) => entry.spriteId),
      ...(sheet.animationEntries ?? []).map((entry) => entry.animationId),
      ...exported,
    ]),
  };
};

export { sliceSheet };
