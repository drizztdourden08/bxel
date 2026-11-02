/* @layer renderer-app @kind test */
import type { HoldContext } from '@drizztdourden08/brock-react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { COMMAND_ID } from '../../src/keymap/keymap.constants';
import { useViewStore } from '../../src/stores/useViewStore';
import { VIEW_DEFAULTS } from '../../src/stores/view-store.constants';
import { findCommand } from './find-command';

vi.mock('@drizztdourden08/brock-react', async () => (await import('./brock-react-mock')).brockReactMock());

const released = (tap: boolean): HoldContext => ({ point: { x: 0, y: 0 }, target: null, trigger: 'keyboard', data: undefined, heldMs: tap ? 50 : 900, tap, cause: 'keyup' });

const press = (id: string): void => void findCommand(id).run();

const letGo = (id: string, tap: boolean): void => findCommand(id).hold?.release(released(tap));

beforeEach(() => {
  useViewStore.setState({ ...VIEW_DEFAULTS });
});

describe('W7 the hold chords of the view', { tags: ['standard'] }, () => {
  it('shows the loupe while the key stays down and hides it on release', () => {
    press(COMMAND_ID.loupe);
    expect(useViewStore.getState().loupe).toBe(true);
    letGo(COMMAND_ID.loupe, false);
    expect(useViewStore.getState().loupe).toBe(false);
  });

  it('keeps the loupe on after a tap and turns it off with the next press', () => {
    press(COMMAND_ID.loupe);
    letGo(COMMAND_ID.loupe, true);
    expect(useViewStore.getState().loupe).toBe(true);
    press(COMMAND_ID.loupe);
    letGo(COMMAND_ID.loupe, false);
    expect(useViewStore.getState().loupe).toBe(false);
  });

  it('previews the background and hides the overlays only while held', () => {
    for (const [id, key] of [[COMMAND_ID.backgroundPreview, 'backgroundPreview'], [COMMAND_ID.hideOverlays, 'hideOverlays']] as const) {
      press(id);
      expect(useViewStore.getState()[key]).toBe(true);
      letGo(id, false);
      expect(useViewStore.getState()[key]).toBe(false);
    }
  });

  it('gives the three commands a hold with a tap window', () => {
    for (const id of [COMMAND_ID.loupe, COMMAND_ID.backgroundPreview, COMMAND_ID.hideOverlays]) expect(findCommand(id).hold?.tapMs).toBeGreaterThan(0);
  });
});
