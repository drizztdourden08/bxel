/* @layer renderer-app @kind component */
import { Box, DataTable, MarqueeBox } from '@drizztdourden08/tessera';
import { FOLDER_TEXT } from '../../../sheet-manager/folder-text.constants';
import { MANAGER_TEXT } from '../../../sheet-manager/manager-text.constants';
import { useManagerStore } from '../../../stores/useManagerStore';
import { groupActions } from '../behavior/group-actions';
import { moveRow } from '../behavior/move-row';
import { pickIds } from '../behavior/pick-ids';
import { rowEvents } from '../behavior/row-events';
import { useListData } from '../behavior/useListData';
import { useListScroll } from '../behavior/useListScroll';
import { useSpriteMarquee } from '../behavior/useSpriteMarquee';
import { DRAG_TYPE, LIST_COLUMNS, LIST_COUNT_LABEL, LIST_LABEL, LIST_SCHEMA, LIST_VIEW_KEY, VIRTUAL_LIST_MIN } from '../SpritesPanel.constants';
import type { ListRow, SpriteViewProps } from '../SpritesPanel.type';

const rowId = (row: ListRow): string => row.id;

const rowDrag = (row: ListRow): Record<string, string> => ({ [DRAG_TYPE]: row.id });

const SpriteList = ({ model, table, handlersFor }: SpriteViewProps) => {
  const closed = new Set(useManagerStore((state) => state.collapsed));
  const data = useListData(model);
  const marquee = useSpriteMarquee(model, table);
  useListScroll(table, marquee.area, model.scene.active?.id ?? null);
  return (
    <Box role="region" aria-label={LIST_LABEL} className="sprites-panel__table" onClick={marquee.onClick} {...rowEvents(handlersFor, data.known)}>
      <DataTable
        key={data.folders.join('\n')}
        ref={table}
        rows={data.rows}
        schema={LIST_SCHEMA}
        getRowId={rowId}
        viewKey={LIST_VIEW_KEY}
        fallbackColumns={LIST_COLUMNS}
        {...(data.folders.length > 0 ? { fallbackGroupBy: ['folder'] } : {})}
        defaultExpanded={(key) => !closed.has(key === FOLDER_TEXT.root ? '' : key)}
        virtualizeFrom={VIRTUAL_LIST_MIN}
        selectable
        selectedIds={data.selected}
        onSelectionChange={pickIds(data.known)}
        groupActions={groupActions}
        onRowMove={(from, target) => moveRow(model, from, target)}
        rowDragData={rowDrag}
        countLabel={LIST_COUNT_LABEL}
        emptyMessage={MANAGER_TEXT.noMatch}
        scrollRef={marquee.area}
        bind={{ onPointerDown: marquee.onPointerDown }}
        overlay={<MarqueeBox rect={marquee.rect} />}
      />
    </Box>
  );
};

export { SpriteList };
