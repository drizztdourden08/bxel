/* @layer renderer-app @kind logic */
import type { EntryHandlers } from './entry-box-props.type';

const entryBoxProps = (handlers: EntryHandlers) => ({
  draggable: !handlers.renaming,
  onClick: handlers.onClick,
  onDoubleClick: handlers.onDoubleClick,
  onMouseDown: handlers.onMouseDown,
  onAuxClick: handlers.onAuxClick,
  onContextMenu: handlers.onContextMenu,
  onDragStart: handlers.onDragStart,
});

export { entryBoxProps };
