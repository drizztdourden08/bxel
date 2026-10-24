/* @layer renderer-app @kind logic */
import { BXEL_FILTERS, CANCELLED, FILE_TEXT } from './files.constants';
import type { FileKit, FileOutcome } from './files.type';
import { openArtwork } from './open-artwork';

const openFromDialog = async (kit: FileKit): Promise<FileOutcome> => {
  const path = await kit.documents.open({ title: FILE_TEXT.openTitle, filters: BXEL_FILTERS });
  return path === null ? CANCELLED : openArtwork(kit, path);
};

export { openFromDialog };
