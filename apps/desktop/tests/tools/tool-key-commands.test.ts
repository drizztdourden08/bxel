/* @layer renderer-app @kind test */
import { openKeymapAt } from '@drizztdourden08/brock-react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { slotsOf } from '../../src/editor/tool-catalogue/slots-of';
import { COMMAND_ID } from '../../src/keymap/keymap.constants';
import { TILEMAP_COMMAND } from '../../src/keymap/tilemap-command-id.constants';
import { flyoutModel } from '../../src/tool-menu/flyout-model';
import { flyoutSections } from '../../src/tool-menu/flyout-sections';
import { KEYMAP_ROUTE } from '../../src/tool-menu/tool-menu.constants';
import { resetEditor } from '../editor/option-harness';
import { findCommand } from '../keymap/find-command';

vi.mock('@drizztdourden08/brock-react', async () => (await import('./tools-harness')).toolsBrockMock());

beforeEach(() => {
  resetEditor();
  vi.mocked(openKeymapAt).mockClear();
});

describe('K3 spring loaded Hand and Zoom', { tags: ['critical'] }, () => {
  it('holds H and Z so the tool returns on release', () => {
    expect(findCommand(COMMAND_ID.tool('hand')).chord).toBe('H');
    expect(findCommand(COMMAND_ID.tool('zoom')).chord).toBe('Z');
    expect(findCommand(COMMAND_ID.tool('hand')).hold).toBeDefined();
    expect(findCommand(COMMAND_ID.tool('zoom')).hold).toBeDefined();
  });
});

describe('K4 Change key in the tool menu', { tags: ['critical'] }, () => {
  it('opens the keymap page at the command of the tool', () => {
    const slot = slotsOf('sprite').find((each) => each.tool === 'pencil');
    if (!slot) throw new Error('no pencil slot');
    const rows = flyoutSections(flyoutModel(slot, 'sprite'), true).flatMap((section) => section.rows);
    rows.find((row) => row.id === 'change-key')?.run();
    expect(openKeymapAt).toHaveBeenCalledWith(KEYMAP_ROUTE, COMMAND_ID.tool('pencil'));
  });

  it('leaves the row out of the flyout without a footer', () => {
    const slot = slotsOf('sprite')[0];
    if (!slot) throw new Error('no slot');
    const rows = flyoutSections(flyoutModel(slot, 'sprite'), false).flatMap((section) => section.rows);
    expect(rows.some((row) => row.id === 'change-key')).toBe(false);
  });
});

describe('K5 slot bindings with arguments', { tags: ['critical'] }, () => {
  it('serves the nine stamp slots with one command each for keep and use', () => {
    const keep = findCommand(TILEMAP_COMMAND.storeStamp);
    const use = findCommand(TILEMAP_COMMAND.recallStamp);
    expect(keep.bindings?.map((each) => each.chord)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9].map((slot) => `Mod+Alt+${slot}`));
    expect(use.bindings?.map((each) => each.chord)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9].map((slot) => `Alt+Shift+${slot}`));
    expect(keep.bindings?.map((each) => each.args.slot)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });
});
