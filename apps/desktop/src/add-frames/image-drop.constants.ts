/* @layer renderer-app @kind constants */
import { MAX_SPRITE_SIZE } from '@bxel/document';

const DROP_REFUSAL_MS = 2400;

const DROP_REF = { frame: 'dropframe', strip: 'dropstrip' } as const;

const IMAGE_ACCEPT = 'image/png,image/apng,image/gif,.png,.apng,.gif';

const DROP_TEXT = {
  size: (width: number, height: number, frameWidth: number, frameHeight: number): string =>
    `This image is ${width} by ${height} pixels. A frame must be ${frameWidth} by ${frameHeight}, or a strip of whole frames ${frameHeight} pixels high.`,
  tooLarge: (width: number, height: number): string => `This strip is ${width} by ${height} pixels. The largest image is ${MAX_SPRITE_SIZE} by ${MAX_SPRITE_SIZE}.`,
  colours: (count: number): string =>
    count === 1 ? '1 pixel uses a colour that is not in the palette of this animation.' : `${count} pixels use colours that are not in the palette of this animation.`,
  noBank: 'The palette of this animation was not found.',
  notImage: (name: string): string => `${name} is not a PNG, GIF or APNG image.`,
  unreadable: (name: string): string => `${name} cannot be read as an image.`,
  stripAlone: (name: string): string => `${name} is a strip. Drop a strip on its own, so its cut can be chosen.`,
  refused: (name: string, reason: string): string => `${name} was not added. ${reason}`,
  readOnly: 'This animation is open read only.',
  stripTitle: 'Add frames from a strip image',
  stripSource: (name: string, width: number, height: number): string => `${name} (${width} by ${height})`,
} as const;

export { DROP_REF, DROP_REFUSAL_MS, DROP_TEXT, IMAGE_ACCEPT };
