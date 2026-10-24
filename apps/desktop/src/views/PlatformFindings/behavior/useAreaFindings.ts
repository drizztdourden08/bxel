/* @layer renderer-app @kind hook */
import { useCallback, useEffect, useMemo } from 'react';
import { focusArea } from '../../../platform-preset/focus-area';
import type { AreaHighlight, PlatformReport } from '../../../platform-preset/platform-preset.type';
import { useAreaStore } from '../../../stores/useAreaStore';
import type { AreaFindingsModel } from '../PlatformFindings.type';

const useAreaFindings = (report: PlatformReport): AreaFindingsModel => {
  const selected = useAreaStore((state) => state.highlight?.key ?? null);
  const areas = useMemo(() => report.findings.flatMap((finding) => (finding.area ? [finding.area] : [])), [report]);
  const hasAreas = areas.length > 0;

  useEffect(() => {
    useAreaStore.getState().sync(areas);
  }, [areas]);

  useEffect(() => {
    if (!hasAreas) return undefined;
    return () => useAreaStore.getState().clear();
  }, [hasAreas]);

  const toggle = useCallback((area: AreaHighlight): void => {
    const store = useAreaStore.getState();
    const showing = store.highlight?.key !== area.key;
    store.toggle(area);
    if (showing) focusArea(area);
  }, []);

  return { selected, toggle };
};

export { useAreaFindings };
