/* @layer renderer-app @kind types */
import type { AnyPixelIconName } from '../../icons/pixel-icon.type';

interface PixelIconProps {
  name: AnyPixelIconName;
  size?: number;
  label?: string;
}

export type { PixelIconProps };
