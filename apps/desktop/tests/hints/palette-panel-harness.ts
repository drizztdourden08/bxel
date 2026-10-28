/* @layer renderer-app @kind test */
import { paletteSlots } from '../../src/editor/palette-slots';
import { duplicateGroups } from '../../src/palette-panel/duplicate-groups';
import { paletteSharing } from '../../src/palette-panel/palette-sharing';
import { paletteUsage } from '../../src/palette-panel/palette-usage';
import { PALETTE_VIEW_DEFAULTS } from '../../src/palette-view/palette-view.constants';
import type { PanelModel } from '../../src/views/PalettePanel/PalettePanel.type';
import { openEditor } from '../editor/editor-harness';

const held = { foreground: 3, background: 0, third: 3, fourth: 7 };

const fakePanel = (overrides: Partial<PanelModel> = {}): PanelModel => {
  const editor = openEditor();
  const target = editor.target();
  const artwork = editor.host.view(editor.documentId)?.state.artwork;
  if (!artwork) throw new Error('the editor has no artwork');
  const none = (): void => undefined;
  return {
    target,
    artwork,
    slots: paletteSlots(target.bank),
    held,
    usage: paletteUsage(artwork, target.bank, target.sprite, 'palette'),
    duplicates: duplicateGroups(target.bank),
    lock: { locked: false, reason: '' },
    sharing: paletteSharing(artwork, target.bank.id),
    view: { ...PALETTE_VIEW_DEFAULTS, showUse: true, change: none },
    selection: { selected: new Set([2]), focus: 2, setFocus: none, pick: none, all: none, clear: none },
    editor: { index: null, value: '', original: '', alpha: 1, name: '', anchor: { current: null }, open: none, change: none, changeAlpha: none, rename: none, reset: none, cancel: none, done: none },
    hinted: null,
    setHinted: none,
    ...overrides,
  };
};

export { fakePanel };
