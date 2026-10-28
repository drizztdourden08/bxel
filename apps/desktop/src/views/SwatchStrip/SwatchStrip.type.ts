/* @layer renderer-app @kind types */
type SwatchStripSize = 'sm' | 'md' | 'lg';

interface SwatchStripProps {
  colours: readonly string[];
  size?: SwatchStripSize;
  label?: string;
  captions?: readonly string[];
}

export type { SwatchStripProps };
