/* @layer renderer-app @kind logic */
import { decodeProject } from '@bxel/project';
import { getPlatform, toast } from '@drizztdourden08/brock-react';
import { fileName } from '../files/file-name';
import { FILE_TEXT } from '../files/files.constants';
import { PACK_TEXT } from '../project/pack.constants';
import { unpackPackedProject } from '../project/unpack-packed-project';

const unpackProjectFile = async (path: string): Promise<void> => {
  const { documents } = getPlatform();
  if (!documents) {
    toast(FILE_TEXT.unavailable, { variant: 'info' });
    return;
  }
  const bytes = await documents.read(path).catch(() => null);
  const decoded = bytes === null ? null : decodeProject(bytes);
  if (!decoded?.ok) {
    toast(FILE_TEXT.openFailed(fileName(path), decoded?.message ?? FILE_TEXT.unreadable), { variant: 'warning' });
    return;
  }
  const outcome = await unpackPackedProject(documents, path, decoded.value);
  if (outcome === null) return;
  if (outcome.ok) toast(PACK_TEXT.unpacked(decoded.value.manifest.name), { variant: 'success' });
  else toast(outcome.message, { variant: 'danger' });
};

export { unpackProjectFile };
