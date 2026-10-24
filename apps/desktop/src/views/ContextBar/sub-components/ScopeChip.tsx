/* @layer renderer-app @kind component */
import { Tag } from '@drizztdourden08/tessera';
import { ActionHint } from '../../ActionHint';
import { PixelIcon } from '../../PixelIcon';
import { CONTEXT_TEXT, SCOPE_DESCRIPTION } from '../ContextBar.constants';
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
    <ActionHint hint={{ name: chip.full, description: SCOPE_DESCRIPTION }} className="scope-chip">
      {chip.danger ? <Tag variant="urgency" color="danger">{body}</Tag> : <Tag>{body}</Tag>}
    </ActionHint>
  );
};

export { ScopeChip };
