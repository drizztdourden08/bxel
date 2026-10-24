/* @layer core @kind types */
import type { SEE_SCOPES, WRITE_SCOPES } from './scope.constants';

type SeeScope = (typeof SEE_SCOPES)[number];

type WriteScope = (typeof WRITE_SCOPES)[number];

type ScopeSettings = {
  readonly see: SeeScope;
  readonly write: WriteScope;
};

type SeeTarget = 'open_document' | 'recent_file' | 'project_file';

type WriteTarget = 'own_file' | 'project_file' | 'assistant_folder';

type ProjectAccess = 'off' | 'read' | 'edit';

type SessionAccess = 'read' | 'edit';

type MissingSubject = 'document' | 'file' | 'project';

export type { MissingSubject, ProjectAccess, ScopeSettings, SeeScope, SeeTarget, SessionAccess, WriteScope, WriteTarget };
