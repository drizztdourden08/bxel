/* @layer core @kind test */
import type { CelId } from '@bxel/document';
import { decodeArtwork, LOAD_ERROR } from '@bxel/document/native';
import { strToU8 } from 'fflate';
import { describe, expect, it } from 'vitest';
import { editCel, editDocument, editFiles } from './container-edit';
import { firstCode } from './first-code';
import { brand } from './fixture-to-artwork';
import { encodeHeart, artworkOf } from './native-fixture';

describe('native open damage: cels', () => {
  it('opens read-only with a damage report when a cel byte is flipped', () => {
    const bytes = editCel(
      encodeHeart(),
      'cel_000014',
      (pixels) => {
        pixels[3] = (pixels[3] ?? 0) ^ 1;
      },
      false,
    );
    const report = decodeArtwork(bytes);
    expect(report.outcome).toBe('recoverable');
    expect(report.readOnly).toBe(true);
    expect(report.notice).not.toBeNull();
    const [damage] = report.damage;
    expect(report.damage).toHaveLength(1);
    expect(damage).toMatchObject({
      celId: 'cel_000014',
      spriteId: 'spr_000010',
      layerId: 'lay_000011',
      frameId: 'frm_000012',
      code: LOAD_ERROR.ENTRY_CHECKSUM,
    });
    expect(damage?.message).toContain('cels/cel_000014.idx');
    const sprite = artworkOf(report).sprites[0];
    const emptied = sprite?.cels[brand<CelId>('cel_000014')];
    expect(Array.from(emptied?.pixels ?? [1])).toEqual(Array.from({ length: 64 }, () => 0));
    const untouched = sprite?.cels[brand<CelId>('cel_000015')];
    expect(untouched?.pixels.some((value) => value !== 0)).toBe(true);
  });

  it('opens read-only when a cel is missing from the archive', () => {
    const bytes = editFiles(encodeHeart(), (files) => {
      delete files['cels/cel_000024.idx'];
    });
    const report = decodeArtwork(bytes);
    expect(report.outcome).toBe('recoverable');
    expect(report.damage.map((item) => [item.celId, item.code, item.layerId])).toEqual([
      ['cel_000024', LOAD_ERROR.ENTRY_MISSING, 'lay_000021'],
    ]);
  });

});

describe('native open damage: bad cel data', () => {
  it('empties a cel whose index is past the bank and keeps its checksum clean', () => {
    const bytes = editCel(
      encodeHeart(),
      'cel_000015',
      (pixels) => {
        pixels[0] = 7;
      },
      true,
    );
    const report = decodeArtwork(bytes);
    expect(report.outcome).toBe('recoverable');
    expect(report.damage).toHaveLength(1);
    expect(report.damage[0]?.code).toBe(LOAD_ERROR.INDEX_OUT_OF_RANGE);
    expect(report.damage[0]?.celId).toBe('cel_000015');
    expect(report.readOnly).toBe(true);
  });

  it('empties a cel of the wrong size', () => {
    const shorter = editFiles(encodeHeart(), (files) => {
      files['cels/cel_000015.idx'] = new Uint8Array(10);
    });
    const report = decodeArtwork(editDocument(shorter, () => undefined));
    expect(report.outcome).toBe('recoverable');
    expect(report.damage[0]?.code).toBe(LOAD_ERROR.INDEX_OUT_OF_RANGE);
  });
});

describe('native open damage: preview', () => {
  it('treats a damaged preview as recoverable and a missing preview as fine', () => {
    const damaged = editFiles(encodeHeart(), (files) => {
      files['preview.png'] = strToU8('not the thumbnail');
    });
    const report = decodeArtwork(damaged);
    expect(report.outcome).toBe('recoverable');
    expect(report.preview).toBeNull();
    expect(report.damage).toEqual([]);
    expect(firstCode(report)).toBe(LOAD_ERROR.ENTRY_CHECKSUM);
    const missing = editFiles(encodeHeart(), (files) => {
      delete files['preview.png'];
    });
    const clean = decodeArtwork(missing);
    expect(clean.outcome).toBe('ok');
    expect(clean.preview).toBeNull();
  });
});
