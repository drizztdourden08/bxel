/* @layer renderer-app @kind types */
import type { Failure } from '@bxel/mcp';
import type { OrganiseOp } from '../../organise/organise.type';
import type { OrganiseInput } from './project-files-input.type';

type Builder = (request: OrganiseInput, assets: readonly string[]) => OrganiseOp | Failure;

export type { Builder };
