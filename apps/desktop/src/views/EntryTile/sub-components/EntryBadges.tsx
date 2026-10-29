/* @layer renderer-app @kind component */
import { Flex, Icon, Text } from '@drizztdourden08/tessera';
import type { IconName } from '@drizztdourden08/tessera';
import { ENTRY_TILE_TEXT } from '../EntryTile.constants';
import type { EntryBadgesProps } from '../EntryTile.type';

const badge = (key: string, icon: IconName, title: string) => (
  <Text key={key} as="span" variant="caption" className="entry-tile__badge" title={title}>
    <Icon name={icon} size={12} />
  </Text>
);

const EntryBadges = ({ fact, twin }: EntryBadgesProps) => (
  <Flex gap="2xs" className="entry-tile__badges" aria-hidden="true">
    {fact.kind === 'animation' && badge('film', 'pixel-animation', ENTRY_TILE_TEXT.frames(fact.frames))}
    {twin && badge('twin', 'copy', ENTRY_TILE_TEXT.twin)}
    {fact.kind === 'sprite' && fact.slices > 0 && badge('slices', 'pixel-select-rect', ENTRY_TILE_TEXT.slices(fact.slices))}
    {fact.kind === 'sprite' && fact.strip !== null && badge('strip', 'pixel-grid', ENTRY_TILE_TEXT.strip(fact.strip))}
    {fact.sheets.length > 1 && badge('sheets', 'link', ENTRY_TILE_TEXT.onSheets(fact.sheets))}
  </Flex>
);

export { EntryBadges };
