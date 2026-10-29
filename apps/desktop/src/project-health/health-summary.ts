/* @layer renderer-app @kind logic */
import { HEALTH_TEXT } from './project-health.constants';
import type { HealthReport } from './project-health.type';

const healthSummary = (report: HealthReport | null): string => {
  if (report === null) return HEALTH_TEXT.scanning;
  return report.total === 0 ? HEALTH_TEXT.allGood : HEALTH_TEXT.summary(report.total, report.files);
};

export { healthSummary };
