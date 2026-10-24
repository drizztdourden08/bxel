/* @layer core @kind logic */
const placeholderBody = (id: string): string => id.slice(id.indexOf('_') + 1);

export { placeholderBody };
