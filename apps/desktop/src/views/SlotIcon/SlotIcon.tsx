/* @layer renderer-app @kind component */
import { Box, Icon } from '@drizztdourden08/tessera';
import type { SlotIconProps } from './SlotIcon.type';
import './SlotIcon.css';

const SlotIcon = ({ member, filled, mark, badge, assistant = false }: SlotIconProps) => (
  <Box as="span" className="slot-icon" data-assistant={assistant ? 'true' : undefined}>
    <Icon name={filled && member.filledIcon ? member.filledIcon : member.icon} />
    {assistant && <Box as="span" className="slot-icon__assistant" aria-hidden="true" />}
    {mark === 'corner' && <Box as="span" className="slot-icon__corner" aria-hidden="true" />}
    {mark === 'dot' && <Box as="span" className="slot-icon__dot" aria-hidden="true" />}
    {badge && (
      <Box as="span" className="slot-icon__badge" aria-hidden="true">
        {badge.glyph}
      </Box>
    )}
  </Box>
);

export { SlotIcon };
