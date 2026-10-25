/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { blockingFindings } from '../e2e/support/blocking-findings';

describe('which axe findings fail the accessibility test', () => {
  it('keeps serious and critical findings and drops the rest', () => {
    const found = blockingFindings([
      { rule: 'label', impact: 'critical', help: 'x', targets: ['button.save :: no name'] },
      { rule: 'region', impact: 'moderate', help: 'x', targets: ['div'] },
    ]);
    expect(found.map((finding) => finding.rule)).toEqual(['label']);
  });

  it('drops a gap that is on the Tessera list and keeps a new one of the same rule', () => {
    const found = blockingFindings([
      { rule: 'label-content-name-mismatch', impact: 'serious', help: 'x', targets: ['button[aria-label="Source, step 1"] :: mismatch', 'button[aria-label="Save"] :: mismatch'] },
    ]);
    expect(found).toEqual([{ rule: 'label-content-name-mismatch', impact: 'serious', help: 'x', targets: ['button[aria-label="Save"] :: mismatch'] }]);
  });
});
