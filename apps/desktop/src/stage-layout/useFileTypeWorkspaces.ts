/* @layer renderer-app @kind hook */
import { registerWorkspaces, useSettings } from '@drizztdourden08/brock-react';
import { useEffect } from 'react';
import type { AppSettings } from '../settings.type';
import { FILE_TYPE_WORKSPACES } from './file-type-workspaces.constants';

const useFileTypeWorkspaces = (): void => {
  const { settings, hydrated } = useSettings<AppSettings>();
  const remember = hydrated && settings.workspacePerFileType !== false;
  useEffect(() => (remember ? registerWorkspaces(FILE_TYPE_WORKSPACES) : undefined), [remember]);
};

export { useFileTypeWorkspaces };
