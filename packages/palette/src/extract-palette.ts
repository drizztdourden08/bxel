/* @layer core @kind logic */
import { boxAverage } from './box-average';
import { countColors } from './count-colors';
import type { ColorBox, ExtractOptions } from './extract.type';
import { formatHex } from './format-hex';
import type { RgbaImage } from './image.type';
import { makeBox } from './make-box';
import { pickBox } from './pick-box';
import { splitBox } from './split-box';

const rankBoxes = (boxes: readonly ColorBox[]): string[] => {
  const ranked = boxes
    .map((box) => ({ rgb: boxAverage(box), population: box.population }))
    .sort((a, b) => b.population - a.population || a.rgb - b.rgb);
  return [...new Set(ranked.map((entry) => entry.rgb))].map(formatHex);
};

const extractPalette = (image: RgbaImage, options: ExtractOptions): string[] => {
  const { colors } = countColors(image, options);
  if (colors.length === 0 || options.maxColors < 1) return [];
  const boxes = [makeBox(colors)];
  while (boxes.length < options.maxColors) {
    const at = pickBox(boxes);
    const box = boxes[at];
    if (!box) break;
    boxes.splice(at, 1, ...splitBox(box));
  }
  return rankBoxes(boxes);
};

export { extractPalette };
