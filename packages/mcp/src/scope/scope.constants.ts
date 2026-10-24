/* @layer core @kind constants */
import type { ScopeSettings, SeeScope, SeeTarget, WriteScope, WriteTarget } from './scope.type';

const SEE_SCOPES = ['everything', 'open_and_projects', 'projects'] as const;
const WRITE_SCOPES = ['where_bxel_can', 'projects_and_ai_folder', 'nowhere'] as const;

const DEFAULT_SCOPE_SETTINGS: ScopeSettings = { see: 'everything', write: 'where_bxel_can' };

const SEE_ALLOWS: Readonly<Record<SeeScope, readonly SeeTarget[]>> = {
  everything: ['open_document', 'recent_file', 'project_file'],
  open_and_projects: ['open_document', 'project_file'],
  projects: ['project_file'],
};

const WRITE_ALLOWS: Readonly<Record<WriteScope, readonly WriteTarget[]>> = {
  where_bxel_can: ['own_file', 'project_file', 'assistant_folder'],
  'projects_and_ai_folder': ['project_file', 'assistant_folder'],
  nowhere: [],
};

export { DEFAULT_SCOPE_SETTINGS, SEE_ALLOWS, SEE_SCOPES, WRITE_ALLOWS, WRITE_SCOPES };
