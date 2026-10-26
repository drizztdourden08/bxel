/* @layer renderer-app @kind logic */
import { findSprite, findTilemap } from '@bxel/document';
import type { SpriteId, TilemapId } from '@bxel/document';
import type { AssetFocus } from '../asset-config/asset-config.type';
import { OVERVIEW_TEXT } from './asset-overview.constants';
import type { SizeFields } from './asset-overview.type';

const sizeFieldsOf = ({ artwork, key }: AssetFocus): SizeFields | null => {
  if (key.kind === 'sprite') {
    const sprite = findSprite(artwork, key.id as SpriteId);
    return sprite ? { widthLabel: OVERVIEW_TEXT.widthLabel, heightLabel: OVERVIEW_TEXT.heightLabel, width: sprite.width, height: sprite.height } : null;
  }
  const tilemap = key.kind === 'tilemap' ? findTilemap(artwork, key.id as TilemapId) : undefined;
  return tilemap ? { widthLabel: OVERVIEW_TEXT.columnsLabel, heightLabel: OVERVIEW_TEXT.rowsLabel, width: tilemap.columns, height: tilemap.rows } : null;
};

export { sizeFieldsOf };
