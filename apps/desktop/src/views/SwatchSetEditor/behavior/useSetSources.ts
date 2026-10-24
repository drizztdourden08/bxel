/* @layer renderer-app @kind hook */
import { toast, getPlatform } from '@drizztdourden08/brock-react';
import { MAX_SET_COLORS } from '@bxel/project';
import { useCallback, useMemo } from 'react';
import { pickPaletteFile } from '../../../palette-source/pick-palette-file';
import { useProjectSetsStore } from '../../../stores/useProjectSetsStore';
import { findLibrarySet } from '../../../swatch-library/find-library-set';
import { makeSwatchSet } from '../../../swatch-library/make-swatch-set';
import { randomBytes } from '../../../swatch-library/random-bytes';
import { setSelectGroups } from '../../../swatch-library/set-select-groups';
import { useSwatchLibrary } from '../../../swatch-library/useSwatchLibrary';
import { SWATCH_EDITOR_TEXT } from '../SwatchSetEditor.constants';
import type { EditorState, SetSources } from '../SwatchSetEditor.type';

const useSetSources = (state: EditorState): SetSources => {
  const { sets, current, commit, select, report } = state;
  const library = useSwatchLibrary();
  const hasProject = useProjectSetsStore((store) => store.projectName !== null);
  const groups = useMemo(() => setSelectGroups(library.groups.filter((group) => group.origin !== 'user')), [library]);
  const names = useMemo(() => sets.map((set) => set.name), [sets]);

  const importFile = useCallback((): void => {
    const documents = getPlatform().documents;
    if (!documents) {
      report(SWATCH_EDITOR_TEXT.noDocuments);
      return;
    }
    void pickPaletteFile(documents).then((read) => {
      if (read === null) return;
      if (!read.ok) {
        report(read.message);
        return;
      }
      const { name, colors } = read.palette;
      const made = makeSwatchSet(name, colors, names, randomBytes);
      if (!commit(made)) return;
      select(made.setId);
      const cut = colors.length > MAX_SET_COLORS;
      toast(cut ? SWATCH_EDITOR_TEXT.importedCut(made.name, MAX_SET_COLORS) : SWATCH_EDITOR_TEXT.imported(made.name, colors.length), { variant: 'success' });
    });
  }, [commit, names, report, select]);

  const copyFrom = useCallback(
    (key: string): void => {
      const found = findLibrarySet(library, key);
      if (!found) return;
      const made = makeSwatchSet(found.name, found.colors, names, randomBytes);
      if (!commit(made)) return;
      select(made.setId);
      toast(SWATCH_EDITOR_TEXT.copied(made.name), { variant: 'success' });
    },
    [commit, library, names, select],
  );

  const copyToProject = useCallback((): void => {
    const projectName = useProjectSetsStore.getState().projectName;
    if (!current || projectName === null) return;
    const result = useProjectSetsStore.getState().put(current);
    if (result?.ok) toast(SWATCH_EDITOR_TEXT.projectCopied(current.name, projectName), { variant: 'success' });
    else report(SWATCH_EDITOR_TEXT.projectFailed(result?.ok === false ? result.message : ''));
  }, [current, report]);

  return { groups, hasProject, importFile, copyFrom, copyToProject };
};

export { useSetSources };
