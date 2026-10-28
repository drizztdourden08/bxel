/* @layer renderer-app @kind hook */
import type { MenuGroup, ToolbarItem } from '@drizztdourden08/tessera';
import { useDrawingStore } from '../../../stores/useDrawingStore';
import { useToolStore } from '../../../stores/useToolStore';
import { buttonItem } from '../../../toolbar-items';
import { DRAWING_TEXT } from '../DrawingOptions.constants';

const useSymmetryItems = (): ToolbarItem[] => {
  const x = useToolStore((state) => state.symmetryX);
  const y = useToolStore((state) => state.symmetryY);
  const toggle = useToolStore((state) => state.toggleSymmetry);
  const diagonal = useDrawingStore((state) => state.symmetryDiagonal);
  const turn = useDrawingStore((state) => state.symmetryTurn);
  const toggleMode = useDrawingStore((state) => state.toggleSymmetryMode);
  const on = [x && 'X', y && 'Y', diagonal && 'Diagonal', turn && '4 way'].filter(Boolean).join(' ');
  const group: MenuGroup = {
    id: 'symmetry',
    label: DRAWING_TEXT.symmetryTitle,
    items: [
      { id: 'x', label: 'Mirror across the vertical axis', icon: 'pixel-mirror-x', kind: 'check', checked: x, onSelect: () => toggle('x') },
      { id: 'y', label: 'Mirror across the horizontal axis', icon: 'pixel-mirror-y', kind: 'check', checked: y, onSelect: () => toggle('y') },
      { id: 'diagonal', label: 'Mirror across the diagonal', icon: 'pixel-flip-tile-x', kind: 'check', checked: diagonal, onSelect: () => toggleMode('diagonal') },
      { id: 'turn', label: 'Turn four ways around the crossing', icon: 'pixel-turn-right', kind: 'check', checked: turn, onSelect: () => toggleMode('turn') },
    ],
  };
  if (on === '') return [];
  return [
    buttonItem({
      id: 'symmetry',
      icon: 'pixel-mirror-x',
      hint: { name: DRAWING_TEXT.symmetry, description: 'Every stroke, shape, fill and stamp is repeated across the axes that are on.' },
      caption: `${DRAWING_TEXT.symmetry}: ${on}`,
      options: [group],
      openOn: 'click',
      onSelect: () => toggle('x'),
    }),
  ];
};

export { useSymmetryItems };
