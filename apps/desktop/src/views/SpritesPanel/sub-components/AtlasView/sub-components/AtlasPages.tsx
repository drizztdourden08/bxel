/* @layer renderer-app @kind component */
import { Flex, Icon, IconButton, Text } from '@drizztdourden08/tessera';
import { ATLAS_TEXT } from '../../../../../sheet-manager/manager-text.constants';
import { useManagerStore } from '../../../../../stores/useManagerStore';
import type { AtlasPagesProps } from '../AtlasView.type';

const AtlasPages = ({ page, count }: AtlasPagesProps) => {
  const patchAtlas = useManagerStore((state) => state.patchAtlas);
  if (count < 2) return null;
  return (
    <Flex gap="xs" align="center">
      <IconButton label={ATLAS_TEXT.previous} size="sm" disabled={page === 0} onClick={() => patchAtlas({ page: page - 1 })}>
        <Icon name="arrow-left" size={16} />
      </IconButton>
      <Text variant="caption">{ATLAS_TEXT.page(page + 1, count)}</Text>
      <IconButton label={ATLAS_TEXT.next} size="sm" disabled={page >= count - 1} onClick={() => patchAtlas({ page: page + 1 })}>
        <Icon name="arrow-right" size={16} />
      </IconButton>
    </Flex>
  );
};

export { AtlasPages };
