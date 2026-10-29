/* @layer renderer-app @kind component */
import { Flex, Text } from '@drizztdourden08/tessera';
import { slotView } from '../behavior/slot-view';
import { TILE_ANIMATION_TEXT } from '../../../tile-animation/tile-animation.constants';
import type { TilesetModelProps } from '../TilesetPanel.type';
import { TileThumb } from './TileThumb';

const AnimationFrames = ({ model }: TilesetModelProps) => {
  const view = slotView(model.artwork, model.tileset);
  return (
    <Flex gap="xs" wrap role="list" aria-label={TILE_ANIMATION_TEXT.frames}>
      {model.selected.map((key, at) => {
        const cell = model.byKey.get(key);
        return cell ? (
          <Flex key={key} gap="2xs" align="center" role="listitem" className="tileset-panel__frame">
            <Text variant="caption" tone="muted" numeric>
              {at + 1}
            </Text>
            <TileThumb view={view} cell={cell} />
          </Flex>
        ) : null;
      })}
    </Flex>
  );
};

export { AnimationFrames };
