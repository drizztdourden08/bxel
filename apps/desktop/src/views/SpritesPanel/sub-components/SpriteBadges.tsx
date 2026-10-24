/* @layer renderer-app @kind component */
import { Flex, Text } from '@drizztdourden08/tessera';
import { MANAGER_TEXT } from '../../../sheet-manager/manager-text.constants';
import type { SpriteBadgesProps } from '../SpritesPanel.type';

const SpriteBadges = ({ fact }: SpriteBadgesProps) => (
  <Flex gap="2xs" className="sprites-panel__badges">
    {fact.frames > 1 && (
      <Text as="span" variant="caption" className="sprites-panel__badge" title={MANAGER_TEXT.badgeFrames(fact.frames)}>
        {fact.frames}
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
