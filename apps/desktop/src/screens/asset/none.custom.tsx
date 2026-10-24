/* @layer renderer-app @kind component */
import type { ScreenMeta } from '@drizztdourden08/brock-react';
import { ASSET_TEXT } from '../../asset-config/asset-config.constants';
import { showForKind } from '../../asset-config/show-for-kind';
import { ConfigEmpty } from '../../views/ConfigEmpty';

const meta: ScreenMeta = { title: 'Asset', showHeader: true, icon: 'image', order: 0, when: showForKind('') };

const NoAssetScreen = () => <ConfigEmpty title={ASSET_TEXT.noAssetTitle} message={ASSET_TEXT.noAsset} />;

export default NoAssetScreen;
export { meta };
