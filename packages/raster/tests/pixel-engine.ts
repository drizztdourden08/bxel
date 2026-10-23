/* @layer tests @kind logic */
import { counterIdSource, createEngine, documentCommands } from '@bxel/document';
import type { CommandStep, DocumentId, Engine, Project, SpriteId, TargetScope, TransactionRequest } from '@bxel/document';
import { rasterCommands } from '@bxel/raster';
import { brand } from './brand';

const documentId = brand<DocumentId>('doc_000001');

const pixelEngine = (project: Project): Engine =>
  createEngine({
    state: { documentId, revision: 1, project, readOnly: false },
    ids: counterIdSource(100),
    commands: [...documentCommands, ...rasterCommands],
  });

const scopeOf = (sprites: readonly SpriteId[], layers: TargetScope['layers'] = { by: 'all' }): TargetScope => ({
  sprites,
  layers,
  frames: { by: 'all' },
});

const stepOf = (name: string, targets: TargetScope, options: unknown): CommandStep => ({ name, targets, options });

const request = (steps: readonly CommandStep[], fields: Partial<TransactionRequest> = {}): TransactionRequest => ({
  documentId,
  baseRevision: 1,
  mode: 'commit',
  origin: 'ui',
  label: 'Test edit',
  steps,
  previewPixels: 0,
  ...fields,
});

export { documentId, pixelEngine, request, scopeOf, stepOf };
