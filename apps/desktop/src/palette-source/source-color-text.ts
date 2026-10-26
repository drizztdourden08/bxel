/* @layer renderer-app @kind logic */
import { formatSwatchColor } from '@bxel/document';
import type { Rgb } from '@bxel/document';
import type { SourceColor } from './palette-source.type';

const sourceColorText = (color: SourceColor): string => formatSwatchColor(color.rgb as Rgb, color.alpha);

export { sourceColorText };
