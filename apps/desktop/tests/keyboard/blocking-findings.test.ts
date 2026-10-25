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
      { rule: 'target-size', impact: 'serious', help: 'x', targets: ['.collapse-toggle :: small', '.my-button :: small'] },
    ]);
    expect(found).toEqual([{ rule: 'target-size', impact: 'serious', help: 'x', targets: ['.my-button :: small'] }]);
  });
});
