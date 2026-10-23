/* @layer core @kind test */
import type { CelId } from '@bxel/document';
import { decodeProject, LOAD_ERROR, MIMETYPE } from '@bxel/document/native';
import type { LoadReport } from '@bxel/document/native';
import { strToU8, zipSync } from 'fflate';
import { describe, expect, it } from 'vitest';
import { editCel, editDocument, editFiles, editManifest, pack } from './container-edit';
import { brand } from './fixture-to-project';
import { encodeHeart, projectOf } from './native-fixture';

const firstCode = (report: LoadReport): string | undefined => report.issues[0]?.code;

describe('native open checks: the archive', () => {
  it('rejects bytes that are not a zip', () => {
    const report = decodeProject(Uint8Array.from([1, 2, 3, 4, 5]));
    expect(report.outcome).toBe('fatal');
    expect(firstCode(report)).toBe(LOAD_ERROR.FILE_NOT_BXEL);
    expect(report.project).toBeNull();
    expect(report.readOnly).toBe(true);
  });

  it('rejects a zip whose mimetype is something else', () => {
    const report = decodeProject(pack({ mimetype: strToU8('text/plain') }));
    expect(firstCode(report)).toBe(LOAD_ERROR.FILE_NOT_BXEL);
  });

  it('reports a truncated archive', () => {
    const bytes = encodeHeart();
    const report = decodeProject(bytes.slice(0, Math.floor(bytes.length / 2)));
    expect(report.outcome).toBe('fatal');
    expect(firstCode(report)).toBe(LOAD_ERROR.FILE_TRUNCATED);
  });

  it('refuses an entry that declares more than the entry limit before inflating it', () => {
    const bomb = zipSync({
      mimetype: [strToU8(MIMETYPE), { level: 0 }],
      'cels/cel_bomb.idx': new Uint8Array(65 * 1024 * 1024),
    });
    expect(firstCode(decodeProject(bomb))).toBe(LOAD_ERROR.FILE_TOO_LARGE);
  });

  it('rejects a missing or malformed manifest', () => {
    const missing = editFiles(encodeHeart(), (files) => {
      delete files['manifest.json'];
    });
    expect(firstCode(decodeProject(missing))).toBe(LOAD_ERROR.MANIFEST_INVALID);
    const wrongFormat = editManifest(encodeHeart(), (manifest) => {
      manifest.format = 'other';
    });
    const report = decodeProject(wrongFormat);
    expect(firstCode(report)).toBe(LOAD_ERROR.MANIFEST_INVALID);
    expect(report.issues[0]?.path).toBe('$.format');
    const broken = editFiles(encodeHeart(), (files) => {
      files['manifest.json'] = strToU8('{ not json');
    });
    expect(firstCode(decodeProject(broken))).toBe(LOAD_ERROR.MANIFEST_INVALID);
  });
});

describe('native open checks: versions', () => {
  it('opens a newer file read-only when the minimum reader version is known', () => {
    const bytes = editManifest(encodeHeart(), (manifest) => {
      manifest.formatVersion = 2;
      manifest.minReaderVersion = 1;
    });
    const report = decodeProject(bytes);
    expect(report.outcome).toBe('ok');
    expect(report.readOnly).toBe(true);
    expect(report.notice).toContain('newer');
    expect(projectOf(report).sprites).toHaveLength(2);
  });

  it('refuses a newer file whose minimum reader version is unknown', () => {
    const bytes = editManifest(encodeHeart(), (manifest) => {
      manifest.formatVersion = 3;
      manifest.minReaderVersion = 2;
    });
    const report = decodeProject(bytes);
    expect(report.outcome).toBe('fatal');
    expect(firstCode(report)).toBe(LOAD_ERROR.VERSION_TOO_NEW);
  });
});

describe('native open checks: entries and document', () => {
  it('reports a missing document.json', () => {
    const bytes = editFiles(encodeHeart(), (files) => {
      delete files['document.json'];
    });
    const report = decodeProject(bytes);
    expect(report.outcome).toBe('fatal');
    expect(firstCode(report)).toBe(LOAD_ERROR.ENTRY_MISSING);
    expect(report.issues[0]?.path).toBe('document.json');
  });

  it('reports a document.json that fails its checksum', () => {
    const bytes = editFiles(encodeHeart(), (files) => {
      files['document.json'] = strToU8('{}');
    });
    expect(firstCode(decodeProject(bytes))).toBe(LOAD_ERROR.ENTRY_CHECKSUM);
  });

  it('reports a document that breaks the schema with a JSON path', () => {
    const bytes = editDocument(encodeHeart(), (document) => {
      const sprite = document.sprites[0];
      if (sprite) sprite.width = 0;
    });
    const report = decodeProject(bytes);
    expect(report.outcome).toBe('fatal');
    expect(firstCode(report)).toBe(LOAD_ERROR.DOCUMENT_INVALID);
    expect(report.issues[0]?.path).toBe('$.sprites[0].width');
  });

  it('reports a duplicate id', () => {
    const bytes = editDocument(encodeHeart(), (document) => {
      const [first, second] = document.sprites;
      if (first && second) second.id = first.id;
    });
    const report = decodeProject(bytes);
    expect(report.outcome).toBe('fatal');
    expect(firstCode(report)).toBe(LOAD_ERROR.REFERENCE_BROKEN);
    expect(report.issues[0]?.message).toContain('spr_000010');
  });

  it('reports a sprite that points at a bank that does not exist', () => {
    const bytes = editDocument(encodeHeart(), (document) => {
      const sprite = document.sprites[1];
      if (sprite) sprite.bankId = 'bnk_999999';
    });
    const report = decodeProject(bytes);
    expect(report.outcome).toBe('fatal');
    expect(firstCode(report)).toBe(LOAD_ERROR.REFERENCE_BROKEN);
    expect(report.issues[0]?.path).toBe('$.sprites[1].bankId');
  });

  it('reports a bank that breaks the transparent slot policy', () => {
    const bytes = editDocument(encodeHeart(), (document) => {
      const bank = document.banks[0];
      if (bank) bank.transparent = false;
    });
    expect(firstCode(decodeProject(bytes))).toBe(LOAD_ERROR.DOCUMENT_INVALID);
  });
});

describe('native open checks: recoverable damage', () => {
  it('opens read-only with a damage report when a cel byte is flipped', () => {
    const bytes = editCel(
      encodeHeart(),
      'cel_000014',
      (pixels) => {
        pixels[3] = (pixels[3] ?? 0) ^ 1;
      },
      false,
    );
    const report = decodeProject(bytes);
    expect(report.outcome).toBe('recoverable');
    expect(report.readOnly).toBe(true);
    expect(report.notice).not.toBeNull();
    expect(report.damage).toEqual([
      {
        celId: 'cel_000014',
        spriteId: 'spr_000010',
        layerId: 'lay_000011',
        frameId: 'frm_000012',
        code: LOAD_ERROR.ENTRY_CHECKSUM,
        message: expect.stringContaining('cels/cel_000014.idx'),
      },
    ]);
    const sprite = projectOf(report).sprites[0];
    const emptied = sprite?.cels[brand<CelId>('cel_000014')];
    expect(Array.from(emptied?.pixels ?? [1])).toEqual(Array.from({ length: 64 }, () => 0));
    const untouched = sprite?.cels[brand<CelId>('cel_000015')];
    expect(untouched?.pixels.some((value) => value !== 0)).toBe(true);
  });

  it('opens read-only when a cel is missing from the archive', () => {
    const bytes = editFiles(encodeHeart(), (files) => {
      delete files['cels/cel_000024.idx'];
    });
    const report = decodeProject(bytes);
    expect(report.outcome).toBe('recoverable');
    expect(report.damage.map((item) => [item.celId, item.code, item.layerId])).toEqual([
      ['cel_000024', LOAD_ERROR.ENTRY_MISSING, 'lay_000021'],
    ]);
  });

  it('empties a cel whose index is past the bank and keeps its checksum clean', () => {
    const bytes = editCel(
      encodeHeart(),
      'cel_000015',
      (pixels) => {
        pixels[0] = 7;
      },
      true,
    );
    const report = decodeProject(bytes);
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
    const report = decodeProject(editDocument(shorter, () => undefined));
    expect(report.outcome).toBe('recoverable');
    expect(report.damage[0]?.code).toBe(LOAD_ERROR.INDEX_OUT_OF_RANGE);
  });

  it('treats a damaged preview as recoverable and a missing preview as fine', () => {
    const damaged = editFiles(encodeHeart(), (files) => {
      files['preview.png'] = strToU8('not the thumbnail');
    });
    const report = decodeProject(damaged);
    expect(report.outcome).toBe('recoverable');
    expect(report.preview).toBeNull();
    expect(report.damage).toEqual([]);
    expect(firstCode(report)).toBe(LOAD_ERROR.ENTRY_CHECKSUM);
    const missing = editFiles(encodeHeart(), (files) => {
      delete files['preview.png'];
    });
    const clean = decodeProject(missing);
    expect(clean.outcome).toBe('ok');
    expect(clean.preview).toBeNull();
  });
});
