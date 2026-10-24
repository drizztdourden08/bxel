/* @layer tests @kind test */
import { checkPatchPixels, checkRequestSize, MCP_LIMITS, REQUEST_BUDGET_BYTES } from '@bxel/mcp';
import { describe, expect, it } from 'vitest';

const patch = (width: number, height: number) => ({
  name: 'pixels.patch',
  options: { rect: { x: 0, y: 0, width, height }, pixels: '' },
});

describe('request size budget', () => {
  it('is 960 KiB', () => {
    expect(REQUEST_BUDGET_BYTES).toBe(960 * 1024);
  });

  it('accepts a request at the budget and refuses one byte over', () => {
    const overhead = JSON.stringify({ text: '' }).length;
    const exact = { text: 'a'.repeat(REQUEST_BUDGET_BYTES - overhead) };
    expect(checkRequestSize(exact)).toBeNull();
    const over = checkRequestSize({ text: 'a'.repeat(REQUEST_BUDGET_BYTES - overhead + 1) });
    expect(over?.error.code).toBe('BATCH_TOO_LARGE');
    expect(over?.error.retry).toBe('fix_input');
  });

  it('counts UTF-8 bytes, not characters', () => {
    const overhead = JSON.stringify({ text: '' }).length;
    const wide = { text: 'é'.repeat(Math.ceil((REQUEST_BUDGET_BYTES - overhead) / 2) + 1) };
    expect(checkRequestSize(wide)?.error.code).toBe('BATCH_TOO_LARGE');
  });
});

describe('summed patch pixels', () => {
  it('allows four full patches and refuses the fifth', () => {
    const full = patch(256, 256);
    expect(checkPatchPixels([full, full, full, full])).toBeNull();
    const failure = checkPatchPixels([full, full, full, full, full]);
    expect(failure?.error.code).toBe('BATCH_TOO_LARGE');
    expect(failure?.error.step).toBe(4);
    expect(failure?.error.message).toContain('Split the batch');
  });

  it('refuses one patch over the engine limit and points at its rect', () => {
    const failure = checkPatchPixels([patch(300, 300)]);
    expect(failure?.error.step).toBe(0);
    expect(failure?.error.path).toBe('steps.0.options.rect');
  });

  it('ignores steps that are not patches', () => {
    expect(checkPatchPixels([{ name: 'layer.add', options: {} }, patch(1, 1), 7, null])).toBeNull();
  });

  it('publishes the limits table of the contract', () => {
    expect(MCP_LIMITS).toEqual({
      steps: 256,
      points: 8192,
      patchPixels: 65536,
      batchPatchPixels: 262144,
      readPixels: 65536,
      previewPixels: 65536,
      renderSide: 2048,
      targetSprites: 64,
      listEntries: 500,
    });
  });
});
