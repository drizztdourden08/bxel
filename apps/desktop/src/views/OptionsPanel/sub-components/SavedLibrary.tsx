/* @layer renderer-app @kind component */
import { Stack } from '@drizztdourden08/tessera';
import { useSavedLibrary } from '../../../hooks/useSavedLibrary';
import { useDrawingStore } from '../../../stores/useDrawingStore';
import { LibrarySection } from './LibrarySection';

const SavedLibrary = () => {
  const { brushes, patterns } = useSavedLibrary();
  const brushId = useDrawingStore((state) => state.brushId);
  const patternId = useDrawingStore((state) => state.patternId);
  return (
    <Stack gap="md">
      <LibrarySection kind="brush" items={brushes} activeId={brushId} />
      <LibrarySection kind="pattern" items={patterns} activeId={patternId} />
    </Stack>
  );
};

export { SavedLibrary };
