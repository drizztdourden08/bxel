/* @layer renderer-app @kind component */
import { Box } from '@drizztdourden08/tessera';
import type { CSSProperties, MouseEvent } from 'react';
import { EMPTY_STATUS, FILE_NEW_KEY, FOLDER_NEW_KEY } from '../../../../../project-browser/project-browser.constants';
import { rowLabel } from '../../../../../project-browser/row-label';
import { ITEM_ATTRIBUTE, ROW_INDEX_ATTRIBUTE } from '../../../ProjectPanel.constants';
import type { TreeRowProps } from '../ProjectTree.type';
import { RowBadges } from './RowBadges';
import { RowEditor } from './RowEditor';
import { RowLead } from './RowLead';
import { RowMore } from './RowMore';
import { RowName } from './RowName';
import './TreeRow.css';

const TreeRow = ({ model, row, index, tabbable }: TreeRowProps) => {
  const { item, depth, posinset, setsize, expanded, count } = row;
  const { selection, rowActions, drag, edit, data } = model;
  const status = data.statuses.get(item.key) ?? EMPTY_STATUS;
  const creating = item.key === FILE_NEW_KEY || item.key === FOLDER_NEW_KEY;
  const editing = creating || (edit.editing?.kind === 'rename' && edit.editing.key === item.key);
  const parts = { model, item, status };
  const placed = { '--tree-index': index, '--tree-depth': depth } as CSSProperties;
  const indexed = { [ITEM_ATTRIBUTE]: item.key, [ROW_INDEX_ATTRIBUTE]: index };
  const click = (event: MouseEvent<HTMLElement>): void =>
    rowActions.pick(item, { shift: event.shiftKey, toggle: event.ctrlKey || event.metaKey, detail: event.detail });
  return (
    <Box
      role="treeitem"
      className="project-row"
      tabIndex={tabbable ? 0 : -1}
      aria-level={depth + 1}
      aria-posinset={posinset}
      aria-setsize={setsize}
      aria-expanded={expanded ?? undefined}
      aria-selected={selection.keys.has(item.key)}
      aria-label={editing ? undefined : rowLabel(item, status, expanded !== null)}
      data-active={status.active}
      data-ghost={item.role === 'ghost'}
      data-group={item.role === 'group'}
      data-drop={drag.dropKey === item.key}
      style={placed}
      {...indexed}
      onClick={editing ? undefined : click}
      onDoubleClick={editing || expanded !== null ? undefined : () => rowActions.open(item)}
      onFocus={() => selection.focusOn(item.key)}
      {...(editing ? {} : drag.dragProps(item))}
      {...drag.dropProps(item)}
    >
      <RowLead {...parts} expanded={expanded} />
      {editing ? <RowEditor {...parts} creating={creating} /> : <RowName {...parts} count={count} />}
      {editing ? null : <RowBadges {...parts} />}
      {editing || creating ? null : <RowMore {...parts} />}
    </Box>
  );
};

export { TreeRow };
