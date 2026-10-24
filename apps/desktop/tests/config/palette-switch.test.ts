/* @layer renderer-app @kind test */
import type { BankId, DocumentId } from '@bxel/document';
import { PALETTE_COMMAND_NAME } from '@bxel/palette';
import { describe, expect, it, vi } from 'vitest';
import { changePreview } from '../../src/palette-change/change-preview';
import { runChange } from '../../src/palette-change/run-change';
import { startSwitch } from '../../src/palette-change/start-switch';
import { useChangeStore } from '../../src/stores/useChangeStore';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { runSteps } from '../../src/transactions/run-steps';
import { firstSprite, openedProject, revisionOf, undoOnce } from './config-harness';

vi.mock('@drizztdourden08/brock-react', async () => (await import('../project/project-mocks')).brockReactMock());

describe('changing the palette of a sprite', () => {
  const withSecondBank = async (): Promise<{ documentId: DocumentId; first: BankId; second: BankId }> => {
    const { documentId } = await openedProject();
    const host = useDocumentStore.getState().host;
    const first = firstSprite(documentId).bankId;
    const made = runSteps(host, documentId, 'Second palette', [
      { name: PALETTE_COMMAND_NAME.paletteCreate, targets: null, options: { name: 'Warm', cap: 16, transparent: true, colors: ['#ff0000', '#00ff00'] }, ref: 'warm' },
    ]);
    if (!made.ok) throw new Error(made.error.message);
    return { documentId, first, second: made.created['warm'] as BankId };
  };

  it('opens the remap dialog first and changes nothing until it is applied', async () => {
    const { documentId, first, second } = await withSecondBank();
    const start = revisionOf(documentId);
    startSwitch(firstSprite(documentId).id, second);
    const request = useChangeStore.getState().request;
    expect(request).toMatchObject({ kind: 'switch', bankId: first, toBankId: second });
    expect(firstSprite(documentId).bankId).toBe(first);
    expect(revisionOf(documentId)).toBe(start);
    const view = useDocumentStore.getState().host.view(documentId);
    const preview = request && view ? changePreview(view, request) : null;
    expect(preview?.error).toBeNull();
    expect(preview?.picture).not.toBeNull();
  });

  it('moves the sprite to the other palette as one undo step', async () => {
    const { documentId, first, second } = await withSecondBank();
    startSwitch(firstSprite(documentId).id, second);
    const request = useChangeStore.getState().request;
    if (!request) throw new Error('no request');
    const done = runChange(useDocumentStore.getState().host, request, 'commit');
    expect(done.ok).toBe(true);
    expect(firstSprite(documentId).bankId).toBe(second);
    undoOnce(documentId);
    expect(firstSprite(documentId).bankId).toBe(first);
  });

  it('refuses the palette the sprite already uses', async () => {
    const { documentId, first } = await withSecondBank();
    startSwitch(firstSprite(documentId).id, first);
    const request = useChangeStore.getState().request;
    const view = useDocumentStore.getState().host.view(documentId);
    expect(request && view ? changePreview(view, request)?.error : null).toContain('already uses');
  });
});
