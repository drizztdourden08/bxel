/* @layer core @kind logic */
import type { IdSource } from '../ids/id-source.type';
import type { ArtworkId, BankId } from '../model/ids.type';
import { DEFAULT_WORKSPACE_NAME, NO_BANK_ID } from './workspace.constants';
import type { WorkspaceMeta } from './workspace-meta.type';

const defaultMeta = (ids: IdSource): WorkspaceMeta => ({
  id: ids.next('art') as ArtworkId,
  name: DEFAULT_WORKSPACE_NAME,
  defaultBankId: NO_BANK_ID as BankId,
  coverSpriteId: null,
  presets: [],
});

export { defaultMeta };
