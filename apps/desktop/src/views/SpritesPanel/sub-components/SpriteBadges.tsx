/* @layer renderer-app @kind component */
import { Flex, Text } from '@drizztdourden08/tessera';
import { IDENTICAL_TEXT } from '../../../sheet-manager/identical-text.constants';
import { MANAGER_TEXT } from '../../../sheet-manager/manager-text.constants';
import type { SpriteBadgesProps } from '../SpritesPanel.type';

const SpriteBadges = ({ fact, twin }: SpriteBadgesProps) => (
  <Flex gap="2xs" className="sprites-panel__badges">
    {twin && (
      <Text as="span" variant="caption" className="sprites-panel__badge" title={IDENTICAL_TEXT.badge}>
        =
      </Text>
    )}
    {fact.slices > 0 && (
      <Text as="span" variant="caption" className="sprites-panel__badge" title={MANAGER_TEXT.badgeSlices(fact.slices)}>
        {`S${fact.slices}`}
      </Text>
    )}
  </Flex>
);

export { SpriteBadges };
