/* @layer renderer-app @kind component */
import { Box, Icon, Tile } from '@drizztdourden08/tessera';
import { useState } from 'react';
import { pickHow } from '../../sheet/pick-how';
import { ENTRY_TILE_TEXT } from './EntryTile.constants';
import type { EntryTileProps } from './EntryTile.type';
import { entryTileClass } from './behavior/entry-tile-class';
import { EntryBadges } from './sub-components/EntryBadges';
import { EntryName } from './sub-components/EntryName';
import { EntryThumb } from './sub-components/EntryThumb';
import './EntryTile.css';

const labelOf = (fact: EntryTileProps['fact']): string => {
  if (fact.kind === 'animation') return ENTRY_TILE_TEXT.animation(fact.name, fact.frames);
  const { sprite } = fact;
  const hint = fact.strip === null ? '' : `, ${ENTRY_TILE_TEXT.strip(fact.strip)}`;
  return `${ENTRY_TILE_TEXT.sprite(sprite.name, sprite.width, sprite.height, '')}${hint}`;
};

const EntryTile = ({ fact, artwork, box, state, drag, handlers, cell }: EntryTileProps) => {
  const [hot, setHot] = useState(false);
  const { className, onFocus, ...bind } = cell;
  const id = fact.kind === 'sprite' ? fact.sprite.id : fact.key;
  return (
    <Tile
      {...bind}
      className={`${className} ${entryTileClass(state)}`}
      aria-label={labelOf(fact)}
      title={state.loose ? ENTRY_TILE_TEXT.notOnSheet : ENTRY_TILE_TEXT.onSheets(fact.sheets)}
      data-sprite-id={id}
      data-entry-kind={fact.kind}
      selected={state.selected}
      draggable
      media={<EntryThumb fact={fact} artwork={artwork} box={box} playing={hot} />}
      corners={{
        topStart: state.selected ? (
          <Box as="span" className="entry-tile__check" aria-hidden="true">
            <Icon name="check" size={12} />
          </Box>
        ) : undefined,
        topEnd: <EntryBadges fact={fact} twin={state.twin} />,
      }}
      name={<EntryName name={fact.kind === 'sprite' ? fact.sprite.name : fact.name} />}
      onFocus={() => {
        onFocus();
        setHot(true);
      }}
      onBlur={() => setHot(false)}
      onPointerEnter={() => setHot(true)}
      onPointerLeave={() => setHot(false)}
      onClick={(event) => handlers.onPick(pickHow(event) ?? 'replace')}
      onDoubleClick={handlers.onEdit}
      onContextMenu={() => handlers.onMenu()}
      {...drag}
    />
  );
};

export { EntryTile };
