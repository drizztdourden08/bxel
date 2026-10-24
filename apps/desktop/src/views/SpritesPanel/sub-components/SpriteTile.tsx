/* @layer renderer-app @kind component */
import { Pressable, Text } from '@drizztdourden08/tessera';
import { pickHow } from '../../../sheet/pick-how';
import { SPRITES_TEXT } from '../SpritesPanel.constants';
import type { SpriteTileProps } from '../SpritesPanel.type';
import { tileClass } from '../behavior/tile-class';
import { SpriteThumb } from './SpriteThumb';

const SpriteTile = ({ sprite, image, selected, active, affected, drag, onPick, onRename }: SpriteTileProps) => (
  <Pressable
    type="button"
    className={tileClass(active, affected)}
    aria-pressed={selected}
    aria-label={SPRITES_TEXT.tile(sprite.name, sprite.width, sprite.height)}
    data-sprite-id={sprite.id}
    draggable
    onClick={(event) => onPick(pickHow(event) ?? 'replace')}
    onDoubleClick={onRename}
    {...drag}
  >
    <SpriteThumb image={image} />
    <Text as="span" variant="caption" className="sprites-panel__name">{sprite.name}</Text>
  </Pressable>
);

export { SpriteTile };
