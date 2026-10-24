/* @layer renderer-app @kind logic */
import { bankPlan } from '../palette-source/bank-plan';
import { buildReport } from '../platform-preset/build-report';
import type { PlatformReport } from '../platform-preset/platform-preset.type';
import { presetById } from '../platform-preset/preset-by-id';
import type { CreationForm } from './new-sprite.type';
import { spriteSize } from './sprite-size';

const unique = (report: PlatformReport): PlatformReport => ({
  ...report,
  findings: report.findings.filter((finding, at) => report.findings.findIndex((other) => other.text === finding.text) === at),
});

const formReport = (form: CreationForm): PlatformReport | null => {
  const preset = presetById(form.platformId);
  if (!preset) return null;
  const { bank } = bankPlan(form.source, form.limit, form.transparent);
  const count = Number.isInteger(form.banks) ? Math.max(form.banks, 1) : 1;
  const facts = {
    banks: Array.from({ length: count }, (_unused, at) => ({
      id: `new${at}`,
      name: bank.name,
      cap: bank.cap,
      transparent: bank.transparent,
      colours: bank.colors.map((color) => color.rgb),
    })),
    sprites: [spriteSize(form)],
  };
  return unique(buildReport(preset, facts));
};

export { formReport };
