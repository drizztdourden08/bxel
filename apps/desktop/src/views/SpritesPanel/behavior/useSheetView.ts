/* @layer renderer-app @kind hook */
import { useSettings } from '@drizztdourden08/brock-react';
import { useEffect, useRef } from 'react';
import { viewBook } from '../../../manager-views/view-book';
import type { AppSettings } from '../../../settings.type';

const useSheetView = (sheetId: string | null): void => {
  const { settings, patch, hydrated } = useSettings<AppSettings>();
  const saved = useRef(settings.managerViews);
  useEffect(() => {
    saved.current = settings.managerViews;
  }, [settings.managerViews]);
  useEffect(() => {
    if (!hydrated) return undefined;
    viewBook.connect((managerViews) => patch({ managerViews }));
    return () => {
      viewBook.flush();
      viewBook.connect(null);
    };
  }, [hydrated, patch]);
  useEffect(() => {
    if (!hydrated || sheetId === null) return undefined;
    viewBook.attach(sheetId, saved.current);
    return () => viewBook.detach();
  }, [hydrated, sheetId]);
};

export { useSheetView };
