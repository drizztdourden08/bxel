/* @layer renderer-app @kind types */
type PixelCanvas = { width: number; height: number };

type PixelImage = Pick<ImageData, 'data' | 'width' | 'height'>;

type PixelContext = {
  putImageData(image: PixelImage, dx: number, dy: number, sx?: number, sy?: number, sw?: number, sh?: number): void;
};

export type { PixelCanvas, PixelContext, PixelImage };
