/* @layer renderer-app @kind component */
import { Flex, Text } from '@drizztdourden08/tessera';
import { useState } from 'react';
import { MANAGER_TEXT } from '../../../sheet-manager/manager-text.constants';
import { EntryThumb } from '../../EntryTile';
import { LIST_THUMB } from '../SpritesPanel.constants';
import type { SpriteNameCellProps } from '../SpritesPanel.type';
import { entryName } from '../../../sheet-manager/entry-name';

const SpriteNameCell = ({ artwork, fact, loose }: SpriteNameCellProps) => {
  const [hot, setHot] = useState(false);
  return (
    <Flex gap="xs" align="center" onPointerEnter={() => setHot(true)} onPointerLeave={() => setHot(false)}>
      <EntryThumb artwork={artwork} fact={fact} box={LIST_THUMB} playing={hot} />
      <Text as="span" variant="caption" className="sprites-panel__rowname" title={loose ? MANAGER_TEXT.badgeUnplaced : undefined}>
        {entryName(fact)}
      </Text>
    </Flex>
  );
};

export { SpriteNameCell };
