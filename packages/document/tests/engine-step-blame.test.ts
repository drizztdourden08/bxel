/* @layer core @kind test */
import { counterIdSource, createEngine, defineCommand, documentCommands } from '@bxel/document';
import type { CommandStep, DocumentId } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { brand, fixtureToArtwork } from './fixture-to-artwork';
import { heartPairFixture } from './heart-pair-fixture';
import { patchStep, request } from './heart-engine';

const documentId = brand<DocumentId>('doc_000001');

const twinSprite = defineCommand({
  name: 'test.twin',
  scope: 'none',
  schema: z.strictObject({}),
  run: (draft) => {
    const first = draft.artwork.sprites[0];
    if (first) draft.artwork = { ...draft.artwork, sprites: [...draft.artwork.sprites, { ...first, id: draft.ids.next('spr') as typeof first.id }] };
  },
});

const engineWithTwin = () =>
  createEngine({
    state: { documentId, revision: 1, artwork: fixtureToArtwork(heartPairFixture), readOnly: false },
    ids: counterIdSource(100),
    commands: [...documentCommands, twinSprite],
  });

const quiet = (name: string): CommandStep => ({ name, targets: null, options: {} });

describe('a failure found after the steps ran', () => {
  it('names the first step that caused it', () => {
    const engine = engineWithTwin();
    const result = engine.execute(request([quiet('test.twin'), quiet('test.twin')]));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatchObject({ code: 'NAME_TAKEN', step: 0 });
  });

  it('does not blame an earlier step that was fine', () => {
    const engine = engineWithTwin();
    const result = engine.execute(request([patchStep(2), quiet('test.twin')]));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatchObject({ code: 'NAME_TAKEN', step: 1 });
  });
});
