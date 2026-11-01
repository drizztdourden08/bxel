/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { blockingFindings } from '../e2e/support/blocking-findings';

describe('K1 which axe findings fail the accessibility test', { tags: ['critical'] }, () => {
  it('keeps serious and critical findings and drops the rest', () => {
    const found = blockingFindings([
      { rule: 'label', impact: 'critical', help: 'x', targets: ['button.save :: no name'] },
      { rule: 'region', impact: 'moderate', help: 'x', targets: ['div'] },
    ]);
    expect(found.map((finding) => finding.rule)).toEqual(['label']);
  });
});
