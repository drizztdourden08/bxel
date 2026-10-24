/* @layer renderer-app @kind logic */
import { toast } from '@drizztdourden08/brock-react';
import type { BankId, SpriteId } from '@bxel/document';
import { useChangeStore } from '../stores/useChangeStore';
import { useDocumentStore } from '../stores/useDocumentStore';
import { CHANGE_TEXT } from './palette-change.constants';

const startSwitch = (spriteId: SpriteId, toBankId: BankId | undefined): void => {
  const { host, activeId } = useDocumentStore.getState();
  const artwork = activeId === null ? undefined : host.view(activeId)?.state.artwork;
  const sprite = artwork?.sprites.find((each) => each.id === spriteId);
  if (activeId === null || !sprite) {
    toast(CHANGE_TEXT.noFile, { variant: 'info' });
    return;
  }
  useChangeStore.getState().propose({ kind: 'switch', documentId: activeId, bankId: sprite.bankId, swatch: 0, other: null, cap: 0, spriteId, ...(toBankId === undefined ? {} : { toBankId }) });
};

export { startSwitch };
