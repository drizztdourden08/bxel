/* @layer renderer-app @kind logic */
import type { EntryHandlers } from './entry-box-props.type';

const entryBoxProps = (handlers: EntryHandlers, column = false) => ({
  ...handlers.osDrag,
  onClick: column ? undefined : handlers.onClick,
  onDoubleClick: column ? undefined : handlers.onDoubleClick,
  onMouseDown: handlers.onMouseDown,
  onAuxClick: handlers.onAuxClick,
  onContextMenu: handlers.onContextMenu,
});

export { entryBoxProps };
