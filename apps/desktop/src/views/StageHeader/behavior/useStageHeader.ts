/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import { buildHeader } from '../../../stage-header/build-header';
import type { HeaderModel } from '../../../stage-header/stage-header.type';
import { HEADER_ACTIONS } from './header-actions';
import { useHeaderInput } from './useHeaderInput';

const useStageHeader = (): HeaderModel | null => {
  const input = useHeaderInput();
  return useMemo(() => buildHeader(input, HEADER_ACTIONS), [input]);
};

export { useStageHeader };
