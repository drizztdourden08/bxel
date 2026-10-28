/* @layer renderer-app @kind types */
import type { SourceImage } from '../image-import/image-import.type';

interface ImageTab {
  readonly id: string;
  readonly path: string;
  readonly name: string;
  readonly image: SourceImage;
  readonly frames: number;
}

interface ImageTabSlice {
  tabs: readonly ImageTab[];
  activeId: string | null;
}

interface ImageTabState extends ImageTabSlice {
  open: (tab: ImageTab) => void;
  activate: (id: string | null) => void;
  close: (id: string) => void;
}

export type { ImageTab, ImageTabState };
