/* @layer renderer-app @kind component */
import { Icon } from '@drizztdourden08/tessera';
import type { SlotIconProps } from './SlotIcon.type';
import './SlotIcon.css';

const SlotIcon = ({ member, filled, mark, badge }: SlotIconProps) => (
  <span className="slot-icon">
    <Icon name={filled && member.filledIcon ? member.filledIcon : member.icon} />
    {mark === 'corner' && <span className="slot-icon__corner" aria-hidden="true" />}
    {mark === 'dot' && <span className="slot-icon__dot" aria-hidden="true" />}
    {badge && (
      <span className="slot-icon__badge" aria-hidden="true">
        {badge.glyph}
      </span>
    )}
  </span>
);

export { SlotIcon };
