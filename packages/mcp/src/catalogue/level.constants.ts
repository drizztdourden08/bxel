/* @layer core @kind constants */
const LEVELS = ['disabled', 'read', 'edit'] as const;

const LEVEL_RANK = { disabled: 0, read: 1, edit: 2 } as const satisfies Record<(typeof LEVELS)[number], number>;

const LEVEL_LABEL = { disabled: 'Disabled', read: 'Read', edit: 'Edit' } as const satisfies Record<(typeof LEVELS)[number], string>;

export { LEVEL_LABEL, LEVEL_RANK, LEVELS };
