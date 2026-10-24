/* @layer renderer-app @kind hook */
import { useEffect } from 'react';
import { toast } from '@drizztdourden08/brock-react';
import { useNoticeStore } from '../stores/useNoticeStore';

const useEditorNotices = (): void => {
  const notice = useNoticeStore((state) => state.notice);
  useEffect(() => {
    if (notice) toast(notice.text, { variant: 'warning' });
  }, [notice]);
};

export { useEditorNotices };
