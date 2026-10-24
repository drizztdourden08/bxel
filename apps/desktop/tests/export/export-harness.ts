/* @layer renderer-app @kind test */
import { COMMAND_NAME, counterIdSource } from '@bxel/document';
import type { Artwork, DocumentId, PaletteBank, TargetScope } from '@bxel/document';
import { createDefaultArtwork } from '../../src/documents/create-default-artwork';
import { createDocumentHost } from '../../src/documents/create-document-host';
import type { DocumentHost } from '../../src/documents/document-host.type';
import { DEFAULT_EXPORT_SETTINGS } from '../../src/export/export.constants';
import type { ExportJob, ExportSettings, ExportSink, PlanInput, PlannedFile } from '../../src/export/export.type';

type ExportHarness = {
  readonly host: DocumentHost;
  readonly documentId: DocumentId;
};

type Written = { readonly path: string; readonly bytes: Uint8Array | null; readonly text: string | null };

type MemorySink = {
  readonly sink: ExportSink;
  readonly written: Written[];
  failAt: number;
};

const harness = (): ExportHarness => {
  const host = createDocumentHost({ ids: counterIdSource() });
  return { host, documentId: createDefaultArtwork(host) };
};

const artworkOf = (h: ExportHarness): Artwork => {
  const view = h.host.view(h.documentId);
  if (!view) throw new Error('the document is missing');
  return view.state.artwork;
};

const frozenOf = (h: ExportHarness): PlanInput['frozen'] => {
  const view = h.host.view(h.documentId);
  if (!view) throw new Error('the document is missing');
  return { revision: view.state.revision, artwork: view.state.artwork };
};

const spriteScope = (h: ExportHarness): TargetScope => {
  const sprite = artworkOf(h).sprites[0];
  if (!sprite) throw new Error('the document has no sprite');
  return { sprites: [sprite.id], layers: { by: 'all' }, frames: { by: 'all' } };
};

const step = (h: ExportHarness, name: string, options: unknown, targets: TargetScope | null = null): void => {
  const view = h.host.view(h.documentId);
  if (!view) throw new Error('the document is missing');
  const result = h.host.execute({
    documentId: h.documentId,
    baseRevision: view.state.revision,
    mode: 'commit',
    origin: 'ui',
    label: name,
    steps: [{ name, targets: targets ?? spriteScope(h), options }],
    previewPixels: 0,
  });
  if (!result.ok) throw new Error(result.error.message);
};

const addFrame = (h: ExportHarness, durationMs: number): void => {
  step(h, COMMAND_NAME.frameAdd, { durationMs });
};

const paint = (h: ExportHarness, frameIndex: number, x: number, index: number): void => {
  const sprite = artworkOf(h).sprites[0];
  const layer = sprite?.layers[0];
  const frame = sprite?.frames[frameIndex];
  if (!sprite || !layer || !frame) throw new Error('the cell is missing');
  const scope: TargetScope = { sprites: [sprite.id], layers: { by: 'ids', ids: [layer.id] }, frames: { by: 'ids', ids: [frame.id] } };
  step(h, COMMAND_NAME.pixelsPaint, { points: [{ x, y: 0 }], brush: { shape: 'square', size: 1 }, index }, scope);
};

const threeFrames = (): ExportHarness => {
  const h = harness();
  addFrame(h, 100);
  addFrame(h, 100);
  paint(h, 0, 1, 2);
  paint(h, 1, 2, 3);
  paint(h, 2, 3, 4);
  return h;
};

const settingsOf = (patch: Partial<ExportSettings>): ExportSettings => ({ ...DEFAULT_EXPORT_SETTINGS, folder: 'C:\\art', ...patch });

const withBank = (artwork: Artwork, bank: PaletteBank, spriteName: string): Artwork => {
  const first = artwork.sprites[0];
  if (!first) throw new Error('the document has no sprite');
  return {
    ...artwork,
    banks: [...artwork.banks, bank],
    sprites: [...artwork.sprites, { ...first, id: `${first.id}b` as typeof first.id, name: spriteName, bankId: bank.id }],
  };
};

const bytesOf = (file: PlannedFile): Uint8Array => {
  const made = file.make();
  if (!made.ok || made.data.kind !== 'bytes') throw new Error('the file has no bytes');
  return made.data.bytes;
};

const textOf = (file: PlannedFile): string => {
  const made = file.make();
  if (!made.ok || made.data.kind !== 'text') throw new Error('the file has no text');
  return made.data.text;
};

const memorySink = (): MemorySink => {
  const written: Written[] = [];
  const memory: MemorySink = {
    written,
    failAt: -1,
    sink: {
      writeBytes: (path, bytes) => {
        if (memory.failAt === written.length) return Promise.reject(new Error('The disk is full'));
        written.push({ path, bytes, text: null });
        return Promise.resolve();
      },
      writeText: (path, text) => {
        if (memory.failAt === written.length) return Promise.reject(new Error('The disk is full'));
        written.push({ path, bytes: null, text });
        return Promise.resolve();
      },
    },
  };
  return memory;
};

const stubJob = (signal: AbortSignal = new AbortController().signal): ExportJob & { readonly lines: string[] } => {
  const lines: string[] = [];
  return {
    signal,
    lines,
    step: (_id, line) => {
      if (line !== undefined) lines.push(line);
    },
    progress: (_fraction, line) => {
      if (line !== undefined) lines.push(line);
    },
    setCancellable: () => undefined,
  };
};

export { addFrame, artworkOf, bytesOf, frozenOf, harness, memorySink, paint, settingsOf, step, stubJob, textOf, threeFrames, withBank };
export type { ExportHarness, MemorySink };
