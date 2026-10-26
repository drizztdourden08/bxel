/* @layer renderer-app @kind component */
import { Select, Stack, Text } from '@drizztdourden08/tessera';
import { animationFit } from '../../../tile-animation/animation-fit';
import { linkTile } from '../../../tile-animation/link-tile';
import { TILE_ANIMATION_TEXT, WHOLE_TAG } from '../../../tile-animation/tile-animation.constants';
import type { AnimationPartProps } from '../TilesetPanel.type';

const AnimationChoose = ({ artwork, tileset, tile }: AnimationPartProps) => {
  const fits = artwork.animations.filter((animation) => animationFit(tileset, animation) === null && animation.id !== tile.animation?.animationId);
  const misfits = artwork.animations.flatMap((animation) => {
    const issue = animationFit(tileset, animation);
    return issue === null ? [] : [{ id: animation.id, issue }];
  });
  const choose = (id: string): void => {
    const animation = fits.find((each) => each.id === id);
    if (animation) linkTile(tileset, tile.key, { animation: animation.id, tag: null, start: tile.animation?.start ?? 'together' });
  };
  return (
    <Stack gap="2xs">
      {fits.length > 0 ? (
        <Select
          size="sm"
          aria-label={TILE_ANIMATION_TEXT.choose}
          options={[{ value: WHOLE_TAG, label: TILE_ANIMATION_TEXT.chooseNone }, ...fits.map((animation) => ({ value: animation.id, label: animation.name }))]}
          value={WHOLE_TAG}
          onChange={choose}
        />
      ) : (
        <Text variant="caption" tone="muted">
          {TILE_ANIMATION_TEXT.noFit}
        </Text>
      )}
      {misfits.map((misfit) => (
        <Text key={misfit.id} variant="caption" tone="muted">
          {misfit.issue}
        </Text>
      ))}
    </Stack>
  );
};

export { AnimationChoose };
