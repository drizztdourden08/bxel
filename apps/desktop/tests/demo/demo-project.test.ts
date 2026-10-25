/* @layer renderer-app @kind test */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { readSaved } from '../e2e/support/read-saved';
import { buildDemoArtwork } from './build-demo-artwork';
import { DEMO_NAME, FRAME_MS } from './demo-art.constants';
import { demoFiles } from './demo-files';

const ROOT = join(import.meta.dirname, '../../demo', DEMO_NAME);

const WRITE = process.env['BXEL_WRITE_DEMO'] === '1';

const files = demoFiles(buildDemoArtwork());

const loaded = () => readSaved(join(ROOT, 'sheets', 'party.bxsheet'));

describe('the demo project', () => {
  test.skipIf(!WRITE)('writes the demo project from the real encoders', () => {
    for (const [path, bytes] of files) {
      mkdirSync(dirname(join(ROOT, path)), { recursive: true });
      writeFileSync(join(ROOT, path), bytes);
    }
    expect(files.size).toBeGreaterThan(5);
  });

  test.skipIf(WRITE)('every committed file is what the encoders write today', () => {
    expect([...files.keys()].sort()).toContain(`${DEMO_NAME}.bxproject`);
    for (const [path, bytes] of files) expect(Buffer.compare(readFileSync(join(ROOT, path)), Buffer.from(bytes)), path).toBe(0);
  });

  test.skipIf(WRITE)('holds a tagged animation, a sheet of two sprites, a palette, a tileset and a tilemap', () => {
    const artwork = loaded();
    const hero = artwork.sprites.find((sprite) => sprite.name === 'hero');
    expect(hero?.frames.map((frame) => frame.durationMs)).toEqual([...FRAME_MS]);
    expect(hero?.tags.map((tag) => tag.name)).toEqual(['walk']);
    expect(artwork.sheets).toHaveLength(1);
    expect(artwork.sheets[0]?.entries).toHaveLength(2);
    expect(artwork.banks.map((bank) => [bank.name, bank.cap])).toEqual([['Demo 16', 16]]);
    const map = readSaved(join(ROOT, 'tilemaps', 'meadow.bxmap'));
    expect(map.tilesets[0]?.tiles).toHaveLength(3);
    expect(map.tilemaps[0]).toMatchObject({ name: 'meadow', columns: 12, rows: 8 });
  });
});
