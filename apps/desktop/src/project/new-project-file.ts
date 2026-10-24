/* @layer renderer-app @kind logic */
import type { DocumentId, SpriteId } from '@bxel/document';
import { checkFileName, joinInside } from '@bxel/project';
import { PALETTE_COMMAND_NAME } from '@bxel/palette';
import { toast } from '@drizztdourden08/brock-react';
import { DEFAULT_ARTWORK } from '../documents/default-artwork.constants';
import type { DocumentHost } from '../documents/document-host.type';
import { fileKit } from '../files/file-kit';
import { reasonOf } from '../files/reason-of';
import { spriteSteps } from '../new-sprite/sprite-steps';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { runSteps } from '../transactions/run-steps';
import { adoptPath } from '../workspace/adopt-path';
import { focusTab } from '../workspace/focus-tab';
import { saveTab } from '../workspace/save-tab';
import { tabOf } from '../workspace/tab-of';
import { listFolderEntries } from './list-folder-entries';
import { NEW_FILE_SUFFIX as SUFFIX, PROJECT_TEXT } from './project.constants';
import type { ProjectOutcome } from './project.type';

const withSuffix = (name: string): string => (name.toLowerCase().endsWith(SUFFIX) ? name : `${name}${SUFFIX}`);

const bankOf = (host: DocumentHost, documentId: DocumentId): string | null => {
  const existing = host.view(documentId)?.state.artwork.banks[0]?.id;
  if (existing !== undefined) return existing;
  const { bank } = DEFAULT_ARTWORK;
  const options = { name: bank.name, cap: bank.cap, transparent: bank.transparent, colors: bank.colors.map((color) => color.rgb) };
  const made = runSteps(host, documentId, PROJECT_TEXT.newSprite, [{ name: PALETTE_COMMAND_NAME.paletteCreate, targets: null, options }]);
  return made.ok ? (host.view(documentId)?.state.artwork.banks[0]?.id ?? null) : null;
};

const projectWorkspace = (): DocumentId | null =>
  Object.values(useWorkspaceStore.getState().workspaces).find((workspace) => workspace.kind === 'project')?.documentId ?? null;

const addSprite = (host: DocumentHost, documentId: DocumentId, stem: string): SpriteId | null => {
  const bankId = bankOf(host, documentId);
  if (bankId === null) return null;
  const { width, height } = DEFAULT_ARTWORK.sprite;
  const steps = spriteSteps({ names: [stem], size: { width, height }, bankId, fillSlot: null, existingId: null });
  const done = runSteps(host, documentId, PROJECT_TEXT.newSprite, steps);
  return done.ok ? ((Object.values(done.created)[0] as SpriteId | undefined) ?? null) : null;
};

const newProjectFile = async (folder: string, typed: string): Promise<ProjectOutcome> => {
  const kit = fileKit();
  const documentId = projectWorkspace();
  if (!kit || documentId === null) return { ok: false, message: PROJECT_TEXT.unavailable };
  const name = withSuffix(typed.trim());
  const checked = checkFileName(name, 'bxsprite');
  const path = checked.ok ? joinInside(folder, name, 'bxsprite') : checked;
  if (!path.ok) return { ok: false, message: path.message };
  try {
    const present = await listFolderEntries(kit.documents, folder, { kinds: ['sprite'], offset: 0, limit: 500 });
    if (present.entries.some((entry) => entry.name.toLowerCase() === name.toLowerCase())) return { ok: false, message: PROJECT_TEXT.fileExists(name) };
    const spriteId = addSprite(kit.host, documentId, name.slice(0, -SUFFIX.length));
    if (spriteId === null) return { ok: false, message: PROJECT_TEXT.unavailable };
    const tab = tabOf(documentId, { kind: 'sprite', id: spriteId });
    adoptPath(kit.host, documentId, tab.key, path.value);
    const saved = await saveTab(kit, tab, true);
    if (saved.kind === 'failed') return { ok: false, message: saved.message };
    focusTab(tab);
    toast(PROJECT_TEXT.fileCreated(name), { variant: 'success' });
    return { ok: true };
  } catch (error) {
    return { ok: false, message: reasonOf(error) };
  }
};

export { newProjectFile };
