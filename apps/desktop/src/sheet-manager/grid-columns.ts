/* @layer renderer-app @kind logic */
import { GRID_CHROME } from './manager.constants';

const gridColumns = (width: number, zoom: number): number => Math.max(1, Math.floor((width - GRID_CHROME.edge) / (zoom + GRID_CHROME.tile)));

export { gridColumns };
