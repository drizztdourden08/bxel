/* @layer renderer-app @kind component */
import { GroupTree, Icon } from '@drizztdourden08/tessera';
import type { SourceItem } from '../../../project-browser/project-browser.type';
import type { SourceTreeProps } from '../ProjectBrowser.type';
import { SourceLabel } from './SourceLabel';

const SourceTree = ({ label, root, selectedKey, expandToDepth = 0, drop, onSelect }: SourceTreeProps) => (
  <GroupTree<SourceItem>
    root={root}
    label={label}
    expandToDepth={expandToDepth}
    selectedKey={selectedKey}
    getItemKey={(item) => item.key}
    itemIcon={(item) => <Icon name={item.icon} size={14} />}
    renderItem={(item) => <SourceLabel item={item} drop={drop} />}
    onSelect={(key) => onSelect(key)}
    onActivate={(item) => onSelect(item.key)}
  />
);

export { SourceTree };
