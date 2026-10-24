/* @layer core @kind logic */
import type { ArtworkId, BankId } from '../../model/ids.type';
import type { DocumentJson } from '../document-json.type';
import { SCOPE_ARTWORK_ID } from './asset-container.constants';
import type { ScopedParts } from './scoped-document.type';

const scopedDocument = ({ banks, sprites, presets }: ScopedParts): DocumentJson => ({
  id: SCOPE_ARTWORK_ID as ArtworkId,
  name: 'asset',
  defaultBankId: banks[0]?.id ?? ('bnk_000000' as BankId),
  coverSpriteId: null,
  banks,
  sprites,
  sheets: [],
  presets,
  tilesets: [],
  tilemaps: [],
});

export { scopedDocument };
