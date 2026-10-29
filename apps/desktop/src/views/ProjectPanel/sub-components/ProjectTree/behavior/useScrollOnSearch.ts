/* @layer renderer-app @kind hook */
import { useEffect } from 'react';
import type { RefObject } from 'react';
import type { TreeHandle } from '@drizztdourden08/tessera';
import type { PanelPartProps } from '../../../ProjectPanel.type';

const useScrollOnSearch = ({ search, browser }: PanelPartProps['model'], handle: RefObject<TreeHandle | null>): void => {
  const signature = `${search.text}|${search.tokens}|${search.missing}`;
  const first = browser.nested.top[0]?.key;

  useEffect(() => {
    if (search.active && first !== undefined) handle.current?.scrollToKey(first, 'start');
  }, [signature, first, search.active, handle]);
};

export { useScrollOnSearch };
