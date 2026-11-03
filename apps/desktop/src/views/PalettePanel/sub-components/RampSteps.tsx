/* @layer renderer-app @kind component */
import { RampStrip } from '@drizztdourden08/tessera';
import { rampDragStart } from '../behavior/ramp-drag-start';
import { rampSteps } from '../behavior/ramp-steps';
import { swatchClick } from '../behavior/swatch-click';
import { PALETTE_PANEL_TEXT } from '../PalettePanel.constants';
import type { RampStepsProps } from '../PalettePanel.type';

const RampSteps = ({ panel, indices, from, label }: RampStepsProps) => {
  const shown = indices.filter((index) => panel.slots[index] !== undefined);
  const selected = new Set(shown.flatMap((index, position) => (panel.selection.selected.has(index) ? [position] : [])));
  const act = (position: number, run: (index: number) => void): void => {
    const index = shown[position];
    if (index !== undefined) run(index);
  };
  return (
    <RampStrip
      size="sm"
      wrap
      steps={rampSteps(panel, shown)}
      value={null}
      selected={selected}
      selectionKeys={false}
      aria-label={PALETTE_PANEL_TEXT.rampSwatches(label)}
      className="ramp-row__swatches"
      onChange={() => undefined}
      stepData={(position) => ({ 'data-swatch-index': String(shown[position]) })}
      onSwatchDragStart={panel.lock.locked ? undefined : (position, event) => act(position, (index) => rampDragStart(index, from, event))}
      onStepClick={(position, event) => act(position, (index) => swatchClick(panel, index, event, false))}
      onStepDoubleClick={(position, event) => act(position, (index) => panel.editor.open(index, event.currentTarget))}
      onStepContextMenu={(position, event) => {
        event.preventDefault();
        act(position, (index) => swatchClick(panel, index, event, true));
      }}
    />
  );
};

export { RampSteps };
