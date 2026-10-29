/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import type { AssetDefaults } from '@bxel/project';
import { fileExtension } from '../../files/file-extension';
import { fileName } from '../../files/file-name';
import { readImage } from '../../image-import/read-image';
import { importPlain } from '../../image-import/import-plain';
import type { ToolContext } from '../assistant.type';
import { assetIdsIn } from './asset-ids-in';
import { importPalette } from './import-palette';
import { IMPORT_EXTENSIONS } from './import-extensions.constants';
import type { Entry } from './project-files-input.type';
import { saveNewAssets } from './save-new-assets';
import { toolKit } from './tool-kit';
import { TOOL_TEXT } from './tools.constants';

const importedBy = async (context: ToolContext, documentId: DocumentId, run: () => string | null): Promise<readonly string[] | string> => {
  const before = assetIdsIn(context, documentId);
  const problem = run();
  if (problem !== null) return problem;
  return saveNewAssets(context, documentId, before);
};

const importOne = async (context: ToolContext, documentId: DocumentId, defaults: AssetDefaults, entry: Entry): Promise<readonly string[] | string> => {
  const extension = fileExtension(entry.path).toLowerCase();
  if (entry.folder || !IMPORT_EXTENSIONS.includes(extension)) return TOOL_TEXT.notImportable;
  const bytes = await toolKit(context).documents.read(entry.path);
  if (extension === 'gpl' || extension === 'pal') {
    return importedBy(context, documentId, () => importPalette(context.host, documentId, { bytes, fileName: fileName(entry.path) }, defaults));
  }
  const read = readImage(bytes, fileName(entry.path));
  if (!read.ok) return read.message;
  return importedBy(context, documentId, () => {
    const outcome = importPlain(context.host, documentId, read.image, defaults);
    return outcome.ok ? null : outcome.message;
  });
};

export { importOne };
