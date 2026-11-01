/* @layer renderer-app @kind component */
import { Text } from '@drizztdourden08/tessera';
import { PALETTE_PANEL_TEXT } from '../PalettePanel.constants';
import type { PanelProps } from '../PalettePanel.type';

/** Says which palette the frame being edited draws with, when the panel follows an animation. */
const AnimationNote = ({ panel }: PanelProps) => {
  const { animation } = panel.target;
  if (!animation) return null;
  const position = animation.animation.frames.findIndex((each) => each.id === animation.frame.id) + 1;
  return (
    <Text variant="caption" tone="muted" className="palette-panel__frame-note">
      {PALETTE_PANEL_TEXT.frameUses(Math.max(position, 1), panel.target.bank.name)}
    </Text>
  );
};

export { AnimationNote };
