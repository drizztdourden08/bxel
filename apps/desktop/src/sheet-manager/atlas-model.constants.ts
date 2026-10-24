/* @layer renderer-app @kind constants */
import type { AtlasModel } from './manager.type';

const EMPTY_ATLAS: AtlasModel = { width: 0, height: 0, items: [], used: 0, empty: 0, failure: null, page: 0, pageCount: 1 };

export { EMPTY_ATLAS };
