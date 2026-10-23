/* @layer core @kind logic */
import { updateProject } from '../../draft/update-project';
import type { SpriteId } from '../../model/ids.type';
import { requireSprite } from '../../read/require-sprite';
import { projectUpdateSchema } from '../../schema/project-update-schema';
import { checkName } from '../../validate/check-name';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';

const projectUpdate = defineCommand({
  name: COMMAND_NAME.projectUpdate,
  scope: 'none',
  schema: projectUpdateSchema,
  run: (draft, input) => {
    const { options } = input;
    const name = options.name === undefined ? draft.project.name : checkName(options.name);
    const requested = options.coverSpriteId as SpriteId | null | undefined;
    if (requested) requireSprite(draft.project, requested);
    const coverSpriteId = requested === undefined ? draft.project.coverSpriteId : requested;
    updateProject(draft, (project) => ({ ...project, name, coverSpriteId }));
  },
});

export { projectUpdate };
