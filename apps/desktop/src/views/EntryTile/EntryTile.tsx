/* @layer renderer-app @kind component */
import { Box, Icon, Tile } from '@drizztdourden08/tessera';
import { useId, useRef, useState } from 'react';
import { useEntryDragSource } from '../../asset-drag/useEntryDragSource';
import { pickHow } from '../../sheet/pick-how';
import { ENTRY_TILE_TEXT, MEDIA_ASPECT } from './EntryTile.constants';
import type { EntryTileProps } from './EntryTile.type';
import { entryDetail } from './behavior/entry-detail';
import { entryLabel } from './behavior/entry-label';
import { entryName } from './behavior/entry-name';
import { entryTileClass } from './behavior/entry-tile-class';
import { EntryBadges } from './sub-components/EntryBadges';
import { EntryName } from './sub-components/EntryName';
import { EntryThumb } from './sub-components/EntryThumb';
import './EntryTile.css';

const EntryTile = ({ fact, artwork, box, state, drag, handlers, cell }: EntryTileProps) => {
  const [hot, setHot] = useState(false);
  const ref = useRef<HTMLElement>(null);
  useEntryDragSource(ref, drag);
  const detailId = useId();
  const { className, onFocus, ...bind } = cell;
  const id = fact.kind === 'sprite' ? fact.sprite.id : fact.key;
  return (
    <Box
      ref={ref}
      {...bind}
      className={`${className} ${entryTileClass(state)}`}
      aria-label={entryLabel(fact, state.twin)}
      aria-describedby={detailId}
      aria-selected={state.selected}
      title={state.loose ? ENTRY_TILE_TEXT.notOnSheet : ENTRY_TILE_TEXT.onSheets(fact.sheets)}
      data-sprite-id={id}
      data-entry-kind={fact.kind}
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
    >
      <Box as="span" id={detailId} hidden>
        {entryDetail(fact, state)}
      </Box>
      <Tile
        selected={state.selected}
        mediaAspect={MEDIA_ASPECT}
        media={<EntryThumb fact={fact} artwork={artwork} box={box} playing={hot} />}
        corners={{
          topStart: state.selected ? (
            <Box as="span" className="entry-tile__check" aria-hidden="true">
              <Icon name="check" size={12} />
            </Box>
          ) : undefined,
          topEnd: <EntryBadges fact={fact} twin={state.twin} {...(state.warning === undefined ? {} : { warning: state.warning })} />,
        }}
        name={<EntryName name={entryName(fact)} />}
      />
    </Box>
  );
};

export { EntryTile };
