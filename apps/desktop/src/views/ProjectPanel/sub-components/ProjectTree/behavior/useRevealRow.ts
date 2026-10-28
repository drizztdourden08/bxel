/* @layer renderer-app @kind hook */
import { scrollTopToShow } from '@drizztdourden08/tessera';
import { useEffect, useRef } from 'react';
import type { SelectionModel } from '../../../../../project-browser/project-browser.type';
import { ITEM_ATTRIBUTE } from '../../../ProjectPanel.constants';
import type { RevealInput } from '../ProjectTree.type';

const useRevealRow = ({ request, rows, metrics, rootRef, indices }: RevealInput): void => {
  const pending = useRef<string | null>(null);
  const handled = useRef<SelectionModel['request']>(null);
  const latest = useRef({ rows, metrics });

  useEffect(() => {
    latest.current = { rows, metrics };
  }, [rows, metrics]);

  useEffect(() => {
    const root = rootRef.current;
    if (request === null || root === null || handled.current === request) return;
    handled.current = request;
    const index = latest.current.rows.findIndex((row) => row.item.key === request.key);
    if (index < 0) return;
    pending.current = request.focus ? request.key : null;
    const { rowHeight, viewport } = latest.current.metrics;
    root.scrollTop = scrollTopToShow({ index, rowHeight, viewport, scrollTop: root.scrollTop });
  }, [request, rootRef]);

  useEffect(() => {
    const key = pending.current;
    if (key === null) return;
    const found = rootRef.current?.querySelectorAll<HTMLElement>(`[${ITEM_ATTRIBUTE}]`);
    const element = [...(found ?? [])].find((each) => each.dataset.itemKey === key);
    if (element === undefined) return;
    pending.current = null;
    element.focus({ preventScroll: true });
  }, [indices, request, rootRef]);
};

export { useRevealRow };
