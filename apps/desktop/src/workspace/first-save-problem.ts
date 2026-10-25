/* @layer renderer-app @kind logic */
import { sliceAsset } from '@bxel/document';
import type { Artwork, AssetKey } from '@bxel/document';
import { checkAssetSlice } from '@bxel/document/native';
import { fileName } from '../files/file-name';
import { reasonOf } from '../files/reason-of';
import { assetName } from './asset-name';
import type { SaveProblem } from './workspace.type';

const nameOf = (artwork: Artwork, key: AssetKey, paths: ReadonlyMap<string, string>): string => {
  const path = paths.get(key.id);
  return path === undefined ? (assetName(artwork, key) ?? key.id) : fileName(path);
};

const firstSaveProblem = (artwork: Artwork, keys: readonly AssetKey[], paths: ReadonlyMap<string, string>): SaveProblem | null => {
  for (const key of keys) {
    if (key.kind === 'project' || !paths.has(key.id)) continue;
    try {
      checkAssetSlice(sliceAsset(artwork, key, paths));
    } catch (error) {
      return { name: nameOf(artwork, key, paths), reason: reasonOf(error) };
    }
  }
  return null;
};

export { firstSaveProblem };
