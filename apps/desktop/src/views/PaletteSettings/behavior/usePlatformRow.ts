/* @layer renderer-app @kind hook */
import { toast } from '@drizztdourden08/brock-react';
import { useCallback, useMemo } from 'react';
import { useActiveDocument } from '../../../hooks/useActiveDocument';
import { artworkReport } from '../../../platform-preset/artwork-report';
import { NO_PLATFORM, PLATFORM_TEXT } from '../../../platform-preset/platform-preset.constants';
import { presetById } from '../../../platform-preset/preset-by-id';
import { setPlatform } from '../../../platform-preset/set-platform';
import { setStrict } from '../../../platform-preset/set-strict';
import { useDocumentStore } from '../../../stores/useDocumentStore';
import type { PlatformRowModel } from '../PaletteSettings.type';

const usePlatformRow = (): PlatformRowModel => {
  const view = useActiveDocument();
  const platformId = view?.state.artwork.platformId;
  const report = useMemo(() => (view ? artworkReport(view.state.artwork) : null), [view]);
  const known = presetById(platformId) !== null;

  const choose = useCallback((value: string): void => {
    const { host, activeId } = useDocumentStore.getState();
    if (activeId === null) return;
    const outcome = setPlatform(host, activeId, value);
    if (!outcome.ok) toast(outcome.message, { variant: 'danger' });
  }, []);

  const toggleStrict = useCallback((on: boolean): void => {
    const { host, activeId } = useDocumentStore.getState();
    if (activeId === null) return;
    const outcome = setStrict(host, activeId, on);
    if (!outcome.ok) toast(outcome.message, { variant: 'danger' });
  }, []);

  return {
    value: known ? (platformId ?? NO_PLATFORM) : NO_PLATFORM,
    report,
    unknown: platformId !== undefined && !known ? PLATFORM_TEXT.unknown(platformId) : null,
    strict: report?.strict ?? false,
    choose,
    toggleStrict,
  };
};

export { usePlatformRow };
