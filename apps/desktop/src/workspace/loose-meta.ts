/* @layer renderer-app @kind logic */
import type { ArtworkId, BankId, IdSource, WorkspaceMeta } from '@bxel/document';
import { NO_BANK_ID } from './workspace.constants';

const looseMeta = (ids: IdSource, name: string): WorkspaceMeta => ({
  id: ids.next('art') as ArtworkId,
  name,
  defaultBankId: NO_BANK_ID as BankId,
  coverSpriteId: null,
  presets: [],
});

export { looseMeta };
