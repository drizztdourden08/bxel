/* @layer renderer-app @kind component */
import { GroupTree, Icon, Text } from '@drizztdourden08/tessera';
import type { SourceItem } from '../../../project-browser/project-browser.type';
import type { SourceTreeProps } from '../ProjectBrowser.type';

const SourceTree = ({ label, root, selectedKey, expandToDepth = 0, onSelect }: SourceTreeProps) => (
  <GroupTree<SourceItem>
    root={root}
    label={label}
    expandToDepth={expandToDepth}
    selectedKey={selectedKey}
    getItemKey={(item) => item.key}
    itemIcon={(item) => <Icon name={item.icon} size={14} />}
    renderItem={(item) => (
      <>
        {item.label}
        {item.count !== null && (
          <Text as="span" variant="caption" tone="muted">
            {` ${item.count}`}
          </Text>
        )}
      </>
    )}
    onSelect={(key) => onSelect(key)}
    onActivate={(item) => onSelect(item.key)}
  />
);

export { SourceTree };
