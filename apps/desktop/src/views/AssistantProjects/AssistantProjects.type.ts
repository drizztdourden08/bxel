/* @layer renderer-app @kind types */
import type { AccessLevel } from '@bxel/project';
import type { GrantRow } from '../../project/project.type';

type AssistantProjectsModel = {
  readonly rows: readonly GrantRow[];
  readonly setAccess: (row: GrantRow, value: string) => void;
};

type GrantRowProps = {
  readonly row: GrantRow;
  readonly onChange: (value: string) => void;
};

type AccessOption = { readonly value: AccessLevel; readonly label: string };

export type { AccessOption, AssistantProjectsModel, GrantRowProps };
