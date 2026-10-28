/* @layer renderer-app @kind component */
import type { ScreenMeta, SearchEntrySeed } from '@drizztdourden08/brock-react';
import { Button } from '@drizztdourden08/tessera';
import { ASSET_TEXT } from '../../asset-config/asset-config.constants';
import { runInEditor } from '../../asset-config/run-in-editor';
import { showForKind } from '../../asset-config/show-for-kind';
import { openProjectWindow } from '../../config-entry/open-project-window';
import { FILE_COMMAND } from '../../files/files.constants';
import { DIALOG_COMMAND } from '../../keymap/dialog-command-id.constants';
import { SUBJECT_TEXT } from '../../properties-subject/properties-subject.constants';
import { useSubject } from '../../properties-subject/useSubject';
import { SubjectCard } from '../../views/SubjectCard';
import { ConfigEmpty } from '../../views/ConfigEmpty';

const meta: ScreenMeta = { title: 'File', showHeader: true, icon: 'image', order: 0, when: showForKind('') };

const searchEntries: SearchEntrySeed[] = [];

const NoAssetScreen = () => {
  const state = useSubject();
  if (state.status === 'missing') return <SubjectCard />;
  return (
    <ConfigEmpty
      title={SUBJECT_TEXT.emptyTitle}
      message={SUBJECT_TEXT.emptyMessage}
      actions={
        <>
          <Button variant="primary" onClick={() => runInEditor(DIALOG_COMMAND.newFile)}>
            {ASSET_TEXT.newAsset}
          </Button>
          <Button variant="secondary" onClick={() => runInEditor(FILE_COMMAND.open)}>
            {ASSET_TEXT.openAsset}
          </Button>
          <Button variant="tertiary" onClick={openProjectWindow}>
            {SUBJECT_TEXT.toProject}
          </Button>
        </>
      }
    />
  );
};

export default NoAssetScreen;
export { meta, searchEntries };
