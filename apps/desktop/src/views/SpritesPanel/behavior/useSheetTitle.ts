/* @layer renderer-app @kind hook */
import { widgets } from '@drizztdourden08/brock-react';
import { useEffect } from 'react';
import { SHEET_TEXT } from '../../../sheet-manager/sheet-text.constants';
import { SPRITES_WIDGET_ID } from '../SpritesPanel.constants';
import type { ManagerModel } from '../SpritesPanel.type';

const useSheetTitle = (model: ManagerModel | null): void => {
  const name = model?.sheet?.name ?? null;
  const count = (model?.facts.length ?? 0) + (model?.animationFacts.length ?? 0);
  useEffect(() => {
    widgets.setTitle(SPRITES_WIDGET_ID, name === null ? SHEET_TEXT.titleLabel : SHEET_TEXT.widgetTitle(name, count));
  }, [name, count]);
};

export { useSheetTitle };
