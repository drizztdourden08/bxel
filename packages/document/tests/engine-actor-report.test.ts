/* @layer core @kind test */
import { addReport, counterIdSource, createEngine, defineCommand, documentCommands, transactionRequestSchema } from '@bxel/document';
import type { CommandStep, DocumentEvent, Engine } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { fixtureToArtwork } from './fixture-to-artwork';
import { documentId, patchStep, request } from './heart-engine';
import { heartPairFixture } from './heart-pair-fixture';

const countCommand = defineCommand({
  name: 'test.count',
  scope: 'none',
  schema: z.strictObject({ key: z.string(), amount: z.number() }),
  run: (draft, input) => {
    addReport(draft, input.options.key, input.options.amount);
  },
});

const count = (key: string, amount: number): CommandStep => ({ name: 'test.count', targets: null, options: { key, amount } });

const countingEngine = (): Engine =>
  createEngine({
    state: { documentId, revision: 1, artwork: fixtureToArtwork(heartPairFixture), readOnly: false },
    ids: counterIdSource(100),
    commands: [...documentCommands, countCommand],
  });

const recorded = (engine: Engine): DocumentEvent[] => {
  const events: DocumentEvent[] = [];
  engine.subscribe((event) => events.push(event));
  return events;
};

describe('report', () => {
  it('starts empty and merges the same key across steps by sum', () => {
    const engine = countingEngine();
    const plain = engine.execute(request([patchStep(5)]));
    expect(plain.ok ? plain.report : null).toEqual({});
    const result = engine.execute(request([count('a', 2), count('b', 1), count('a', 3)], { baseRevision: 2 }));
    expect(result.ok ? result.report : null).toEqual({ a: 5, b: 1 });
  });

  it('is the same in a preview as in a commit', () => {
    const engine = countingEngine();
    const steps = [count('a', 2), count('a', 3)];
    const preview = engine.execute(request(steps, { mode: 'preview' }));
    const commit = engine.execute(request(steps));
    expect(preview.ok ? preview.report : null).toEqual({ a: 5 });
    expect(commit.ok ? commit.report : null).toEqual({ a: 5 });
  });
});

describe('actor', () => {
  it('defaults to ui and follows the entry through undo and redo', () => {
    const engine = countingEngine();
    const events = recorded(engine);
    engine.execute(request([patchStep(5)]));
    engine.undo({ documentId, expectedRevision: 2 });
    engine.redo({ documentId, expectedRevision: 3 });
    expect(events.map((event) => [event.kind, event.actor])).toEqual([
      ['commit', 'ui'],
      ['undo', 'ui'],
      ['redo', 'ui'],
    ]);
  });

  it('keeps the actor that made the edit', () => {
    const engine = countingEngine();
    const events = recorded(engine);
    engine.execute(request([patchStep(5)], { actor: 'mcp_session_1' }));
    engine.undo({ documentId, expectedRevision: 2 });
    engine.redo({ documentId, expectedRevision: 3 });
    engine.execute(request([patchStep(6)], { baseRevision: 4 }));
    expect(events.map((event) => event.actor)).toEqual(['mcp_session_1', 'mcp_session_1', 'mcp_session_1', 'ui']);
  });

  it('is an optional string on the request schema', () => {
    const base = { ...request([]), previewPixels: 0 };
    expect(transactionRequestSchema.safeParse(base).success).toBe(true);
    expect(transactionRequestSchema.safeParse({ ...base, actor: 'mcp_session_1' }).success).toBe(true);
    expect(transactionRequestSchema.safeParse({ ...base, actor: '' }).success).toBe(false);
  });
});
