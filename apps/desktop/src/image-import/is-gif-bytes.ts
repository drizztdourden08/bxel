/* @layer renderer-app @kind logic */
import { GIF_MAGIC } from './animated-image.constants';

const isGifBytes = (bytes: Uint8Array): boolean => GIF_MAGIC.every((byte, at) => bytes[at] === byte);

export { isGifBytes };
