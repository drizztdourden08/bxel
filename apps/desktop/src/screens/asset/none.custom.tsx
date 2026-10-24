/* @layer renderer-app @kind component */
import type { ScreenMeta, SearchEntrySeed } from '@drizztdourden08/brock-react';
import { useEffect } from 'react';
import { ASSET_TEXT } from '../../asset-config/asset-config.constants';
import { showForKind } from '../../asset-config/show-for-kind';
import { useAssetFocus } from '../../asset-config/useAssetFocus';
import { openAssetSettings } from '../../config-entry/open-asset-settings';
import { ConfigEmpty } from '../../views/ConfigEmpty';

const meta: ScreenMeta = { title: 'Asset', showHeader: true, icon: 'image', order: 0, when: showForKind('') };

const searchEntries: SearchEntrySeed[] = [];

const NoAssetScreen = () => {
  const focus = useAssetFocus();
  useEffect(() => {
    if (focus) openAssetSettings();
  }, [focus]);
  return focus ? null : <ConfigEmpty title={ASSET_TEXT.noAssetTitle} message={ASSET_TEXT.noAsset} />;
};

export default NoAssetScreen;
export { meta, searchEntries };
