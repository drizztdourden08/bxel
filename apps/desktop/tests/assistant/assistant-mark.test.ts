/* @layer renderer-app @kind test */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ASSISTANT_MARK_MS } from '../../src/stores/assistant-mark-store.constants';
import { useAssistantMarkStore } from '../../src/stores/useAssistantMarkStore';
import { useToolStore } from '../../src/stores/useToolStore';
import { check } from './app-tools-check';
import { openDocument, reset } from './app-tools-rig';

vi.mock('@drizztdourden08/brock-react', async () => (await import('./app-tools-mock')).brockMock());

const { ok } = check;

beforeEach(() => {
  vi.useFakeTimers();
  reset();
  openDocument();
  useAssistantMarkStore.getState().clear();
});

afterEach(() => {
  useAssistantMarkStore.getState().clear();
  vi.useRealTimers();
});

describe('S2 the assistant mark on the tool rail', { tags: ['standard'] }, () => {
  it('flashes the tool the assistant sets and clears it after one second', async () => {
    await ok('set_view', { tool: { id: 'eraser' } });
    expect(useToolStore.getState().tool).toBe('eraser');
    expect(useAssistantMarkStore.getState().tool).toBe('eraser');
    vi.advanceTimersByTime(ASSISTANT_MARK_MS - 1);
    expect(useAssistantMarkStore.getState().tool).toBe('eraser');
    vi.advanceTimersByTime(1);
    expect(useAssistantMarkStore.getState().tool).toBeNull();
  });

  it('moves the mark to the newest tool and restarts the second', async () => {
    await ok('set_view', { tool: { id: 'eraser' } });
    vi.advanceTimersByTime(ASSISTANT_MARK_MS / 2);
    await ok('set_view', { tool: { id: 'rect' } });
    vi.advanceTimersByTime(ASSISTANT_MARK_MS / 2);
    expect(useAssistantMarkStore.getState().tool).toBe('rect');
    vi.advanceTimersByTime(ASSISTANT_MARK_MS / 2);
    expect(useAssistantMarkStore.getState().tool).toBeNull();
  });

  it('does not flash when the assistant keeps the tool and only sets options', async () => {
    await ok('set_view', { tool: { id: 'pencil', options: { brushSize: 2 } } });
    expect(useAssistantMarkStore.getState().tool).toBeNull();
  });

  it('does not flash for the owner picking a tool', () => {
    useToolStore.getState().setTool('eraser');
    expect(useAssistantMarkStore.getState().tool).toBeNull();
  });
});
