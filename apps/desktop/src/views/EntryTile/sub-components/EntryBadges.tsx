/* @layer renderer-app @kind component */
import { Flex, Icon, Text } from '@drizztdourden08/tessera';
import { badgeMarks } from '../behavior/badge-marks';
import type { EntryBadgesProps } from '../EntryTile.type';

const EntryBadges = ({ fact, twin }: EntryBadgesProps) => (
  <Flex gap="2xs" className="entry-tile__badges">
    {badgeMarks(fact, twin).map((mark) => (
      <Text key={mark.key} as="span" variant="caption" className="entry-tile__badge" title={mark.title}>
        <Icon name={mark.icon} size={12} />
        {` ${mark.text}`}
      </Text>
    ))}
  </Flex>
);

export { EntryBadges };
