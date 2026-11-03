/* @layer renderer-app @kind types */
import type { PixelIconName } from '../icons/pixel-icon.type';

type SelectEntry = 'separator' | { readonly id: string; readonly label: string; readonly icon?: PixelIconName };

export type { SelectEntry };
