/* @layer renderer-app @kind component */
import { Button, Stack, Text } from '@drizztdourden08/tessera';
import { animationFromTile } from '../../../tile-animation/tile-animation-actions';
import { TILE_ANIMATION_TEXT } from '../../../tile-animation/tile-animation.constants';
import type { TilesetHeaderProps } from '../TilesetPanel.type';
import { AnimationChoose } from './AnimationChoose';
import { AnimationLinked } from './AnimationLinked';

const AnimationSection = ({ model }: TilesetHeaderProps) => {
  const cell = model.cells.find((each) => each.tile.key === model.pickedKey);
  if (!cell || model.stamp.keys.length > 1) return null;
  const props = { artwork: model.artwork, tileset: model.tileset, tile: cell.tile };
  return (
    <Stack gap="xs" role="group" aria-label={TILE_ANIMATION_TEXT.title}>
      <Text variant="label">{TILE_ANIMATION_TEXT.title}</Text>
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
