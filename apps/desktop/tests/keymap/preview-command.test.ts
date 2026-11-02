/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { COMMAND_ID } from '../../src/keymap/keymap.constants';
import { PREVIEW_DEFAULTS } from '../../src/stores/preview-store.constants';
import { usePreviewStore } from '../../src/stores/usePreviewStore';
import { findCommand } from './find-command';

vi.mock('@drizztdourden08/brock-react', async () => (await import('./brock-react-mock')).brockReactMock());

beforeEach(() => {
  usePreviewStore.setState({ ...PREVIEW_DEFAULTS });
});

describe('W7 the Preview section', { tags: ['standard'] }, () => {
  it('is shown at first and F7 hides and shows it', () => {
    expect(findCommand(COMMAND_ID.previewSection).chord).toBe('F7');
    findCommand(COMMAND_ID.previewSection).run();
    expect(usePreviewStore.getState().shown).toBe(false);
    findCommand(COMMAND_ID.previewSection).run();
    expect(usePreviewStore.getState().shown).toBe(true);
  });

  it('plays on the canvas at first and keeps the size it was given', () => {
    expect(usePreviewStore.getState().onCanvas).toBe(true);
    usePreviewStore.getState().setScale(4);
    usePreviewStore.getState().setOnCanvas(false);
    expect(usePreviewStore.getState()).toMatchObject({ scale: 4, onCanvas: false });
  });
});
