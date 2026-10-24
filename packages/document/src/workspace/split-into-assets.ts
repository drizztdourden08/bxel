/* @layer core @kind logic */
import type { Artwork } from '../model/artwork.type';
import { legacyEntries } from './legacy-entries';
import { placeEntry } from './place-entry';
import { projectPresets } from './project-presets';
import { sliceAsset } from './slice-asset';
import { splitConflicts } from './split-conflicts';
import type { SplitPlan } from './split-plan.type';

const splitIntoAssets = (artwork: Artwork): SplitPlan => {
  const taken = new Set<string>();
  const placements = legacyEntries(artwork).map((entry) => placeEntry(entry, taken));
  const paths = new Map(placements.map((placement) => [placement.entry.key.id, placement.path] as const));
  const { id, name, defaultBankId, coverSpriteId, platformId, platformStrict } = artwork;
  return {
    project: {
      id,
      name,
      defaultBankId,
      coverSpriteId,
      ...(platformId === undefined ? {} : { platformId }),
      ...(platformStrict === true ? { platformStrict: true } : {}),
      presets: projectPresets(artwork),
    },
    files: placements.map(({ entry, ...placement }) => ({
      ...placement,
      key: entry.key,
      name: entry.name,
      slice: sliceAsset(artwork, entry.key, paths),
    })),
    conflicts: splitConflicts(placements),
  };
};

export { splitIntoAssets };
