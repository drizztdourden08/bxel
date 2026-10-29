/* @layer renderer-app @kind component */
import { MAX_TILE_PROBABILITY } from '@bxel/document';
import type { TileTurns } from '@bxel/document';
import { Stack } from '@drizztdourden08/tessera';
import { renameTile } from '../../../tilemap/rename-tile';
import { setTileData } from '../../../tilemap/set-tile-data';
import { mixedOf } from '../behavior/mixed-of';
import { selectedTiles } from '../behavior/selected-tiles';
import { TILESET_TEXT, TURN_CHOICES } from '../TilesetPanel.constants';
import type { TilesetModelProps } from '../TilesetPanel.type';
import { MixedChoice } from './MixedChoice';
import { MixedNumber } from './MixedNumber';
import { MixedText } from './MixedText';

const TileProperties = ({ model }: TilesetModelProps) => {
  const tiles = selectedTiles(model);
  const keys = tiles.map((tile) => tile.key);
  const single = tiles.length === 1 ? tiles[0] : undefined;
  const sprite = single ? model.byKey.get(single.key)?.sprite : undefined;
  const type = mixedOf(tiles, (tile) => tile.type ?? '');
  const probability = mixedOf(tiles, (tile) => tile.probability ?? 1);
  const turns = mixedOf(tiles, (tile) => tile.turns ?? 'none');
  return (
    <Stack gap="xs" role="group" aria-label={TILESET_TEXT.properties}>
      <MixedText
        label={TILESET_TEXT.name}
        value={sprite?.name}
        mixed={tiles.length > 1}
        disabled={tiles.length > 1}
        onCommit={(name) => sprite && renameTile(sprite.id, name)}
      />
      <MixedText label={TILESET_TEXT.type} value={type.value} mixed={type.mixed} placeholder={TILESET_TEXT.typeHint} onCommit={(value) => setTileData(keys, { type: value === '' ? null : value })} />
      <MixedNumber
        label={TILESET_TEXT.probability}
        value={probability.value}
        mixed={probability.mixed}
        min={0}
        max={MAX_TILE_PROBABILITY}
        step={0.5}
        onCommit={(value) => setTileData(keys, { probability: value === 1 ? null : value })}
      />
      <MixedChoice
        label={TILESET_TEXT.turns}
        value={turns.value}
        mixed={turns.mixed}
        options={TURN_CHOICES}
        onCommit={(value) => setTileData(keys, { turns: value === 'none' ? null : (value as TileTurns) })}
      />
    </Stack>
  );
};

export { TileProperties };
