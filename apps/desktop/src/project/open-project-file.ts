/* @layer renderer-app @kind logic */
import { decodeProject } from '@bxel/project';
import { failed } from '../files/failed';
import { fileName } from '../files/file-name';
import { FILE_TEXT } from '../files/files.constants';
import type { FileKit, FileOutcome } from '../files/files.type';
import { parentOf } from '../workspace/parent-of';
import { openProject } from './open-project';
import { unpackPackedProject } from './unpack-packed-project';

const openProjectFile = async (kit: FileKit, path: string): Promise<FileOutcome> => {
  const bytes = await kit.documents.read(path).catch(() => null);
  const decoded = bytes === null ? null : decodeProject(bytes);
  if (!decoded?.ok) return failed(FILE_TEXT.openFailed(fileName(path), decoded?.message ?? FILE_TEXT.unreadable));
  if (decoded.value.assets.size === 0) {
    await openProject(parentOf(path), true);
    return { kind: 'done', path, notice: null };
  }
  const unpacked = await unpackPackedProject(kit.documents, path, decoded.value);
  if (unpacked === null) return { kind: 'cancelled' };
  if (!unpacked.ok) return failed(unpacked.message);
  await openProject(unpacked.root, true);
  return { kind: 'done', path, notice: null };
};

export { openProjectFile };
