/* @layer renderer-app @kind logic */
import { createElement } from 'react';
import type { ReactElement } from 'react';
import type { PixelIconName } from '../../../icons/pixel-icon.type';
import { PixelIcon } from '../../PixelIcon';

const pixelMenuIcon = (name: PixelIconName): ReactElement => createElement(PixelIcon, { name });

export { pixelMenuIcon };
