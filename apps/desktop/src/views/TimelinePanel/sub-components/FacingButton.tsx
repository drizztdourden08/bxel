/* @layer renderer-app @kind component */
import { Button, Icon } from '@drizztdourden08/tessera';
import { addTag } from '../../../timeline/add-tag';
import { facingTag } from '../../../timeline/facing-tag';
import { pickFacing } from '../../../timeline/pick-facing';
import { FACING_TEXT, TIMELINE_TEXT } from '../../../timeline/timeline.constants';
import { facingState } from '../behavior/facing-state';
import { FACING_ABBREVIATION, TIMELINE_PANEL_TEXT } from '../TimelinePanel.constants';
import type { FacingButtonProps } from './FacingButton.type';

const FacingButton = ({ focus, facing, tagId }: FacingButtonProps) => {
  const tag = facingTag(focus.animation, facing);
  const label = tag === undefined ? TIMELINE_PANEL_TEXT.addFacing : TIMELINE_TEXT.facingLabel(FACING_TEXT[facing], true);
  return (
    <Button
      size="sm"
      variant={tag?.id === tagId ? 'primary' : 'secondary'}
      className="direction-pad__facing"
      data-state={facingState(tag)}
      disabled={tag === undefined && focus.readOnly}
      aria-pressed={tag?.id === tagId}
      aria-label={tag === undefined ? `${label}: ${FACING_TEXT[facing]}` : label}
      onClick={() => (tag === undefined ? addTag(undefined, facing) : pickFacing(facing))}
    >
      {tag?.kind === 'mirror' && <Icon name={tag.flip === 'y' ? 'pixel-flip-v' : 'pixel-flip-h'} size={10} aria-hidden="true" />}
      {FACING_ABBREVIATION[facing]}
    </Button>
  );
};

export { FacingButton };
