/* @layer renderer-app @kind component */
import { ContextMenu } from '@drizztdourden08/tessera';
import type { EntryMenuProps } from '../ProjectBrowser.type';

const EntryMenu = ({ point, groups, label, onClose }: EntryMenuProps) =>
  point === null ? null : <ContextMenu groups={groups} label={label} open point={point} onClose={onClose} />;

export { EntryMenu };
