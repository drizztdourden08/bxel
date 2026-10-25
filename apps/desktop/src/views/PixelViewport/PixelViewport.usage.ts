/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Shows a pixel image on a canvas that the user zooms and pans, with crisp pixels at any zoom and screen density, a checkerboard behind transparent pixels and a pixel grid when zoomed in.',
  useWhen: [
    'A pixel art editor shows the sprite being drawn, and the app paints pixels while the viewport owns the zoom and the pan.',
    'A sprite, a tile set or a texture is inspected pixel by pixel, inside the page, not in a dialog.',
  ],
  avoidWhen: [
    { case: 'A picture opens large over the page, with zoom and arrows through a set.', use: 'MediaViewer' },
    { case: 'The picture stays in the page at a fixed size.', use: 'Image' },
    { case: 'A plain drawing surface with no zoom or pan, such as a chart.', use: 'Canvas' },
  ],
  rules: [
    'Pass width and height in image pixels, and either draw or source. The viewport owns the view only; the app owns the pixels.',
    'draw(ctx, view) is called on each frame that needs paint, with the transform set, so one unit is one image pixel. Keep draw stable with useCallback, or call redraw on the ref when the pixels change.',
    'source takes an ImageData, an ImageBitmap, an image or a canvas and is painted at the origin; a new source repaints on its own, and redraw repaints after the same ImageData changed in place.',
    'The wheel zooms around the pointer by default; wheel="pan" makes it scroll instead, with Ctrl or a pinch to zoom. Shift turns a scroll sideways.',
    'Zoom steps are whole factors from 1 to 64 by default, set by zoomSteps; below 1 it halves down to the fit, and the fit is a whole factor when the image fits once or more.',
    'Leave zoom and pan out to fit the image on mount, or pass them with onZoomChange and onPanChange to drive them. pan is the image point at the centre of the view.',
    'hint is a sentence of keys for a screen reader, linked to the viewport as its description. The app passes the keys its canvas answers.',
    'The ref also has reveal, which pans the least that brings a pixel into view, for a keyboard cursor that walks off the edge.',
    'onPointerPixel reports the image pixel under the pointer, or null outside the image, for a StatusBar readout.',
    'The ref gives screenToPixel and pixelToScreen in client coordinates, fit, setZoom with an optional anchor, zoomIn, zoomOut, redraw and view.',
    'Pointer handlers passed in get every press the viewport does not take for a pan, so the app paints with the main button.',
    'Pass hand to let the main button drag the view, for a hand tool; the middle button and Space with the main button always pan.',
    'Pass tiled with x, y or both to repeat the image across the view for a tile preview; the app overlay stays on the first copy, and screenToPixel maps the pointer in every copy so a stroke can cross the edge.',
    'look carries the checkerboard colours and size, the surround pattern and the grid lines, and the viewport paints them on its canvas with no CSS token; without it the defaults apply.',
    'grid, gridMajor and gridTile switch the pixel grid, the major grid and the tile grid; the lines draw only where they are far enough apart to read.',
    'The viewport takes no zoom keys of its own. The app binds zoom in, zoom out, fit and actual size to its keymap and calls the ref.',
  ],
  a11y: [
    'The viewport is one Tab stop, an application region named by label.',
    'The arrow keys pan by a step and Shift with an arrow pans four steps; the zoom keys belong to the app keymap.',
    'Hold Space and drag with the main button, or drag with the middle button, to pan.',
    'The zoom level is announced in a polite live region once the zoom settles, only while focus is inside.',
    'Zoom changes at once, with no animation, so reduced motion needs nothing more.',
  ],
  tree: {
    path: ['data', 'a drawing', 'in pixels'],
    rule: 'PixelViewport shows a pixel image the user zooms and pans; the app paints the pixels and the viewport owns the view.',
  },
  example: `import { useCallback, useRef, useState } from 'react';
import { Button, Text } from '@drizztdourden08/tessera';
import { PixelViewport } from '../PixelViewport';
import type { PixelPoint, PixelViewportHandle } from '../PixelViewport';

const SpriteCanvas = ({ layers }: { layers: readonly ImageBitmap[] }) => {
  const viewport = useRef<PixelViewportHandle>(null);
  const [at, setAt] = useState<PixelPoint | null>(null);
  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    layers.forEach((layer) => ctx.drawImage(layer, 0, 0));
  }, [layers]);
  return (
    <>
      <PixelViewport ref={viewport} label="Sprite" width={32} height={32} draw={draw} onPointerPixel={setAt} />
      <Text>{at ? at.x + ', ' + at.y : 'Outside the sprite'}</Text>
      <Button onClick={() => viewport.current?.fit()}>Fit</Button>
    </>
  );
};
`,
  propsHash: 'ebf2b77f9934a484',
} satisfies ComponentUsage;

export { usage };
