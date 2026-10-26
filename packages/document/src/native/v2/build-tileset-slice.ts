/* @layer core @kind logic */
import { ASSET_KIND } from '../../model/asset-format.constants';
import type { AssetSlice } from '../../model/asset.type';
import { ID_PREFIX } from '../../ids/id-prefix.constants';
import { isId } from '../../ids/is-id';
import { chooseBank } from './choose-bank';
import type { BuiltTileset, ReadTileset } from './read-tileset-file.type';
import { restoreAssetSprite } from './restore-asset-sprite';
import { suppliesAnimation } from './supplies-animation';
import { tilesetPlaceholders } from './tileset-placeholders';

const buildTilesetSlice = (
  { opened, check, file }: ReadTileset,
  palette: AssetSlice | null,
  providers: readonly AssetSlice[] = [],
): BuiltTileset => {
  const { bank, missing } = chooseBank(file.palette, opened.manifest.links, palette);
  const lacking = opened.manifest.links.filter(
    (link) => isId(link.id, ID_PREFIX.animation) && !suppliesAnimation(providers, link.id),
  );
  const restored = file.sprites.map((shell) => restoreAssetSprite(shell, bank, check));
  const slice = {
    kind: ASSET_KIND.tileset,
    id: file.tileset.id,
    name: file.tileset.name,
    artwork: { banks: [bank], sprites: restored.map((item) => item.sprite),
      tilesets: [file.tileset],
      ...(lacking.length > 0 ? { animations: tilesetPlaceholders(file.tileset, lacking) } : {}),
    },
    links: opened.manifest.links,
  };
  return { slice, damage: restored.flatMap((item) => item.damage), missing: [...missing, ...lacking] };
};

export { buildTilesetSlice };
