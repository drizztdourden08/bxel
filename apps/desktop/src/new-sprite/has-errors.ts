/* @layer renderer-app @kind logic */
const hasErrors = (errors: object): boolean => Object.values(errors).some((message) => message !== null);

export { hasErrors };
