/* @layer renderer-app @kind component */
import { Tag, Tooltip } from '@drizztdourden08/tessera';
import { PixelIcon } from '../../PixelIcon';
import { CONTEXT_TEXT } from '../ContextBar.constants';
import type { ScopeChipProps } from '../ContextBar.type';

const ScopeChip = ({ chip }: ScopeChipProps) => {
  const body = (
    <>
      {chip.locked && <PixelIcon name="lock" size={12} label={CONTEXT_TEXT.lockedIcon} />}
      {chip.locked && ' '}
      {chip.text}
    </>
  );
  return (
    <Tooltip content={chip.full} placement="bottom" className="scope-chip">
      {chip.danger ? <Tag variant="urgency" color="danger">{body}</Tag> : <Tag>{body}</Tag>}
    </Tooltip>
  );
};

export { ScopeChip };
