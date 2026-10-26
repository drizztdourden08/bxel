/* @layer renderer-app @kind logic */
import { entryKindOf } from '@bxel/project';
import { openAssetContainer } from '@bxel/document/native';
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import type { ListedFile } from '../asset-list/asset-list.type';
import { toDataUrl } from '../export/to-data-url';
import { MAX_DISK_PREVIEWS, PNG_MIME, PREVIEW_ENTRY_KINDS } from './project-manager.constants';

const previewKind = (file: ListedFile): (typeof PREVIEW_ENTRY_KINDS)[number] | null => {
  const kind = entryKindOf(file.name);
  return PREVIEW_ENTRY_KINDS.find((each) => each === kind) ?? null;
};

const previewOf = async (documents: DocumentsPort, file: ListedFile, kind: (typeof PREVIEW_ENTRY_KINDS)[number]): Promise<string | null> => {
  const bytes = await documents.read(file.path).catch(() => null);
  const opened = bytes === null ? null : openAssetContainer(bytes, kind);
  if (!opened?.ok || opened.value.manifest.preview === null) return null;
  const image = opened.value.archive.files.get(opened.value.manifest.preview);
  return image === undefined ? null : toDataUrl(image, PNG_MIME);
};

const readFilePreviews = async (documents: DocumentsPort, files: readonly ListedFile[]): Promise<ReadonlyMap<string, string>> => {
  const drawn = files.filter((file) => previewKind(file) !== null).slice(0, MAX_DISK_PREVIEWS);
  const found = new Map<string, string>();
  for (const file of drawn) {
    const kind = previewKind(file);
    const url = kind === null ? null : await previewOf(documents, file, kind);
    if (url !== null) found.set(file.path, url);
  }
  return found;
};

export { readFilePreviews };
