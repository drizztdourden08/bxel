/* @layer core @kind types */
import type { Project } from '../model/project.type';
import type { DamagedCel, LoadIssue } from './load-report.type';

type BuiltProject = {
  readonly project: Project;
  readonly damage: readonly DamagedCel[];
  readonly issues: readonly LoadIssue[];
};

export type { BuiltProject };
