/* @layer core @kind test */
import { decodeArtwork, LOAD_ERROR, MIMETYPE } from '@bxel/document/native';
import { strToU8, zipSync } from 'fflate';
import { describe, expect, it } from 'vitest';
import { editDocument, editFiles, editManifest, pack } from './container-edit';
import { firstCode } from './first-code';
import { encodeHeart, artworkOf } from './native-fixture';

describe('native open checks: the archive', () => {
  it('rejects bytes that are not a zip', () => {
    const report = decodeArtwork(Uint8Array.from([1, 2, 3, 4, 5]));
    expect(report.outcome).toBe('fatal');
    expect(firstCode(report)).toBe(LOAD_ERROR.FILE_NOT_BXEL);
    expect(report.artwork).toBeNull();
    expect(report.readOnly).toBe(true);
  });

  it('rejects a zip whose mimetype is something else', () => {
    const report = decodeArtwork(pack({ mimetype: strToU8('text/plain') }));
    expect(firstCode(report)).toBe(LOAD_ERROR.FILE_NOT_BXEL);
  });

  it('reports a truncated archive', () => {
    const bytes = encodeHeart();
    const report = decodeArtwork(bytes.slice(0, Math.floor(bytes.length / 2)));
    expect(report.outcome).toBe('fatal');
    expect(firstCode(report)).toBe(LOAD_ERROR.FILE_TRUNCATED);
  });

  it('refuses an entry that declares more than the entry limit before inflating it', () => {
    const bomb = zipSync({
      mimetype: [strToU8(MIMETYPE), { level: 0 }],
      'cels/cel_bomb.idx': new Uint8Array(65 * 1024 * 1024),
    });
    expect(firstCode(decodeArtwork(bomb))).toBe(LOAD_ERROR.FILE_TOO_LARGE);
  });

  it('rejects a missing or malformed manifest', () => {
    const missing = editFiles(encodeHeart(), (files) => {
      delete files['manifest.json'];
    });
    expect(firstCode(decodeArtwork(missing))).toBe(LOAD_ERROR.MANIFEST_INVALID);
    const wrongFormat = editManifest(encodeHeart(), (manifest) => {
      manifest.format = 'other';
    });
    const report = decodeArtwork(wrongFormat);
    expect(firstCode(report)).toBe(LOAD_ERROR.MANIFEST_INVALID);
    expect(report.issues[0]?.path).toBe('$.format');
    const broken = editFiles(encodeHeart(), (files) => {
      files['manifest.json'] = strToU8('{ not json');
    });
    expect(firstCode(decodeArtwork(broken))).toBe(LOAD_ERROR.MANIFEST_INVALID);
  });
});

describe('native open checks: versions', () => {
  it('opens a newer file read-only when the minimum reader version is known', () => {
    const bytes = editManifest(encodeHeart(), (manifest) => {
      manifest.formatVersion = 2;
      manifest.minReaderVersion = 1;
    });
    const report = decodeArtwork(bytes);
    expect(report.outcome).toBe('ok');
    expect(report.readOnly).toBe(true);
    expect(report.notice).toContain('newer');
    expect(artworkOf(report).sprites).toHaveLength(2);
  });

  it('refuses a newer file whose minimum reader version is unknown', () => {
    const bytes = editManifest(encodeHeart(), (manifest) => {
      manifest.formatVersion = 3;
      manifest.minReaderVersion = 2;
    });
    const report = decodeArtwork(bytes);
    expect(report.outcome).toBe('fatal');
    expect(firstCode(report)).toBe(LOAD_ERROR.VERSION_TOO_NEW);
  });
});

describe('native open checks: entries and document', () => {
  it('reports a missing document.json', () => {
    const bytes = editFiles(encodeHeart(), (files) => {
      delete files['document.json'];
    });
    const report = decodeArtwork(bytes);
    expect(report.outcome).toBe('fatal');
    expect(firstCode(report)).toBe(LOAD_ERROR.ENTRY_MISSING);
    expect(report.issues[0]?.path).toBe('document.json');
  });

  it('reports a document.json that fails its checksum', () => {
    const bytes = editFiles(encodeHeart(), (files) => {
      files['document.json'] = strToU8('{}');
    });
    expect(firstCode(decodeArtwork(bytes))).toBe(LOAD_ERROR.ENTRY_CHECKSUM);
  });

  it('reports a document that breaks the schema with a JSON path', () => {
    const bytes = editDocument(encodeHeart(), (document) => {
      const sprite = document.sprites[0];
      if (sprite) sprite.width = 0;
    });
    const report = decodeArtwork(bytes);
    expect(report.outcome).toBe('fatal');
    expect(firstCode(report)).toBe(LOAD_ERROR.DOCUMENT_INVALID);
    expect(report.issues[0]?.path).toBe('$.sprites[0].width');
  });

  it('reports a duplicate id', () => {
    const bytes = editDocument(encodeHeart(), (document) => {
      const [first, second] = document.sprites;
      if (first && second) second.id = first.id;
    });
    const report = decodeArtwork(bytes);
    expect(report.outcome).toBe('fatal');
    expect(firstCode(report)).toBe(LOAD_ERROR.REFERENCE_BROKEN);
    expect(report.issues[0]?.message).toContain('spr_000010');
  });

  it('reports a sprite that points at a bank that does not exist', () => {
    const bytes = editDocument(encodeHeart(), (document) => {
      const sprite = document.sprites[1];
      if (sprite) sprite.bankId = 'bnk_999999';
    });
    const report = decodeArtwork(bytes);
    expect(report.outcome).toBe('fatal');
    expect(firstCode(report)).toBe(LOAD_ERROR.REFERENCE_BROKEN);
    expect(report.issues[0]?.path).toBe('$.sprites[1].bankId');
  });

  it('reports a bank that breaks the transparent slot policy', () => {
    const bytes = editDocument(encodeHeart(), (document) => {
      const bank = document.banks[0];
      if (bank) bank.transparent = false;
    });
    expect(firstCode(decodeArtwork(bytes))).toBe(LOAD_ERROR.DOCUMENT_INVALID);
  });
});
