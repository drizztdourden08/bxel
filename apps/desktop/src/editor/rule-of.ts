/* @layer renderer-app @kind logic */
import { decodeBrushPixels } from '@bxel/document';
import { inkRule, inkTable } from '@bxel/raster';
import type { BufferView, Ink, InkRule } from '@bxel/raster';
import type { EditorTarget } from './editor.type';
import { savedBrush } from './saved-brush';

const maskOf = (ink: Ink | undefined): BufferView | null => {
  const brush = ink?.kind === 'dither' ? savedBrush(ink.brushId ?? null) : null;
  return brush ? { width: brush.width, height: brush.height, pixels: decodeBrushPixels(brush.pixels) } : null;
};

const ruleOf = (target: EditorTarget, ink: Ink | undefined): InkRule | null => inkRule(ink, inkTable(target.bank, ink), maskOf(ink));

export { ruleOf };
