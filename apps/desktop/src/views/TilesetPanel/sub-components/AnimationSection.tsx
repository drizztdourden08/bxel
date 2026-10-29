/* @layer renderer-app @kind component */
import { Button, Stack, Text } from '@drizztdourden08/tessera';
import { animationFromTile } from '../../../tile-animation/animation-from-tile';
import { animationFromTiles } from '../../../tile-animation/animation-from-tiles';
import { TILE_ANIMATION_TEXT } from '../../../tile-animation/tile-animation.constants';
import type { TilesetModelProps } from '../TilesetPanel.type';
import { AnimationChoose } from './AnimationChoose';
import { AnimationFrames } from './AnimationFrames';
import { AnimationLinked } from './AnimationLinked';

const AnimationSection = ({ model }: TilesetModelProps) => {
  const many = model.selected.length > 1;
  const cell = model.pickedKey === null ? undefined : model.byKey.get(model.pickedKey);
  if (many) {
    return (
      <Stack gap="xs" role="group" aria-label={TILE_ANIMATION_TEXT.title}>
        <AnimationFrames model={model} />
        <Text variant="caption" tone="muted">
          {TILE_ANIMATION_TEXT.fromTilesHint}
        </Text>
        <Button size="sm" variant="primary" onClick={() => animationFromTiles(model.artwork, model.tileset, model.selected)}>
          {TILE_ANIMATION_TEXT.fromTiles(model.selected.length)}
        </Button>
      </Stack>
    );
  }
  if (!cell) {
    return (
      <Text variant="caption" tone="muted">
        {TILE_ANIMATION_TEXT.pickOne}
      </Text>
    );
  }
  const props = { artwork: model.artwork, tileset: model.tileset, tile: cell.tile };
  return (
    <Stack gap="xs" role="group" aria-label={TILE_ANIMATION_TEXT.title}>
      {cell.tile.animation ? (
        <AnimationLinked {...props} />
      ) : (
        <>
          <Text variant="caption" tone="muted">
            {TILE_ANIMATION_TEXT.still}
          </Text>
          <AnimationChoose {...props} />
        </>
      )}
      <Button size="sm" variant="tertiary" onClick={() => animationFromTile(model.artwork, model.tileset, cell.tile)}>
        {TILE_ANIMATION_TEXT.fromTile}
      </Button>
    </Stack>
  );
};

export { AnimationSection };
