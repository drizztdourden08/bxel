/* @layer renderer-app @kind component */
import { Tag } from '@drizztdourden08/tessera';
import { ActionHint } from '../../ActionHint';
import { PixelIcon } from '../../PixelIcon';
import { SCOPE_DESCRIPTION, SCOPE_TEXT } from '../ScopeBar.constants';
import type { ScopeChipProps } from '../ScopeBar.type';

const ScopeChip = ({ chip }: ScopeChipProps) => {
  const body = (
    <>
      {chip.locked && <PixelIcon name="lock" size={12} label={SCOPE_TEXT.lockedIcon} />}
      {chip.locked && ' '}
      {chip.text}
    </>
  );
  return (
    <ActionHint hint={{ name: chip.full, description: SCOPE_DESCRIPTION }} className="scope-chip">
      {chip.danger ? <Tag variant="urgency" color="danger">{body}</Tag> : <Tag>{body}</Tag>}
    </ActionHint>
  );
};

export { ScopeChip };
