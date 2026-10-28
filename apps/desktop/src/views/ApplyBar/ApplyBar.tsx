/* @layer renderer-app @kind component */
import { Box, Button, Flex, Text } from '@drizztdourden08/tessera';
import { useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import { cancelPending } from '../../editor/pending/cancel-pending';
import { commitPending } from '../../editor/pending/commit-pending';
import { APPLY_BAR_TEXT } from './ApplyBar.constants';
import { applyDetails } from './behavior/apply-details';
import { useApplyBar } from './behavior/useApplyBar';
import { useBarPlacement } from './behavior/useBarPlacement';
import { useNudgeKeys } from './behavior/useNudgeKeys';
import './ApplyBar.css';

const ApplyBar = () => {
  const bar = useApplyBar();
  const shown = bar !== null;
  const box = useRef<HTMLDivElement>(null);
  const placement = useBarPlacement(box, bar?.anchor ?? null, shown);
  useNudgeKeys(shown);
  useEffect(() => {
    if (!shown) return undefined;
    const before = box.current?.ownerDocument.activeElement;
    box.current?.querySelector<HTMLButtonElement>('button[data-apply]')?.focus({ preventScroll: true });
    return () => {
      if (before instanceof HTMLElement && before.isConnected) before.focus({ preventScroll: true });
    };
  }, [shown]);
  if (bar === null) return null;
  const style: CSSProperties = placement ? { insetInlineStart: placement.x, insetBlockStart: placement.y } : { visibility: 'hidden' };
  return (
    <Box
      ref={box}
      role="alertdialog"
      aria-modal="false"
      aria-label={APPLY_BAR_TEXT.region}
      className={bar.error === null ? 'apply-bar' : 'apply-bar apply-bar--error'}
      data-docked={placement?.docked ? '' : undefined}
      style={style}
      onKeyDown={(event) => {
        if (event.key !== 'Escape') return;
        event.stopPropagation();
        cancelPending();
      }}
    >
      <Text variant="label" className="apply-bar__title">{bar.title}</Text>
      <Text variant="caption" tone="muted" className="apply-bar__details">{applyDetails(bar, placement?.docked === true)}</Text>
      <Flex gap="xs" align="center" className="apply-bar__foot">
        {bar.nudges && <Text as="span" variant="caption" tone="muted" className="apply-bar__hint">{APPLY_BAR_TEXT.nudge}</Text>}
        <Flex gap="xs" className="apply-bar__actions">
          <Button size="sm" variant="ghost" onClick={cancelPending}>{APPLY_BAR_TEXT.cancel}</Button>
          <Button data-apply size="sm" variant="primary" disabled={bar.error !== null} onClick={commitPending}>{APPLY_BAR_TEXT.apply}</Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export { ApplyBar };
