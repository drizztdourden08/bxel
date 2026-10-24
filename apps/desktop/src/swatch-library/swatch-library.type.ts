/* @layer renderer-app @kind types */
import type { BankId, DocumentId } from '@bxel/document';
import type { ProjectResult, SwatchColor, SwatchSet, SwatchSetId } from '@bxel/project';
import type { SourceColor } from '../palette-source/palette-source.type';

type SetOrigin = 'builtin' | 'user' | 'project';

interface LibrarySet {
  key: string;
  origin: SetOrigin;
  name: string;
  colors: readonly SourceColor[];
  setId: SwatchSetId | null;
}

interface SetGroup {
  origin: SetOrigin;
  label: string;
  sets: readonly LibrarySet[];
}

interface SwatchLibrary {
  builtin: readonly LibrarySet[];
  user: readonly LibrarySet[];
  project: readonly LibrarySet[];
  groups: readonly SetGroup[];
}

type LoadMode = 'append' | 'replace';

interface LoadPlan {
  mode: LoadMode;
  colors: readonly string[];
  dropped: number;
  skipped: number;
}

interface LoadRequest {
  documentId: DocumentId;
  bankId: BankId;
  set: LibrarySet;
  mode: LoadMode;
}

interface ColorEntry {
  id: string;
  at: number;
  color: SwatchColor;
}

type LoadOutcome = { ok: true; message: string } | { ok: false; message: string };

interface UserSets {
  sets: readonly SwatchSet[];
  save: (set: SwatchSet) => ProjectResult<readonly SwatchSet[]>;
  remove: (setId: SwatchSetId) => void;
}

export type { ColorEntry, LibrarySet, LoadMode, LoadOutcome, LoadRequest, LoadPlan, SetGroup, SetOrigin, SwatchLibrary, UserSets };
