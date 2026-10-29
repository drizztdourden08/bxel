/* @layer renderer-app @kind component */
import { Box, Button } from '@drizztdourden08/tessera';
import { useMemo, useState } from 'react';
import { dropEntries } from '../../../sheet-manager/drop-entries';
import { SHEET_TEXT } from '../../../sheet-manager/sheet-text.constants';
import { EntryBrowser } from '../../EntryBrowser';
import { defaultDragEntries } from '../../EntryBrowser/behavior/default-drag-entries';
import { useLibraryDrop } from '../behavior/useLibraryDrop';
import type { ManagerModelProps } from '../SpritesPanel.type';

const LibraryDrawer = ({ model }: ManagerModelProps) => {
  const [picked, setPicked] = useState<readonly string[]>([]);
  const drop = useLibraryDrop(model);
  const entries = useMemo(() => [...model.library.sprites, ...model.library.animations], [model.library]);
  const empty = model.artwork.sprites.some((sprite) => sprite.role === 'sprite') ? SHEET_TEXT.empty.libraryAll : SHEET_TEXT.empty.libraryNone;
  const add = (keys: readonly string[]): void => {
    if (dropEntries(defaultDragEntries(entries, keys), { key: null, side: 'after' }, model.sheet?.id ?? null)) setPicked([]);
  };
  return (
    <Box className={`library-drawer${drop.over ? ' library-drawer--over' : ''}`} {...drop.bind}>
      <EntryBrowser
        label={SHEET_TEXT.library.title}
        searchLabel={SHEET_TEXT.library.search}
        artwork={model.artwork}
        entries={entries}
        picked={picked}
        onPickedChange={setPicked}
        onActivate={(key) => add([key])}
        emptyMessage={empty}
        noMatchMessage={SHEET_TEXT.empty.libraryMatch}
        dragSource="library"
        footer={
          <Button size="xs" variant="primary" disabled={picked.length === 0} onClick={() => add(picked)}>
            {picked.length === 0 ? SHEET_TEXT.library.addNone : SHEET_TEXT.library.add(picked.length)}
          </Button>
        }
      />
      {drop.over && <Box className="library-drawer__drop">{SHEET_TEXT.library.drop}</Box>}
    </Box>
  );
};

export { LibraryDrawer };
