/* @layer renderer-app @kind logic */
import { decodeSource } from '../image-import/decode-source';
import { useNoticeStore } from '../stores/useNoticeStore';
import { useReferenceStore } from '../stores/useReferenceStore';
import { addReferenceFromPath } from './add-reference-from-path';
import { addReferenceImage } from './add-reference-image';
import { REFERENCE_TEXT } from './reference-image.constants';

const addReferenceFromFile = async (file: File, path: string | null): Promise<void> => {
  if (path !== null) {
    addReferenceFromPath(path);
    return;
  }
  const picture = decodeSource(new Uint8Array(await file.arrayBuffer()));
  if (picture === null) {
    useNoticeStore.getState().post(REFERENCE_TEXT.unreadable);
    return;
  }
  const key = `dropped:${crypto.randomUUID()}`;
  useReferenceStore.getState().settle(key, { state: 'ready', picture });
  addReferenceImage({ key, name: file.name });
};

export { addReferenceFromFile };
