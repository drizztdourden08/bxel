/* @layer core @kind test */
import { counterIdSource, createEngine, documentCommands } from '@bxel/document';
import type {
  CommandStep,
  DocumentId,
  Engine,
  HistoryLimits,
  IdSource,
  SpriteId,
  TargetScope,
  TransactionRequest,
} from '@bxel/document';
import { brand, fixtureToProject } from './fixture-to-project';
import { heartPairFixture } from './heart-pair-fixture';

const documentId = brand<DocumentId>('doc_000001');

const bothHearts: TargetScope = {
  sprites: [brand<SpriteId>('spr_000010'), brand<SpriteId>('spr_000020')],
  layers: { by: 'names', names: ['Body'] },
  frames: { by: 'range', from: 0, to: 0 },
};

const heartEngine = (limits?: HistoryLimits): { engine: Engine; ids: IdSource } => {
  const ids = counterIdSource(100);
  const engine = createEngine({
    state: { documentId, revision: 1, project: fixtureToProject(heartPairFixture), readOnly: false },
    ids,
    commands: documentCommands,
    limits,
  });
  return { engine, ids };
};

const patchStep = (value: number, targets: TargetScope | null = bothHearts): CommandStep => ({
  name: 'pixels.patch',
  targets,
  options: { rect: { x: 2, y: 2, width: 2, height: 1 }, pixels: new Uint8Array([value, value]) },
});

const request = (steps: readonly CommandStep[], fields: Partial<TransactionRequest> = {}): TransactionRequest => ({
  documentId,
  baseRevision: 1,
  mode: 'commit',
  origin: 'mcp',
  label: 'Test edit',
  steps,
  previewPixels: 0,
  ...fields,
});

export { bothHearts, documentId, heartEngine, patchStep, request };
