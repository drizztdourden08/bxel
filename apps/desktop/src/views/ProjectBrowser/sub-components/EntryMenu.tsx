/* @layer renderer-app @kind component */
import { ContextMenu } from '@drizztdourden08/tessera';
import type { MenuGroup } from '@drizztdourden08/tessera';
import type { ContextMenuPoint } from '@drizztdourden08/tessera';

type EntryMenuProps = { readonly point: ContextMenuPoint | null; readonly groups: readonly MenuGroup[]; readonly label: string; readonly onClose: () => void };

/** The menu a right click opens on one entry. It draws nothing until it is asked for a point. */
const EntryMenu = ({ point, groups, label, onClose }: EntryMenuProps) =>
  point === null ? null : <ContextMenu groups={groups} label={label} open point={point} onClose={onClose} />;

export { EntryMenu };
