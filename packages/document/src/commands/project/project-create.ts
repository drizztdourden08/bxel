/* @layer core @kind logic */
import type { IdSource } from '../../ids/id-source.type';
import type { DocumentId, ProjectId } from '../../model/ids.type';
import type { DocumentState, Project } from '../../model/project.type';
import { projectCreateSchema } from '../../schema/project-create-schema';
import type { ProjectCreateOptions } from '../../schema/command-options.type';
import { CommandFailure } from '../command-failure';
import { parseOptions } from '../parse-options';
import { buildSprite } from '../sprite/build-sprite';
import { buildBank } from './build-bank';
import type { ProjectCreateResult } from './project-create.type';
import { validateProjectCreate } from './validate-project-create';

const buildDocument = (options: ProjectCreateOptions, ids: IdSource): DocumentState => {
  const projectId = ids.next('prj') as ProjectId;
  const bank = buildBank(ids, options.bank);
  const first = options.sprite;
  const sprites = first
    ? [buildSprite({ ids, name: first.name.trim(), width: first.width, height: first.height, bankId: bank.id, pivot: null })]
    : [];
  const project: Project = {
    id: projectId,
    name: options.name.trim(),
    defaultBankId: bank.id,
    coverSpriteId: null,
    banks: [bank],
    sprites,
    sheets: [],
    presets: [],
    tilesets: [],
    tilemaps: [],
  };
  return { documentId: ids.next('doc') as DocumentId, revision: 1, project, readOnly: false };
};

const projectCreate = ({ options, ids }: { options: unknown; ids: IdSource }): ProjectCreateResult => {
  try {
    const parsed = parseOptions(projectCreateSchema, options, 'options');
    validateProjectCreate(parsed);
    return { ok: true, state: buildDocument(parsed, ids) };
  } catch (error) {
    if (error instanceof CommandFailure) return { ok: false, error: error.error };
    throw error;
  }
};

export { projectCreate };
