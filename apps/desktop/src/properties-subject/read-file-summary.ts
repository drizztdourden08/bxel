/* @layer renderer-app @kind logic */
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import { statFile } from '../asset-overview/stat-file';
import { fileName } from '../files/file-name';
import { IMAGE_EXTENSIONS } from '../image-import/image-import.constants';
import { readImage } from '../image-import/read-image';
import type { FileSummaryData } from './properties-subject.type';

const isImagePath = (path: string): boolean => IMAGE_EXTENSIONS.some((extension) => path.toLowerCase().endsWith(extension));

const readFileSummary = async (documents: DocumentsPort, path: string): Promise<FileSummaryData | null> => {
  const stat = await statFile(documents, path);
  if (stat === null) return null;
  const base = { name: fileName(path), size: stat.size, modified: stat.modified, isImage: false, width: null, height: null, frames: null };
  if (!isImagePath(path)) return base;
  const read = readImage(await documents.read(path).catch(() => new Uint8Array()), base.name);
  if (!read.ok) return base;
  return { ...base, isImage: true, width: read.image.width, height: read.image.height, frames: read.image.frames?.length ?? null };
};

export { readFileSummary };
