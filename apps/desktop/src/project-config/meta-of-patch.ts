/* @layer renderer-app @kind logic */
import type { ProjectDefaults } from '@bxel/project';
import { assetAt } from '../project-meta/asset-at';
import type { DefaultsPatch, ProjectFocus } from './project-config.type';

const bankAt = (focus: ProjectFocus, palette: ProjectDefaults['palette']): string | undefined => {
  if (palette?.kind !== 'file') return undefined;
  const path = assetAt(focus.project.folders, palette);
  const entry = path === null ? undefined : [...focus.paths].find(([, known]) => known.toLowerCase() === path.toLowerCase());
  return focus.artwork?.banks.find((bank) => bank.id === entry?.[0])?.id;
};

const metaOfPatch = (focus: ProjectFocus, patch: DefaultsPatch): object => {
  const bankId = 'palette' in patch ? bankAt(focus, patch.palette) : undefined;
  return {
    ...('platformId' in patch ? { platformId: patch.platformId ?? null } : {}),
    ...('platformStrict' in patch ? { platformStrict: patch.platformStrict === true } : {}),
    ...(bankId === undefined ? {} : { defaultBankId: bankId }),
  };
};

export { metaOfPatch };
