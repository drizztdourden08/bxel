/* @layer renderer-app @kind logic */
import type { LayerFlag } from '../../../editor/layer-flag.type';

const sweepKey = (flag: LayerFlag, id: string): string => `${flag}:${id}`;

export { sweepKey };
