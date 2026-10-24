/* @layer renderer-app @kind types */
import type { PixelIconName } from '../../icons/pixel-icon.type';

interface PixelIconProps {
  name: PixelIconName;
  size?: number;
  label?: string;
}

export type { PixelIconProps };
