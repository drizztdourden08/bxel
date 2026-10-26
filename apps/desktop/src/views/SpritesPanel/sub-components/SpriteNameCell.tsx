/* @layer renderer-app @kind component */
import { Flex, Text } from '@drizztdourden08/tessera';
import { MANAGER_TEXT } from '../../../sheet-manager/manager-text.constants';
import { LIST_THUMB } from '../SpritesPanel.constants';
import type { SpriteNameCellProps } from '../SpritesPanel.type';
import { SpriteThumb } from './SpriteThumb';

const SpriteNameCell = ({ artwork, sprite, loose }: SpriteNameCellProps) => (
  <Flex gap="xs" align="center">
    <SpriteThumb artwork={artwork} sprite={sprite} box={LIST_THUMB} />
    <Text as="span" variant="caption" className="sprites-panel__rowname" title={loose ? MANAGER_TEXT.badgeUnplaced : undefined}>
      {sprite.name}
    </Text>
  </Flex>
);

export { SpriteNameCell };
