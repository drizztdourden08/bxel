/* @layer renderer-app @kind logic */
import { nav } from '@drizztdourden08/brock-react';
import { OPTIONS_HUB, PALETTE_LIBRARY_PAGE } from './config-entry.constants';

const openPaletteLibrary = (): void => nav.open(`${OPTIONS_HUB}/${PALETTE_LIBRARY_PAGE}`);

export { openPaletteLibrary };
