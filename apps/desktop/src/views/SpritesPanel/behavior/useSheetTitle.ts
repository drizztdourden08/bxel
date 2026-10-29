/* @layer renderer-app @kind hook */
import { widgets } from '@drizztdourden08/brock-react';
import { useEffect } from 'react';
import { SHEET_TEXT } from '../../../sheet-manager/sheet-text.constants';
import { SPRITES_WIDGET_ID } from '../SpritesPanel.constants';

const useSheetTitle = (name: string | null, count: number): void => {
  useEffect(() => {
    widgets.setTitle(SPRITES_WIDGET_ID, name === null ? SHEET_TEXT.titleLabel : SHEET_TEXT.widgetTitle(name, count));
  }, [name, count]);
};

export { useSheetTitle };
