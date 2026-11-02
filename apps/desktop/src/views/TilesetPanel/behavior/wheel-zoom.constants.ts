/* @layer renderer-app @kind constants */
import type { ThumbZoom } from '../../../stores/tileset-view-store.type';

const STEPS: readonly Exclude<ThumbZoom, 'fit'>[] = [1, 2, 3, 4];

export { STEPS };
