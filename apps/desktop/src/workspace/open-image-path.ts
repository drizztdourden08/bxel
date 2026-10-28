/* @layer renderer-app @kind logic */
import { failed } from '../files/failed';
import { fileName } from '../files/file-name';
import type { FileKit, FileOutcome } from '../files/files.type';
import { readImage } from '../image-import/read-image';
import { useFileTypePanelStore } from '../stores/useFileTypePanelStore';
import { useImageTabStore } from '../stores/useImageTabStore';
import { imageTabId } from './image-tab-id';

const openImagePath = async (kit: FileKit, path: string): Promise<FileOutcome> => {
  const id = imageTabId(path);
  useFileTypePanelStore.getState().hide();
  const images = useImageTabStore.getState();
  if (images.tabs.some((tab) => tab.id === id)) {
    images.activate(id);
    return { kind: 'done', path, notice: null };
  }
  const name = fileName(path);
  const read = readImage(await kit.documents.read(path), name);
  if (!read.ok) return failed(read.message);
  images.open({ id, path, name, image: read.image, frames: read.image.frames?.length ?? 1 });
  return { kind: 'done', path, notice: null };
};

export { openImagePath };
