/* @layer renderer-app @kind hook */
import type { MenuGroup, ToolbarItem } from '@drizztdourden08/tessera';
import { useActiveDocument } from '../../../hooks/useActiveDocument';
import { useDrawingStore } from '../../../stores/useDrawingStore';
import { useToolStore } from '../../../stores/useToolStore';
import { buttonItem, toggleItem } from '../../../toolbar-items';
import { DRAWING_TEXT, HINTS } from '../DrawingOptions.constants';

const useCustomBrushItems = (): ToolbarItem[] => {
  const tool = useToolStore((state) => state.tool);
  const view = useActiveDocument();
  const brushId = useDrawingStore((state) => state.brushId);
  const mode = useDrawingStore((state) => state.brushMode);
  const flipX = useDrawingStore((state) => state.brushFlipX);
  const flipY = useDrawingStore((state) => state.brushFlipY);
  const turn = useDrawingStore((state) => state.brushTurn);
  const patch = useDrawingStore((state) => state.patch);
  const saved = view?.state.artwork.brushes ?? [];
  if (tool !== 'pencil' || saved.length === 0) return [];
  const current = saved.find((brush) => brush.id === brushId);
  const group: MenuGroup = {
    id: 'brushes',
    label: DRAWING_TEXT.brushes,
    items: [
      { id: 'none', label: 'Square or circle tip', kind: 'radio' as const, checked: current === undefined, onSelect: () => patch({ brushId: null }) },
      ...saved.map((brush) => ({
        id: brush.id,
        label: `${brush.name} (${brush.width} by ${brush.height})`,
        icon: 'pixel-stamp' as const,
        kind: 'radio' as const,
        checked: brush.id === brushId,
        onSelect: () => patch({ brushId: brush.id }),
      })),
    ],
  };
  const orientation: MenuGroup = {
    id: 'orientation',
    label: 'Flip and turn',
    items: [
      { id: 'flip-x', label: 'Flip across', kind: 'check' as const, checked: flipX, onSelect: () => patch({ brushFlipX: !flipX }) },
      { id: 'flip-y', label: 'Flip down', kind: 'check' as const, checked: flipY, onSelect: () => patch({ brushFlipY: !flipY }) },
      ...([0, 90, 180, 270] as const).map((each) => ({ id: `turn-${each}`, label: `Turn ${each} degrees`, kind: 'radio' as const, checked: turn === each, onSelect: () => patch({ brushTurn: each }) })),
    ],
  };
  return [
    buttonItem({
      id: 'custom-brush',
      icon: 'pixel-stamp',
      hint: { name: DRAWING_TEXT.brushes, description: 'Paint with a brush saved from a selection.' },
      caption: current?.name ?? DRAWING_TEXT.noBrush,
      options: [group, orientation],
      openOn: 'click',
      onSelect: () => patch({ brushId: current ? null : (saved[0]?.id ?? null) }),
    }),
    ...(current
      ? [toggleItem({ id: 'brush-stencil', icon: 'pixel-brush-square', hint: HINTS.stencil, caption: DRAWING_TEXT.brushStencil, pressed: mode === 'stencil', onChange: (on) => patch({ brushMode: on ? 'stencil' : 'colour' }) })]
      : []),
  ];
};

export { useCustomBrushItems };
