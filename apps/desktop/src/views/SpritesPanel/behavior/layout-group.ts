/* @layer renderer-app @kind logic */
import type { MenuGroup } from '@drizztdourden08/tessera';
import { ALIGN_MODES, MIN_DISTRIBUTE } from '../../../sheet-manager/align.constants';
import { ALIGN_TEXT } from '../../../sheet-manager/align-text.constants';
import { alignSprites } from '../../../sheet-manager/align-sprites';
import { styleSheet } from '../../../sheet-manager/style-sheet';
import type { ActionContext } from '../SpritesPanel.type';

const layoutGroup = ({ model }: ActionContext): MenuGroup => {
  const { sheet } = model;
  const manual = sheet?.layout.kind === 'manual';
  const onSheet = sheet ? model.ids.filter((id) => sheet.entries.some((entry) => entry.spriteId === id)).length : 0;
  return {
    id: 'layout',
    label: ALIGN_TEXT.group,
    items: [
      { id: 'arrange-by-hand', label: ALIGN_TEXT.byHand, disabled: sheet === null || manual, onSelect: () => sheet && styleSheet(sheet.id, { layout: 'manual' }) },
      ...ALIGN_MODES.map((mode) => ({
        id: `align-${mode}`,
        label: ALIGN_TEXT.modes[mode],
        disabled: !manual || onSheet < (mode === 'horizontal' || mode === 'vertical' ? MIN_DISTRIBUTE : 2),
        onSelect: () => alignSprites(sheet, model.ids, mode),
      })),
    ],
  };
};

export { layoutGroup };
