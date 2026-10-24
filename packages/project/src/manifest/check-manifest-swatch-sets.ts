/* @layer core @kind logic */
import type { SwatchSet } from '../swatches/swatch.type';
import type { ManifestIssue } from './manifest.type';

const checkManifestSwatchSets = (sets: readonly SwatchSet[]): ManifestIssue[] => {
  const seen = new Set<string>();
  const issues: ManifestIssue[] = [];
  sets.forEach((set, index) => {
    if (seen.has(set.setId)) issues.push({ path: ['swatchSets', index, 'setId'], message: 'A swatch set id is used once.' });
    seen.add(set.setId);
  });
  return issues;
};

export { checkManifestSwatchSets };
