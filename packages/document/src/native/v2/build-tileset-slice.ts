/* @layer core @kind logic */
import { ASSET_KIND } from '../../model/asset-format.constants';
import type { AssetSlice } from '../../model/asset.type';
import { chooseBank } from './choose-bank';
import type { BuiltTileset, ReadTileset } from './read-tileset-file.type';
import { restoreAssetSprite } from './restore-asset-sprite';

const buildTilesetSlice = ({ opened, check, file }: ReadTileset, palette: AssetSlice | null): BuiltTileset => {
  const { bank, missing } = chooseBank(file.palette, opened.manifest.links, palette);
  const restored = file.sprites.map((shell) => restoreAssetSprite(shell, bank, check));
  const slice = {
    kind: ASSET_KIND.tileset,
    id: file.tileset.id,
    name: file.tileset.name,
    artwork: { banks: [bank], sprites: restored.map((item) => item.sprite), tilesets: [file.tileset] },
    links: opened.manifest.links,
  };
  return { slice, damage: restored.flatMap((item) => item.damage), missing };
};

export { buildTilesetSlice };
