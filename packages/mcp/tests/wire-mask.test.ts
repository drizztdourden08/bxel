/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { encodeBase64 } from '../src/codec/encode-base64';
import { toolJsonSchema } from '../src/tools/tool-json-schema';
import { withWireMask } from '../src/schema/wire-mask';

const bytesMask = z.strictObject({ width: z.number(), height: z.number(), bits: z.instanceof(Uint8Array) });
const flip = z.strictObject({ axis: z.enum(['horizontal', 'vertical']), mask: bytesMask });
const paint = z.strictObject({ index: z.number(), mask: bytesMask.optional() });
const shape = z.discriminatedUnion('shape', [
  z.strictObject({ shape: z.literal('line'), mask: bytesMask.optional() }),
  z.strictObject({ shape: z.literal('rect'), mask: bytesMask.optional() }),
]);

const wire = (side: number) => ({ width: side, height: side, bits: encodeBase64(new Uint8Array(side * side).fill(1)) });

describe('withWireMask', () => {
  it('takes a base64 mask where the command needs one, and refuses a missing one', () => {
    const schema = withWireMask(flip);
    expect(schema.safeParse({ axis: 'horizontal', mask: wire(4) }).success).toBe(true);
    expect(schema.safeParse({ axis: 'horizontal' }).success).toBe(false);
  });

  it('keeps an optional mask optional', () => {
    const schema = withWireMask(paint);
    expect(schema.safeParse({ index: 1 }).success).toBe(true);
    expect(schema.safeParse({ index: 1, mask: wire(2) }).success).toBe(true);
  });

  it('reaches the mask inside each shape of a union', () => {
    const schema = withWireMask(shape);
    expect(schema.safeParse({ shape: 'rect', mask: wire(3) }).success).toBe(true);
    expect(schema.safeParse({ shape: 'line', mask: { width: 3, height: 3, bits: 'AAAA' } }).success).toBe(false);
  });

  it('refuses bits that are not width * height bytes, or not base64', () => {
    const schema = withWireMask(flip);
    expect(schema.safeParse({ axis: 'vertical', mask: { width: 4, height: 4, bits: encodeBase64(new Uint8Array(3)) } }).success).toBe(false);
    expect(schema.safeParse({ axis: 'vertical', mask: { width: 4, height: 4, bits: 'not base64!' } }).success).toBe(false);
  });

  it('shows the mask as a base64 string with a description', () => {
    const text = JSON.stringify(toolJsonSchema(withWireMask(flip), 'input'));
    expect(text).toContain('"contentEncoding":"base64"');
    expect(text).toContain('width * height bytes');
  });
});
