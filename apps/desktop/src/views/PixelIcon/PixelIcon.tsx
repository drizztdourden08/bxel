/* @layer renderer-app @kind component */
import { Icon } from '@drizztdourden08/tessera';
import { PIXEL_ICON_SIZE } from '../../icons/pixel-icon.constants';
import { pixelIconData } from '../../icons/pixel-icon-data';
import type { PixelIconProps } from './PixelIcon.type';

const PixelIcon = ({ name, size = PIXEL_ICON_SIZE, label }: PixelIconProps) => (
  <Icon icon={pixelIconData(name)} size={size} label={label} />
);

export { PixelIcon };
