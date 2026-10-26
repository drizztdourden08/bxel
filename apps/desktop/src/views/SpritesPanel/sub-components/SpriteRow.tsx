/* @layer renderer-app @kind component */
import { findBank } from '@bxel/document';
import { Box, Text } from '@drizztdourden08/tessera';
import { MANAGER_TEXT } from '../../../sheet-manager/manager-text.constants';
import { pivotLabel } from '../../../sheet-manager/pivot-label';
import { spriteEvents } from '../behavior/sprite-events';
import { tileClass } from '../behavior/tile-class';
import { LIST_THUMB } from '../SpritesPanel.constants';
import type { SpriteRowProps } from '../SpritesPanel.type';
import { SpriteThumb } from './SpriteThumb';

const SpriteRow = ({ fact, artwork, state, drag, handlers, place }: SpriteRowProps) => {
  const { sprite } = fact;
  return (
    <Box
      role="row"
      aria-selected={state.selected}
      tabIndex={0}
      className={tileClass('sprites-panel__row', state)}
      title={state.loose ? MANAGER_TEXT.badgeUnplaced : MANAGER_TEXT.badgeSheets(fact.sheets)}
      data-sprite-id={sprite.id}
      draggable
      {...spriteEvents(handlers)}
      {...drag}
      {...place}
    >
      <Box role="gridcell">
        <SpriteThumb artwork={artwork} sprite={sprite} box={LIST_THUMB} />
      </Box>
      <Text as="span" role="gridcell" variant="caption" className="sprites-panel__cell sprites-panel__cell--name">{sprite.name}</Text>
      <Text as="span" role="gridcell" variant="caption" numeric className="sprites-panel__cell">{`${sprite.width}x${sprite.height}`}</Text>
      <Text as="span" role="gridcell" variant="caption" numeric className="sprites-panel__cell">{pivotLabel(sprite)}</Text>
      <Text as="span" role="gridcell" variant="caption" numeric className="sprites-panel__cell">{fact.frames}</Text>
      <Text as="span" role="gridcell" variant="caption" numeric className="sprites-panel__cell">{fact.tags}</Text>
      <Text as="span" role="gridcell" variant="caption" className="sprites-panel__cell">{findBank(artwork, sprite.bankId)?.name ?? ''}</Text>
    </Box>
  );
};

export { SpriteRow };
