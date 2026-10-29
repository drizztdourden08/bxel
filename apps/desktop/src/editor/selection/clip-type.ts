/* @layer renderer-app @kind logic */
import { privateClipboardType } from '@drizztdourden08/brock-core/platform';
import { product } from '../../product';
import { CLIP_TYPE_NAME } from './clip-codec.constants';

const clipType = (): string => privateClipboardType(product.id, CLIP_TYPE_NAME);

export { clipType };
