/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { okOf, pixelEngine, request, stepOf } from './advanced-kit';
import { at, rowsOf, scope } from './draw-kit';
import { rampArtwork } from './ramp-artwork';

describe('K1 pixels.gradient redesign options', { tags: ['critical'] }, () => {
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

  test('other dither patterns are accepted', () => {
    const engine = pixelEngine(rampArtwork(['........']));
    okOf(engine.execute(request([stepOf('pixels.gradient', scope, { ...ramp, mode: 'dither', pattern: 'checker', line: { from: at(0, 0), to: at(7, 0) } })])));
    expect(rowsOf(engine)[0]).toMatch(/^1+[12]+2+$/);
  });
});
