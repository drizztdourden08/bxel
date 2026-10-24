/* @layer renderer-app @kind component */
import { Text } from '@drizztdourden08/tessera';
import type { SpriteTileProps } from '../SpritesPanel.type';
import { SpriteBadges } from './SpriteBadges';
import { SpriteButton } from './SpriteButton';
import { SpriteThumb } from './SpriteThumb';

const SpriteTile = ({ fact, artwork, box, state, drag, handlers }: SpriteTileProps) => (
  <SpriteButton fact={fact} base="sprites-panel__tile" state={state} drag={drag} handlers={handlers}>
    <SpriteThumb artwork={artwork} sprite={fact.sprite} box={box} />
    <SpriteBadges fact={fact} twin={state.twin} />
    <Text as="span" variant="caption" className="sprites-panel__name">
      {fact.sprite.name}
    </Text>
  </SpriteButton>
);

export { SpriteTile };
