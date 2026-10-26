/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import { makeSwatchSet } from '../../../swatch-library/make-swatch-set';
import { randomBytes } from '../../../swatch-library/random-bytes';
import { recolorSet } from '../../../swatch-library/recolor-set';
import { ADDED_COLOR, NEW_SET_COLORS, NEW_SET_NAME } from '../../../swatch-library/swatch-library.constants';
import { withAddedColor } from '../../../swatch-library/with-added-color';
import { withColor } from '../../../swatch-library/with-color';
import { withName } from '../../../swatch-library/with-name';
import { withoutColor } from '../../../swatch-library/without-color';
import type { EditorState, SetCommands } from '../SwatchSetEditor.type';

const useSetCommands = (state: EditorState): SetCommands => {
  const { sets, current, index, commit, select, pick } = state;
  return useMemo(
    () => ({
      create: (): void => {
        const made = makeSwatchSet(NEW_SET_NAME, NEW_SET_COLORS, sets.map((set) => set.name), randomBytes);
        if (commit(made)) select(made.setId);
      },
      rename: (name: string): void => {
        if (current) commit(withName(current, name));
      },
      addColor: (): void => {
        if (!current) return;
        const next = withAddedColor(current, ADDED_COLOR);
        if (commit(next)) pick(next.colors.length - 1);
      },
      recolor: (rgb: string, alpha: number): void => {
        if (current) commit(recolorSet(current, index, rgb, alpha));
      },
      nameColor: (name: string): void => {
        if (current) commit(withColor(current, index, { name }));
      },
      removeColor: (): void => {
        if (current) commit(withoutColor(current, index));
      },
    }),
    [commit, current, index, pick, select, sets],
  );
};

export { useSetCommands };
