/* @layer renderer-app @kind test */
import type { CelId, ChangeSet, DocumentEvent, DocumentId, FrameId, LayerId, SpriteId } from '@bxel/document';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { announceEdit } from '../../src/assistant-presence/announce-edit';
import { FLASH_MS, PRESENCE_MS } from '../../src/assistant-presence/assistant-presence.constants';
import { presenceTextOf } from '../../src/assistant-presence/presence-text-of';
import { useAssistantPresenceStore } from '../../src/stores/useAssistantPresenceStore';

const empty: ChangeSet = { artwork: false, banks: [], sprites: [], sheets: [], presets: [], brushes: [], tilesets: [], tilemaps: [], animations: [] };

const changes: ChangeSet = {
  ...empty,
  sprites: [
    {
      id: 'spr-1' as SpriteId,
      kind: 'updated',
      meta: false,
      structure: false,
      recolored: false,
      cels: [{ celId: 'cel-1' as CelId, layerId: 'lay-1' as LayerId, frameId: 'frm-1' as FrameId, rect: { x: 2, y: 3, width: 4, height: 5 } }],
    },
  ],
};

const event = (patch: Partial<DocumentEvent> = {}): DocumentEvent => ({
  kind: 'commit',
  documentId: 'doc-1' as DocumentId,
  revision: 2,
  previousRevision: 1,
  label: 'Assistant (Claude Code): Flip horizontal',
  origin: 'mcp',
  actor: 'session-1',
  changes,
  ...patch,
});

describe('K1 assistant presence on the canvas', { tags: ['critical'] }, () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useAssistantPresenceStore.setState({ line: null, flashes: [] });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('reads the client and the action out of an assistant label', () => {
    expect(presenceTextOf('Assistant (Claude Code): Flip horizontal')).toBe('Claude Code: Flip horizontal');
    expect(presenceTextOf('Pencil stroke')).toBeNull();
  });

  it('shows the action for three seconds and flashes the changed rectangle once', () => {
    announceEdit(event());
    const state = useAssistantPresenceStore.getState();
    expect(state.line?.text).toBe('Claude Code: Flip horizontal');
    expect(state.flashes).toHaveLength(1);
    expect(state.flashes[0]).toMatchObject({ spriteId: 'spr-1', frameId: 'frm-1', rect: { x: 2, y: 3, width: 4, height: 5 } });
    vi.advanceTimersByTime(FLASH_MS);
    expect(useAssistantPresenceStore.getState().flashes).toHaveLength(0);
    expect(useAssistantPresenceStore.getState().line).not.toBeNull();
    vi.advanceTimersByTime(PRESENCE_MS);
    expect(useAssistantPresenceStore.getState().line).toBeNull();
  });

  it('ignores edits the owner made', () => {
    announceEdit(event({ origin: 'ui', label: 'Pencil stroke' }));
    expect(useAssistantPresenceStore.getState().line).toBeNull();
  });

  it('shows the action but no flash on reduced motion', () => {
    vi.stubGlobal('window', { matchMedia: () => ({ matches: true }) });
    announceEdit(event());
    const state = useAssistantPresenceStore.getState();
    expect(state.line?.text).toBe('Claude Code: Flip horizontal');
    expect(state.flashes).toHaveLength(0);
  });
});
