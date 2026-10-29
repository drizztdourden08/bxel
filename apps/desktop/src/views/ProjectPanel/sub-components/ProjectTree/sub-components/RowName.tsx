/* @layer renderer-app @kind component */
import { Box, Text } from '@drizztdourden08/tessera';
import { KIND_LABEL } from '../../../../../asset-list/asset-list.constants';
import { listKindOf } from '../../../../../panel-browser/list-kind-of';
import type { RowNameProps } from '../ProjectTree.type';
import './RowName.css';

const metaOf = ({ item, model }: Pick<RowNameProps, 'item' | 'model'>): string | null => {
  if (item.role === 'group' || item.kind === 'folder' || model.browser.mode !== 'list' || model.density !== 'comfortable') return null;
  const folder = item.parentKey === null ? null : model.data.tree.items.get(item.parentKey)?.name;
  return `${KIND_LABEL[listKindOf(item)]}${folder ? ` in ${folder}` : ''}`;
};

const RowName = ({ item, model, count }: RowNameProps) => {
  const meta = metaOf({ item, model });
  return (
    <Box className="project-name" data-ghost={item.role === 'ghost'} data-group={item.role === 'group'}>
      <Text variant="label" className="project-name__text">
        {item.name}
      </Text>
      {meta === null ? null : (
        <Text variant="caption" tone="muted" className="project-name__meta">
          {meta}
        </Text>
      )}
      {count === undefined ? null : (
        <Text variant="caption" tone="muted" className="project-name__count">
          {count}
        </Text>
      )}
    </Box>
  );
};

export { RowName };
