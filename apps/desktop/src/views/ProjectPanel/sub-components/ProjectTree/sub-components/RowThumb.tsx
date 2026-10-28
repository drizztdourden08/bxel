/* @layer renderer-app @kind component */
import { Box, Icon, Image } from '@drizztdourden08/tessera';
import type { IconName } from '@drizztdourden08/tessera';
import { useThumb } from '../../../../../asset-thumbs/useThumb';
import { ITEM_ICON } from '../../../../../project-browser/project-browser.constants';
import type { RowLeadProps } from '../ProjectTree.type';
import './RowThumb.css';

const iconOf = ({ item, model, expanded }: RowLeadProps): IconName => {
  if (item.role === 'linked') return 'link';
  if (item.kind !== 'folder') return ITEM_ICON[item.kind];
  const role = model.roleKinds.get(item.key.toLowerCase());
  if (role !== undefined) return ITEM_ICON[role];
  return expanded === true ? 'folder-open' : 'folder';
};

const RowThumb = (props: RowLeadProps) => {
  const { item } = props;
  const url = useThumb(item);
  const fallback = <Icon name={iconOf(props)} />;
  return (
    <Box className="project-thumb" data-plain={item.kind === 'folder' || url === null} data-ghost={item.role === 'ghost'}>
      {url === null ? fallback : <Image className="project-thumb__img" src={url} alt="" fit="contain" pixelated fallback={fallback} />}
    </Box>
  );
};

export { RowThumb };
