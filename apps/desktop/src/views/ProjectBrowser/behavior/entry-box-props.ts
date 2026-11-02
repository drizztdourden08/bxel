/* @layer renderer-app @kind logic */
import type { EntryHandlers } from './entry-box-props.type';

const entryBoxProps = (handlers: EntryHandlers) => ({
  onClick: handlers.onClick,
  onDoubleClick: handlers.onDoubleClick,
  onMouseDown: handlers.onMouseDown,
  onAuxClick: handlers.onAuxClick,
  onContextMenu: handlers.onContextMenu,
});

export { entryBoxProps };
