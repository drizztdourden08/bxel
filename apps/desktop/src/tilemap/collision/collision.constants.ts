/* @layer renderer-app @kind constants */
const COLLISION_RECT_FIELDS = [
  { id: 'x', label: 'X' },
  { id: 'y', label: 'Y' },
  { id: 'width', label: 'Width' },
  { id: 'height', label: 'Height' },
] as const;

const POINT_PAIR = /^(\d+)\s*,\s*(\d+)$/;

export { COLLISION_RECT_FIELDS, POINT_PAIR };
