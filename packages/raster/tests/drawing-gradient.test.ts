/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { okOf, pixelEngine, request, stepOf } from './advanced-kit';
import { at, rowsOf, scope } from './draw-kit';
import { rampArtwork } from './ramp-artwork';

describe('pixels.gradient redesign options', () => {
  const ramp = { ramp: 'Violet', last: 1 };

  test('a radial gradient grows from the start point', () => {
    const engine = pixelEngine(rampArtwork(['.......']));
    okOf(engine.execute(request([stepOf('pixels.gradient', scope, { ...ramp, kind: 'radial', line: { from: at(0, 0), to: at(6, 0) } })])));
    expect(rowsOf(engine)).toEqual(['1112222']);
  });

  test('reflect runs the ramp back after the end', () => {
    const engine = pixelEngine(rampArtwork(['........']));
    okOf(engine.execute(request([stepOf('pixels.gradient', scope, { ...ramp, reflect: true, line: { from: at(0, 0), to: at(3, 0) } })])));
    expect(rowsOf(engine)).toEqual(['11222111']);
  });

  test('a dither with wrap on keeps its phase across a tile seam', () => {
    const wrapped = pixelEngine(rampArtwork(['............']));
    okOf(wrapped.execute(request([stepOf('pixels.gradient', scope, { ...ramp, mode: 'dither', dither: 8, wrap: { x: true }, line: { from: at(0, 0), to: at(11, 0) } })])));
    const tiled = `${rowsOf(wrapped)[0]}${rowsOf(wrapped)[0]}`;
    expect(tiled.slice(10, 14).length).toBe(4);
    const side = 4;
    for (let x = 0; x < 12; x++) {
      expect(((x % side) + side) % side).toBe(((x + 12) % side));
    }
  });

  test('other dither patterns are accepted', () => {
    const engine = pixelEngine(rampArtwork(['........']));
    okOf(engine.execute(request([stepOf('pixels.gradient', scope, { ...ramp, mode: 'dither', pattern: 'checker', line: { from: at(0, 0), to: at(7, 0) } })])));
    expect(rowsOf(engine)[0]).toMatch(/^1+[12]+2+$/);
  });
});
