/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import { encodePngRgba } from '@bxel/formats';
import { activeTarget } from '../editor/active-target';
import { failed } from './failed';
import { fileName } from './file-name';
import { CANCELLED, FILE_TEXT, PNG_FILTERS } from './files.constants';
import type { FileKit, FileOutcome } from './files.type';
import { frameImage } from './frame-image';
import { reasonOf } from './reason-of';

const exportPng = async (kit: FileKit, documentId: DocumentId): Promise<FileOutcome> => {
  const target = activeTarget(kit.host.view(documentId));
  if (!target) return failed(FILE_TEXT.nothingToExport);
  const { sprite, bank, frameId } = target;
  const encoded = encodePngRgba(frameImage(sprite, bank, frameId));
  if (!encoded.ok) return failed(FILE_TEXT.exportFailed(encoded.message));
  const path = await kit.documents.saveAs({
    title: FILE_TEXT.exportTitle,
    defaultPath: `${sprite.name}.png`,
    filters: PNG_FILTERS,
  });
  if (path === null) return CANCELLED;
  try {
    await kit.documents.write(path, encoded.bytes);
  } catch (error) {
    return failed(FILE_TEXT.exportFailed(reasonOf(error)));
  }
  return { kind: 'done', path, notice: FILE_TEXT.exported(fileName(path)) };
};

export { exportPng };
