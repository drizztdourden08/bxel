/* @layer renderer-app @kind component */
import { Pressable } from '@drizztdourden08/tessera';
import { MANAGER_TEXT } from '../../../sheet-manager/manager-text.constants';
import { spriteEvents } from '../behavior/sprite-events';
import { tileClass } from '../behavior/tile-class';
import type { SpriteButtonProps } from '../SpritesPanel.type';

const SpriteButton = ({ fact, base, state, drag, handlers, children }: SpriteButtonProps) => {
  const { sprite } = fact;
  return (
    <Pressable
      type="button"
      className={tileClass(base, state)}
      aria-pressed={state.selected}
      aria-label={MANAGER_TEXT.tile(sprite.name, sprite.width, sprite.height)}
      title={state.loose ? MANAGER_TEXT.badgeUnplaced : MANAGER_TEXT.badgeSheets(fact.sheets)}
      data-sprite-id={sprite.id}
      draggable
      {...spriteEvents(handlers)}
      {...drag}
    >
      {children}
    </Pressable>
  );
};

export { SpriteButton };
