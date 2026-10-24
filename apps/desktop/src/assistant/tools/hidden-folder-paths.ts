/* @layer renderer-app @kind logic */
import { canSeeFolder } from '@bxel/mcp';
import { useProjectStore } from '../../stores/useProjectStore';

const hiddenFolderPaths = (): readonly string[] => {
  const { project, held } = useProjectStore.getState();
  return [...(project ? [project] : []), ...held].flatMap((each) =>
    each.folders.filter((folder) => !canSeeFolder(each.manifest.assistant.folders, folder.folderId)).map((folder) => folder.path),
  );
};

export { hiddenFolderPaths };
