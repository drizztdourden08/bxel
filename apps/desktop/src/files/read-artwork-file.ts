/* @layer renderer-app @kind logic */
import { decodeArtwork } from '@bxel/document/native';
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import { fileName } from './file-name';
import { FILE_TEXT } from './files.constants';
import type { ReadResult } from './files.type';
import { reasonOf } from './reason-of';

const readArtworkFile = async (documents: DocumentsPort, path: string): Promise<ReadResult> => {
  try {
    return { report: decodeArtwork(await documents.read(path)) };
  } catch (error) {
    return { message: FILE_TEXT.openFailed(fileName(path), reasonOf(error)) };
  }
};

export { readArtworkFile };
