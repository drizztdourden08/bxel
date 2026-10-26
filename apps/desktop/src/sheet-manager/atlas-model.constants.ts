/* @layer renderer-app @kind constants */
import type { AtlasModel } from './manager.type';

const ATLAS_ROW_GAP = 2;

const EMPTY_ATLAS: AtlasModel = { width: 0, height: 0, items: [], animations: [], used: 0, empty: 0, failure: null, page: 0, pageCount: 1 };

export { ATLAS_ROW_GAP, EMPTY_ATLAS };
