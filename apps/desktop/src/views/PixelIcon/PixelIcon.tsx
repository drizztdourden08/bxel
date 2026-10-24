/* @layer renderer-app @kind component */
import { Icon } from '@drizztdourden08/tessera';
import { PIXEL_ICON_SIZE, STOCK_ICON_PREFIX } from '../../icons/pixel-icon.constants';
import { pixelIconData } from '../../icons/pixel-icon-data';
import type { StockPixelIconName } from '../../icons/pixel-icon.type';
import type { PixelIconProps } from './PixelIcon.type';

const isStock = (name: PixelIconProps['name']): name is StockPixelIconName => name.startsWith(STOCK_ICON_PREFIX);

const PixelIcon = ({ name, size = PIXEL_ICON_SIZE, label }: PixelIconProps) =>
  isStock(name) ? (
    <Icon name={name} size={size} label={label} />
  ) : (
    <Icon icon={pixelIconData(name)} size={size} label={label} />
  );

export { PixelIcon };
