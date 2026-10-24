/* @layer core @kind logic */
import { idBody } from './id-body';
import { ID_PREFIX } from './id.constants';
import type { ByteProvider, ProjectId } from './id.type';

const createProjectId = (bytes: ByteProvider): ProjectId => `${ID_PREFIX.project}_${idBody(bytes)}`;

export { createProjectId };
