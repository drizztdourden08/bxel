/* @layer renderer-app @kind logic */
import { useWidgetLayoutStore } from '@drizztdourden08/brock-react';
import type { ToolbarItem } from '@drizztdourden08/tessera';
import type { Surface } from '../../../editor/tool-catalogue/surface.type';
import { useDrawingStore } from '../../../stores/useDrawingStore';
import { useToolStore } from '../../../stores/useToolStore';
import { VIEW_WIDGET_ID } from '../../../tool-menu/tool-menu.constants';
import { OPTIONS_TEXT, SYMMETRY_PRIORITY } from '../OptionsToolbar.constants';

const symmetryNames = (): string[] => {
  const tools = useToolStore.getState();
  const drawing = useDrawingStore.getState();
  return [
    ...(tools.symmetryX ? [OPTIONS_TEXT.symmetryNames.x] : []),
    ...(tools.symmetryY ? [OPTIONS_TEXT.symmetryNames.y] : []),
    ...(drawing.symmetryDiagonal ? [OPTIONS_TEXT.symmetryNames.diagonal] : []),
    ...(drawing.symmetryTurn ? [OPTIONS_TEXT.symmetryNames.turn] : []),
  ];
};

const symmetryItem = (surface: Surface): ToolbarItem[] => {
  const names = surface === 'sprite' || surface === 'tile' ? symmetryNames() : [];
  if (names.length === 0) return [];
  const label = OPTIONS_TEXT.symmetryOn(names);
  return [
    { kind: 'separator', id: 'before-symmetry' },
    {
      kind: 'button',
      id: 'symmetry-badge',
      label,
      description: OPTIONS_TEXT.symmetryDescription,
      icon: 'pixel-view-mirror',
      caption: OPTIONS_TEXT.symmetryCaption,
      priority: SYMMETRY_PRIORITY,
      onSelect: () => useWidgetLayoutStore.getState().open(VIEW_WIDGET_ID),
    },
  ];
};

export { symmetryItem };
