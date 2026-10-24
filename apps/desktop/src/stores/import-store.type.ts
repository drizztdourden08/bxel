/* @layer renderer-app @kind types */
import type { SourceImage } from '../image-import/image-import.type';

interface ImportState {
  image: SourceImage | null;
  show: (image: SourceImage) => void;
  hide: () => void;
}

export type { ImportState };
