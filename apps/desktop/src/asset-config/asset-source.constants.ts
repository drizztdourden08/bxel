/* @layer renderer-app @kind constants */
import { toast } from '@drizztdourden08/brock-react';
import { createConfigSource } from '../config-source/create-config-source';
import { ASSET_TEXT, EDIT_DELAY_MS } from './asset-config.constants';
import { ASSET_FIELDS } from './asset-fields.constants';
import { focusedAsset } from './focused-asset';
import { watchAssetStores } from './watch-asset-stores';

const ASSET_SOURCE = createConfigSource({
  fields: ASSET_FIELDS,
  context: focusedAsset,
  locked: (focus) => focus.readOnly,
  watch: watchAssetStores,
  delayMs: EDIT_DELAY_MS,
  report: (message) => toast(ASSET_TEXT.failed(message), { variant: 'danger' }),
});

export { ASSET_SOURCE };
