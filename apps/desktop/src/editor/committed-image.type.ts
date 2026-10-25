/* @layer renderer-app @kind types */
import type { EditorTarget } from './editor.type';

interface ShownImage {
  target: EditorTarget | null;
  image: ImageData | null;
  repaint: boolean;
}

interface Adopted {
  image: ImageData;
  changed: boolean;
}

export type { Adopted, ShownImage };
