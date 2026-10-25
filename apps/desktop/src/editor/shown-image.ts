/* @layer renderer-app @kind logic */
import type { ShownImage } from './committed-image.type';

const shownImage: ShownImage = { target: null, image: null, repaint: false };

export { shownImage };
