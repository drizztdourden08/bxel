/* @layer core @kind logic */
import { ASSET_KIND } from '../../model/asset-format.constants';
import type { AssetSlice } from '../../model/asset.type';
import { animationPlaceholders } from './animation-placeholders';
import type { AssetReport } from './asset-report.type';
import { chooseBank } from './choose-bank';
import { fatalAssetReport } from './fatal-asset-report';
import { finishAssetReport } from './finish-asset-report';
import { readAsset } from './read-asset';
import { restoreAssetSprite } from './restore-asset-sprite';
import { suppliesSprite } from './supplies-sprite';
import { validateAnimationFile } from './validate-animation-file';

const decodeAnimation = (
  bytes: Uint8Array,
  palette: AssetSlice | null = null,
  sprites: readonly AssetSlice[] = [],
): AssetReport => {
  const read = readAsset(bytes, ASSET_KIND.animation);
  if (!read.ok) return fatalAssetReport(read.issues);
  const { opened, check, json } = read.value;
  const file = validateAnimationFile(json, opened.manifest);
  if (!file.ok) return fatalAssetReport(file.issues);
  const { animation } = file.value;
  const chosen = chooseBank(file.value.palette, opened.manifest.links, palette);
  const owned = new Set<string>(file.value.sprites.map((sprite) => sprite.id));
  const lacking = opened.manifest.links.filter(
    (link) => link.id !== chosen.bank.id && !owned.has(link.id) && !suppliesSprite(sprites, link.id),
  );
  const restored = file.value.sprites.map((shell) => restoreAssetSprite(shell, chosen.bank, check));
  const slice = {
    kind: ASSET_KIND.animation,
    id: animation.id,
    name: animation.name,
    artwork: {
      banks: [chosen.bank],
      sprites: [...restored.map((item) => item.sprite), ...animationPlaceholders(animation, lacking, chosen.bank.id)],
      animations: [animation],
      presets: file.value.presets,
    },
    links: opened.manifest.links,
  };
  return finishAssetReport({
    opened,
    check,
    slice,
    damage: restored.flatMap((item) => item.damage),
    missing: [...chosen.missing, ...lacking],
  });
};

export { decodeAnimation };
