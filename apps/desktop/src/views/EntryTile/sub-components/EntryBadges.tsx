/* @layer renderer-app @kind component */
import { Flex, Icon, Text } from '@drizztdourden08/tessera';
import { ENTRY_TILE_TEXT } from '../EntryTile.constants';
import type { EntryBadgesProps } from '../EntryTile.type';

const EntryBadges = ({ fact, twin }: EntryBadgesProps) => (
  <Flex gap="2xs" className="entry-tile__badges">
    {fact.kind === 'animation' && (
      <Text as="span" variant="caption" className="entry-tile__badge entry-tile__badge--film" title={ENTRY_TILE_TEXT.frames(fact.frames)}>
        <Icon name="pixel-animation" size={12} />
        {fact.frames}
      </Text>
    )}
    {twin && (
      <Text as="span" variant="caption" className="entry-tile__badge" title={ENTRY_TILE_TEXT.twin}>
        =
      </Text>
    )}
    {fact.kind === 'sprite' && fact.slices > 0 && (
      <Text as="span" variant="caption" className="entry-tile__badge" title={ENTRY_TILE_TEXT.slices(fact.slices)}>
        {`S${fact.slices}`}
      </Text>
    )}
    {fact.kind === 'sprite' && fact.strip !== null && (
      <Text as="span" variant="caption" className="entry-tile__badge" title={ENTRY_TILE_TEXT.strip(fact.strip)}>
        {`x${fact.strip}`}
      </Text>
    )}
    {fact.sheets.length > 1 && (
      <Text as="span" variant="caption" className="entry-tile__badge" title={ENTRY_TILE_TEXT.onSheets(fact.sheets)}>
        <Icon name="link" size={12} />
      </Text>
    )}
  </Flex>
);

export { EntryBadges };
