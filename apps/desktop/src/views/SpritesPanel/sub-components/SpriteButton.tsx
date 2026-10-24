/* @layer renderer-app @kind component */
import { Pressable } from '@drizztdourden08/tessera';
import { MANAGER_TEXT } from '../../../sheet-manager/manager-text.constants';
import { pickHow } from '../../../sheet/pick-how';
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
      data-marquee-key={sprite.id}
      draggable
      onClick={(event) => handlers.onPick(pickHow(event) ?? 'replace')}
      onDoubleClick={handlers.onRename}
      onContextMenu={() => handlers.onMenu()}
      {...drag}
    >
      {children}
    </Pressable>
  );
};

export { SpriteButton };
