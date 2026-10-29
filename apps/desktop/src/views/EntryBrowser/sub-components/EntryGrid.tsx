/* @layer renderer-app @kind component */
import { VirtualGrid } from '@drizztdourden08/tessera';
import type { VirtualGridCellBind } from '@drizztdourden08/tessera';
import { entryId } from '../../../sheet-manager/entry-id';
import type { EntryFacts } from '../../../sheet-manager/manager.type';
import { EntryTile, tileSize } from '../../EntryTile';
import type { BrowserBodyProps } from '../EntryBrowser.type';
import { NO_MARK } from './EntryGrid.constants';

const EntryGrid = ({ label, artwork, shown, picked, zoom, pick, activate, dragFor }: BrowserBodyProps) => {
  const size = tileSize(zoom);
  return (
    <VirtualGrid
      label={label}
      items={shown}
      getKey={entryId}
      tileWidth={size.width}
      tileHeight={size.height}
      renderTile={(fact: EntryFacts, _index: number, cell: VirtualGridCellBind) => {
        const key = entryId(fact);
        return (
          <EntryTile
            fact={fact}
            artwork={artwork}
            box={zoom}
            cell={{
              ...cell,
              onKeyDown: (event) => {
                cell.onKeyDown(event);
                if (event.key === 'Enter') activate(key);
                if (event.key === ' ') {
                  event.preventDefault();
                  pick(key, 'toggle');
                }
              },
            }}
            state={{ mark: NO_MARK, selected: picked.includes(key), active: false, affected: false, loose: false, twin: false }}
            handlers={{
              onPick: (how) => pick(key, how),
              onEdit: () => activate(key),
              onRename: () => undefined,
              onMenu: () => {
                if (!picked.includes(key)) pick(key, 'replace');
              },
            }}
            drag={dragFor(key)}
          />
        );
      }}
    />
  );
};

export { EntryGrid };
