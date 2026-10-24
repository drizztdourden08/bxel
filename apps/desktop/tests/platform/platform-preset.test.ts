/* @layer renderer-app @kind test */
import { COMMAND_NAME } from '@bxel/document';
import type { Artwork, DocumentId } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { changePlatform } from '../../src/new-sprite/change-platform';
import { createNewFile } from '../../src/new-sprite/create-new-file';
import { formMemory } from '../../src/new-sprite/form-memory';
import { initialForm } from '../../src/new-sprite/initial-form';
import { NEW_MEMORY_DEFAULT } from '../../src/new-sprite/new-sprite.constants';
import type { CreationForm } from '../../src/new-sprite/new-sprite.type';
import { newSummary } from '../../src/new-sprite/new-summary';
import { patchForm } from '../../src/new-sprite/patch-form';
import type { DocumentHost } from '../../src/documents/document-host.type';
import { artworkReport } from '../../src/platform-preset/artwork-report';
import { platformGroups } from '../../src/platform-preset/platform-groups';
import { setPlatform } from '../../src/platform-preset/set-platform';
import { runSteps } from '../../src/transactions/run-steps';
import { hostWithFile, newHost } from '../dialogs/dialog-harness';

const blank = (): CreationForm => initialForm(NEW_MEMORY_DEFAULT, []);

const artworkIn = (host: DocumentHost, documentId: DocumentId): Artwork => {
  const artwork = host.view(documentId)?.state.artwork;
  if (!artwork) throw new Error('no file');
  return artwork;
};

const chosen = (id: string): CreationForm => patchForm(blank(), changePlatform(blank(), id));

describe('choosing a platform in the New dialog', () => {
  it('sets the size, the color count, the transparent slot, the palette and the platform', () => {
    const form = chosen('snes-sprite');
    expect(form.platformId).toBe('snes-sprite');
    expect([form.width, form.height]).toEqual([16, 16]);
    expect(form.limit).toBe(16);
    expect(form.transparent).toBe(true);
    expect(form.source.kind).toBe('set');
    expect(form.source.set?.key).toBe('builtin:snes-sprite');
    expect(form.source.set?.colors).toHaveLength(15);
  });

  it('follows the rules of a platform with no transparent slot', () => {
    const form = chosen('nes-bg');
    expect(form.limit).toBe(4);
    expect(form.transparent).toBe(false);
    expect(form.background).toBe('opaque');
    expect(form.source.set?.colors).toHaveLength(4);
  });

  it('sets the cell size of a sheet too', () => {
    const form = chosen('gb-dmg');
    expect([form.cellWidth, form.cellHeight]).toEqual([form.width, form.height]);
  });

  it('leaves the other fields as they are when the platform is cleared', () => {
    const form = chosen('snes-sprite');
    const cleared = patchForm(form, changePlatform(form, 'none'));
    expect(cleared.platformId).toBeNull();
    expect(cleared.limit).toBe(16);
    expect(cleared.source.kind).toBe('set');
  });

  it('lists the platforms by family after the no-platform choice', () => {
    const groups = platformGroups();
    expect(groups[0]?.options).toEqual([{ value: 'none', label: 'No platform' }]);
    expect(groups.map((group) => group.label)).toContain('SNES');
    expect(groups.flatMap((group) => group.options)).toHaveLength(21);
  });
});

describe('warnings in the New dialog', () => {
  it('finds nothing wrong right after choosing a platform', () => {
    const summary = newSummary(chosen('snes-sprite'));
    expect(summary.platform?.name).toBe('SNES sprite 4bpp');
    expect(summary.platform?.rules).toBe('SNES sprite 4bpp: 16 slots, slot 0 transparent, up to 8 palettes.');
    expect(summary.platform?.findings).toEqual([]);
  });

  it('warns about a size and a limit the platform does not allow, and does not block', () => {
    const form = patchForm(chosen('snes-sprite'), { width: 10, height: 10, limit: 32 });
    const findings = newSummary(form).platform?.findings ?? [];
    expect(findings.map((finding) => finding.tier)).toEqual(['enforce', 'enforce']);
    expect(findings.some((finding) => finding.text.includes('10x10'))).toBe(true);
    expect(findings.some((finding) => finding.text.includes('holds 32 slots'))).toBe(true);
  });

  it('reports nothing without a platform', () => {
    expect(newSummary(blank()).platform).toBeNull();
  });
});

describe('the platform a file remembers', () => {
  it('is stored in the new file', () => {
    const host = newHost();
    const outcome = createNewFile(host, { ...chosen('snes-sprite'), name: 'hero' });
    expect(outcome.ok).toBe(true);
    if (!outcome.ok) return;
    const artwork = host.view(outcome.documentId)?.state.artwork;
    expect(artwork?.platformId).toBe('snes-sprite');
    expect(artwork?.banks[0]?.cap).toBe(16);
    expect(artwork?.banks[0]?.transparent).toBe(true);
    expect(artwork && artworkReport(artwork)?.findings).toEqual([]);
  });

  it('is left out of a file made without a platform', () => {
    const host = newHost();
    const outcome = createNewFile(host, { ...blank(), name: 'hero' });
    if (!outcome.ok) throw new Error(outcome.message);
    expect(host.view(outcome.documentId)?.state.artwork.platformId).toBeUndefined();
  });

  it('starts the next New dialog with the same platform', () => {
    const memory = formMemory(chosen('gb-dmg'), NEW_MEMORY_DEFAULT);
    expect(memory.platformId).toBe('gb-dmg');
    const next = initialForm(memory, []);
    expect(next.platformId).toBe('gb-dmg');
    expect(next.limit).toBe(4);
    expect(formMemory(blank(), memory).platformId).toBeUndefined();
  });

  it('is changed and cleared from the open file as one undo step each', () => {
    const { host, documentId } = hostWithFile();
    expect(setPlatform(host, documentId, 'pico-8')).toEqual({ ok: true });
    expect(host.view(documentId)?.state.artwork.platformId).toBe('pico-8');
    expect(setPlatform(host, documentId, 'none')).toEqual({ ok: true });
    expect(host.view(documentId)?.state.artwork.platformId).toBeUndefined();
    host.undo(documentId);
    expect(host.view(documentId)?.state.artwork.platformId).toBe('pico-8');
  });
});

describe('the rule check of an open file', () => {
  it('warns when the palette is off the grid of the platform and when a sprite breaks the size rule', () => {
    const { host, documentId } = hostWithFile();
    setPlatform(host, documentId, 'snes-sprite');
    const report = artworkReport(artworkIn(host, documentId));
    const rules = report?.findings.map((finding) => finding.text) ?? [];
    expect(report?.name).toBe('SNES sprite 4bpp');
    expect(rules.some((text) => text.includes('colour grid'))).toBe(true);
  });

  it('follows an edit to the palette', () => {
    const host = newHost();
    const outcome = createNewFile(host, { ...chosen('snes-sprite'), name: 'hero' });
    if (!outcome.ok) throw new Error(outcome.message);
    const bank = host.view(outcome.documentId)?.state.artwork.banks[0];
    const options = { bankId: bank?.id, colors: ['#010203'], mode: 'replace' };
    const done = runSteps(host, outcome.documentId, 'Add', [{ name: 'palette.import', targets: null, options }]);
    expect(done.ok).toBe(true);
    const report = artworkReport(artworkIn(host, outcome.documentId));
    expect(report?.findings).toHaveLength(1);
    expect(COMMAND_NAME.artworkUpdate).toBe('artwork.update');
  });

  it('gives no report for a file without a platform or with one this version does not know', () => {
    const { host, documentId } = hostWithFile();
    expect(artworkReport(artworkIn(host, documentId))).toBeNull();
    const done = runSteps(host, documentId, 'Set', [{ name: COMMAND_NAME.artworkUpdate, targets: null, options: { platformId: 'future-console' } }]);
    expect(done.ok).toBe(true);
    expect(artworkReport(artworkIn(host, documentId))).toBeNull();
  });
});
