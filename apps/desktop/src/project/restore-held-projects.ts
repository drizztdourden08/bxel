/* @layer renderer-app @kind logic */
import { isSamePath } from '@bxel/project';
import { fileKit } from '../files/file-kit';
import { useProjectStore } from '../stores/useProjectStore';
import type { OpenProject } from './project.type';
import { restoreHeldProject } from './restore-held-project';
import { sameProject } from './same-project';

const restoreHeldProjects = async (): Promise<void> => {
  const { port } = useProjectStore.getState();
  const kit = fileKit();
  if (!port || !kit) return;
  const remembered = await kit.documents.rememberedFolders().catch(() => []);
  const wanted = port
    .read()
    .assistantProjects.filter(
      (grant) => grant.access !== 'off' && remembered.some((each) => each.available && isSamePath(each.path, grant.rootRealPath)),
    );
  const restored = await Promise.all(wanted.map((grant) => restoreHeldProject(kit.documents, grant)));
  const found = restored.filter((each): each is OpenProject => each !== null);
  const { project, setHeld } = useProjectStore.getState();
  setHeld(found.filter((each) => !project || !sameProject(each, project)));
};

export { restoreHeldProjects };
