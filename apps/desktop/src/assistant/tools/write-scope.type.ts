/* @layer renderer-app @kind types */
import type { OpenProject } from '../../project/project.type';
import type { Entry } from './project-files-input.type';

type WriteScope = { readonly visible: OpenProject; readonly entries: readonly Entry[] };

export type { WriteScope };
