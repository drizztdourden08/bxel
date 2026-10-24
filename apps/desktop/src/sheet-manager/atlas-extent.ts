/* @layer renderer-app @kind logic */
import type { Size } from '@bxel/document';
import type { AtlasItem } from './manager.type';

const atlasExtent = (item: AtlasItem): Size => (item.rotated ? { width: item.height, height: item.width } : { width: item.width, height: item.height });

export { atlasExtent };
