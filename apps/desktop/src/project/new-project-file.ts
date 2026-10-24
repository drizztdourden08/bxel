/* @layer renderer-app @kind logic */
import { checkFileName, joinInside } from '@bxel/project';
import { toast } from '@drizztdourden08/brock-react';
import { DEFAULT_ARTWORK } from '../documents/default-artwork.constants';
import { artworkBytes } from '../files/artwork-bytes';
import { BXEL_SUFFIX } from '../files/files.constants';
import { reasonOf } from '../files/reason-of';
import { fileKit } from '../files/file-kit';
import { focusDocument } from '../transactions/focus-document';
import { listFolderEntries } from './list-folder-entries';
import { PROJECT_TEXT } from './project.constants';
import type { ProjectOutcome } from './project.type';

const withSuffix = (name: string): string => (name.toLowerCase().endsWith(BXEL_SUFFIX) ? name : `${name}${BXEL_SUFFIX}`);

const newProjectFile = async (folder: string, typed: string): Promise<ProjectOutcome> => {
  const kit = fileKit();
  if (!kit) return { ok: false, message: PROJECT_TEXT.unavailable };
  const name = withSuffix(typed.trim());
  const checked = checkFileName(name, 'bxel');
  if (!checked.ok) return { ok: false, message: checked.message };
  const path = joinInside(folder, name, 'bxel');
  if (!path.ok) return { ok: false, message: path.message };
  try {
    const present = await listFolderEntries(kit.documents, folder, { kinds: ['bxel'], offset: 0, limit: 500 });
    if (present.entries.some((entry) => entry.name.toLowerCase() === name.toLowerCase())) return { ok: false, message: PROJECT_TEXT.fileExists(name) };
    const created = kit.host.create({ ...DEFAULT_ARTWORK, name: name.slice(0, -BXEL_SUFFIX.length) });
    if (!created.ok) return { ok: false, message: created.error.message };
    const view = kit.host.view(created.documentId);
    if (!view) return { ok: false, message: PROJECT_TEXT.unavailable };
    await kit.documents.write(path.value, artworkBytes(view.state, kit.clock));
    kit.paths.remember(created.documentId, path.value);
    kit.host.markSaved(created.documentId);
    focusDocument(created.documentId);
    toast(PROJECT_TEXT.fileCreated(name), { variant: 'success' });
    return { ok: true };
  } catch (error) {
    return { ok: false, message: reasonOf(error) };
  }
};

export { newProjectFile };
