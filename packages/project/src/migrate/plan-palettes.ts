/* @layer core @kind logic */
import { ASSET_FORMAT, ASSET_KIND } from '@bxel/document';
import type { IdSource } from '@bxel/document';
import type { FolderId } from '../ids/id.type';
import { ROOT_FOLDER_PATH } from '../manifest/manifest.constants';
import { safeSegment } from '../paths/safe-segment';
import { uniqueName } from '../paths/unique-name';
import type { SwatchSet } from '../swatches/swatch.type';
import { PALETTE_NAME_FALLBACK, PALETTE_STEM_ROOM } from './migrate.constants';
import type { PalettePlan } from './migration.type';
import { swatchBank } from './swatch-bank';

const planPalettes = (
  sets: readonly SwatchSet[],
  folderId: FolderId,
  rolePath: string,
  ids: IdSource,
): readonly PalettePlan[] => {
  const taken = new Set<string>();
  return sets.map((set) => {
    const bank = swatchBank(set, ids);
    const stem = safeSegment(set.name, PALETTE_NAME_FALLBACK, PALETTE_STEM_ROOM);
    const fileName = uniqueName(stem, ASSET_FORMAT.palette.extension, taken);
    return {
      setId: set.setId,
      location: { folderId, path: rolePath === ROOT_FOLDER_PATH ? fileName : `${rolePath}/${fileName}` },
      slice: { kind: ASSET_KIND.palette, id: bank.id, name: bank.name, artwork: { banks: [bank] }, links: [] },
    };
  });
};

export { planPalettes };
