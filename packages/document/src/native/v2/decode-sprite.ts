/* @layer core @kind logic */
import { ASSET_KIND } from '../../model/asset-format.constants';
import type { AssetSlice } from '../../model/asset.type';
import type { AssetReport } from './asset-report.type';
import { chooseBank } from './choose-bank';
import { fatalAssetReport } from './fatal-asset-report';
import { finishAssetReport } from './finish-asset-report';
import { readAsset } from './read-asset';
import { restoreAssetSprite } from './restore-asset-sprite';
import { validateSpriteFile } from './validate-sprite-file';

const decodeSprite = (bytes: Uint8Array, palette: AssetSlice | null = null): AssetReport => {
  const read = readAsset(bytes, ASSET_KIND.sprite);
  if (!read.ok) return fatalAssetReport(read.issues);
  const { opened, check, json } = read.value;
  const file = validateSpriteFile(json, opened.manifest);
  if (!file.ok) return fatalAssetReport(file.issues);
  const { bank, missing } = chooseBank(file.value.palette, opened.manifest.links, palette);
  const { sprite, damage } = restoreAssetSprite(file.value.sprite, bank, check);
  const slice = {
    kind: ASSET_KIND.sprite,
    id: sprite.id,
    name: sprite.name,
    artwork: { banks: [bank], sprites: [sprite], presets: file.value.presets },
    links: opened.manifest.links,
  };
  return finishAssetReport({ opened, check, slice, damage, missing });
};

export { decodeSprite };
