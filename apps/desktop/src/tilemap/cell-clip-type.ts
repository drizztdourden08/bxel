/* @layer renderer-app @kind logic */
import { privateClipboardType } from '@drizztdourden08/brock-core/platform';
import { product } from '../product';
import { CELL_CLIP_TYPE_NAME } from './cell-clip.constants';

const cellClipType = (): string => privateClipboardType(product.id, CELL_CLIP_TYPE_NAME);

export { cellClipType };
