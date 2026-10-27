/* @layer helper @kind test */
import { describe, expect, it } from 'vitest';
import { previewRequest } from '../../src/helper/preview-request';

describe('previewRequest', () => {
  it('reads a sheet preview resource', () => {
    expect(previewRequest('bxel://doc_4k9m2q7x1v8c/sheet/sht_4k9m2q7x1v8c/preview.png?scale=3&rev=7')).toEqual({
      documentId: 'doc_4k9m2q7x1v8c',
      target: { sheetId: 'sht_4k9m2q7x1v8c' },
      scale: 3,
    });
  });

  it('keeps reading sprite and animation resources', () => {
    expect(previewRequest('bxel://doc_4k9m2q7x1v8c/sprite/spr_4k9m2q7x1v8c/frame/frm_4k9m2q7x1v8c/preview.png?scale=2')).toMatchObject({ target: { spriteId: 'spr_4k9m2q7x1v8c' }, scale: 2 });
    expect(previewRequest('bxel://doc_4k9m2q7x1v8c/animation/anm_4k9m2q7x1v8c/strip/preview.png')).toMatchObject({ target: { animationId: 'anm_4k9m2q7x1v8c' }, scale: 4 });
  });

  it('does not read anything else', () => {
    expect(previewRequest('bxel://doc_4k9m2q7x1v8c/tilemap/tlm_4k9m2q7x1v8c/preview.png')).toBeNull();
  });
});
