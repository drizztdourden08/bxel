/* @layer renderer-app @kind component */
import { Box, Icon, Image } from '@drizztdourden08/tessera';
import { useRef } from 'react';
import type { IconName } from '@drizztdourden08/tessera';
import { useThumb } from '../../../../../asset-thumbs/useThumb';
import { ITEM_ICON } from '../../../../../panel-browser/project-browser.constants';
import { useAssetDragOut } from '../../../behavior/useAssetDragOut';
import type { RowThumbProps } from '../ProjectTree.type';
import './RowThumb.css';

const iconOf = ({ item, model, expanded }: RowThumbProps): IconName => {
  if (item.role === 'linked') return 'link';
  if (item.kind !== 'folder') return ITEM_ICON[item.kind];
  const role = model.roleKinds.get(item.key.toLowerCase());
  if (role !== undefined) return ITEM_ICON[role];
  return expanded ? 'folder-open' : 'folder';
};

const RowThumb = (props: RowThumbProps) => {
  const { item, status, model } = props;
  const url = useThumb(item);
  const ref = useRef<HTMLDivElement>(null);
  useAssetDragOut(ref, item, model.selection);
  const fallback = <Icon name={iconOf(props)} />;
  return (
    <Box
      ref={ref}
      className="project-thumb"
      data-plain={item.kind === 'folder' || url === null}
      data-ghost={item.role === 'ghost'}
      data-active={status.active}
      title={item.role === 'ghost' || item.kind === 'folder' ? undefined : 'Drag to a canvas, a timeline or a folder'}
      onPointerDown={(event) => event.stopPropagation()}
    >
      {url === null ? fallback : <Image className="project-thumb__img" src={url} alt="" fit="contain" pixelated fallback={fallback} />}
    </Box>
  );
};

export { RowThumb };
