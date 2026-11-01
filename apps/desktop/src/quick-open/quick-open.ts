/* @layer renderer-app @kind logic */
import { getPlatform, palette, toast } from '@drizztdourden08/brock-react';
import { listProjectFiles } from '../asset-list/list-project-files';
import { openDropped } from '../asset-drag/open-dropped';
import { entryKindOf } from '@bxel/project';
import { fileName } from '../files/file-name';
import { useProjectStore } from '../stores/useProjectStore';
import { QUICK_OPEN_TEXT } from './quick-open.constants';
import { quickOpenOptions } from './quick-open-options';

const quickOpen = async (): Promise<void> => {
  const { project } = useProjectStore.getState();
  const { documents } = getPlatform();
  if (project === null || !documents) {
    toast(QUICK_OPEN_TEXT.unavailable, { variant: 'warning' });
    return;
  }
  const options = quickOpenOptions(await listProjectFiles(documents, project), project.folders.map((folder) => folder.path));
  if (options.length === 0) {
    toast(QUICK_OPEN_TEXT.empty, { variant: 'warning' });
    return;
  }
  palette.pick({
    title: QUICK_OPEN_TEXT.title,
    options,
    onPick: (value) => {
      const path = String(value);
      openDropped([{ id: path, kind: entryKindOf(fileName(path)), assetId: null, path }]);
    },
  });
};

export { quickOpen };
