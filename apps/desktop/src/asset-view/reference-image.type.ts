/* @layer renderer-app @kind types */
interface ReferenceImage {
  id: string;
  key: string;
  name: string;
  x: number;
  y: number;
  scale: number;
  opacity: number;
  locked: boolean;
  above: boolean;
}

type ReferenceChange = Partial<Pick<ReferenceImage, 'x' | 'y' | 'scale' | 'opacity' | 'locked' | 'above'>>;

export type { ReferenceChange, ReferenceImage };
