/* @layer renderer-app @kind component */
import type { ScreenMeta, SearchEntrySeed } from '@drizztdourden08/brock-react';
import { Button } from '@drizztdourden08/tessera';
import { useEffect } from 'react';
import { ASSET_TEXT } from '../../asset-config/asset-config.constants';
import { runInEditor } from '../../asset-config/run-in-editor';
import { showForKind } from '../../asset-config/show-for-kind';
import { useAssetFocus } from '../../asset-config/useAssetFocus';
import { openAssetSettings } from '../../config-entry/open-asset-settings';
import { FILE_COMMAND } from '../../files/files.constants';
import { DIALOG_COMMAND } from '../../keymap/dialog-command-id.constants';
import { ConfigEmpty } from '../../views/ConfigEmpty';

const meta: ScreenMeta = { title: 'Asset', showHeader: true, icon: 'image', order: 0, when: showForKind('') };

const searchEntries: SearchEntrySeed[] = [];

const NoAssetScreen = () => {
  const focus = useAssetFocus();
  useEffect(() => {
    if (focus) openAssetSettings('overview');
  }, [focus]);
  if (focus) return null;
  return (
    <ConfigEmpty
      title={ASSET_TEXT.noAssetTitle}
      message={ASSET_TEXT.noAsset}
      actions={
        <>
          <Button variant="primary" onClick={() => runInEditor(DIALOG_COMMAND.newFile)}>
            {ASSET_TEXT.newAsset}
          </Button>
          <Button variant="secondary" onClick={() => runInEditor(FILE_COMMAND.open)}>
            {ASSET_TEXT.openAsset}
          </Button>
        </>
      }
    />
  );
};

export default NoAssetScreen;
export { meta, searchEntries };
