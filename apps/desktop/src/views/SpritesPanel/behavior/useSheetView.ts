/* @layer renderer-app @kind hook */
import { useWidgetState, useWidgetStateReady } from '@drizztdourden08/brock-react';
import { useEffect, useRef } from 'react';
import { viewBook } from '../../../manager-views/view-book';
import { SHEET_VIEWS_KEY } from '../SpritesPanel.constants';
import { useSheetViewScope } from './useSheetViewScope';

const useSheetView = (sheetId: string | null): void => {
  const scope = useSheetViewScope();
  const [stored, store] = useWidgetState<unknown>(SHEET_VIEWS_KEY, {}, scope === null ? {} : { scope });
  const ready = useWidgetStateReady(scope ?? undefined) && scope !== null;
  const saved = useRef(stored);
  useEffect(() => {
    saved.current = stored;
  }, [stored]);
  useEffect(() => {
    viewBook.reset();
  }, [scope]);
  useEffect(() => {
    if (!ready) return undefined;
    viewBook.connect((views) => store(views));
    return () => {
      viewBook.flush();
      viewBook.connect(null);
    };
  }, [ready, store]);
  useEffect(() => {
    if (!ready || sheetId === null) return undefined;
    viewBook.attach(sheetId, saved.current);
    return () => viewBook.detach();
  }, [ready, sheetId, scope]);
};

export { useSheetView };
