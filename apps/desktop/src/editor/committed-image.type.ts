/* @layer renderer-app @kind types */
import type { EditorTarget } from './editor.type';

interface ShownImage {
  target: EditorTarget | null;
  image: ImageData | null;
  repaint: boolean;
  entries: unknown;
  highlight: string | null;
}

interface Adopted {
  image: ImageData;
  changed: boolean;
}

export type { Adopted, ShownImage };
