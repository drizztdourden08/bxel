/* @layer renderer-app @kind logic */
import { entryKindOf } from '@bxel/project';
import { openAssetContainer } from '@bxel/document/native';
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import type { ListedFile } from '../asset-list/asset-list.type';
import { toDataUrl } from '../export/to-data-url';
import { MAX_DISK_PREVIEWS, PNG_MIME, PREVIEW_ENTRY_KIND } from './project-manager.constants';

const previewOf = async (documents: DocumentsPort, file: ListedFile): Promise<string | null> => {
  const bytes = await documents.read(file.path).catch(() => null);
  const opened = bytes === null ? null : openAssetContainer(bytes, PREVIEW_ENTRY_KIND);
  if (!opened?.ok || opened.value.manifest.preview === null) return null;
  const image = opened.value.archive.files.get(opened.value.manifest.preview);
  return image === undefined ? null : toDataUrl(image, PNG_MIME);
};

const readFilePreviews = async (documents: DocumentsPort, files: readonly ListedFile[]): Promise<ReadonlyMap<string, string>> => {
  const sprites = files.filter((file) => entryKindOf(file.name) === PREVIEW_ENTRY_KIND).slice(0, MAX_DISK_PREVIEWS);
  const found = new Map<string, string>();
  for (const file of sprites) {
    const url = await previewOf(documents, file);
    if (url !== null) found.set(file.path, url);
  }
  return found;
};

export { readFilePreviews };
