/* @layer renderer-app @kind logic */
import type { Ramp } from '@bxel/document';
import type { MenuGroup } from '@drizztdourden08/tessera';
import { byLightness } from '../../../palette-ramps/by-lightness';
import { editRamp } from '../../../palette-ramps/edit-ramp';
import { rampSlots } from '@bxel/palette';
import { usePaletteSelectionStore } from '../../../stores/usePaletteSelectionStore';
import { RAMP_ROW_TEXT } from '../PalettePanel.constants';
import type { PanelModel } from '../PalettePanel.type';
import { reportOutcome } from './report-outcome';

const rampRowGroups = (panel: PanelModel, ramp: Ramp, rename: () => void): MenuGroup[] => {
  const { target, lock } = panel;
  const edit = (change: Parameters<typeof editRamp>[2]) => reportOutcome(editRamp(target, ramp.id, change));
  const select = () => {
    const ids = rampSlots(target.bank, ramp).map((index) => String(target.bank.slots[index]?.id));
    usePaletteSelectionStore.getState().select({ bankId: target.bank.id, selected: ids, anchor: ids[0] ?? null });
  };
  return [
    {
      id: 'ramp',
      items: [
        { id: 'rename', label: RAMP_ROW_TEXT.rename, disabled: lock.locked, onSelect: rename },
        { id: 'reverse', label: RAMP_ROW_TEXT.reverse, disabled: lock.locked, onSelect: () => edit({ swatches: [...ramp.swatches].reverse() }) },
        { id: 'select', label: RAMP_ROW_TEXT.select, onSelect: select },
        { id: 'sort', label: RAMP_ROW_TEXT.sort, disabled: lock.locked, onSelect: () => edit({ swatches: byLightness(target.bank, ramp.swatches) }) },
        { separator: true },
        { id: 'delete', label: RAMP_ROW_TEXT.remove, tone: 'danger', disabled: lock.locked, onSelect: () => edit({ delete: true }) },
      ],
    },
  ];
};

export { rampRowGroups };
