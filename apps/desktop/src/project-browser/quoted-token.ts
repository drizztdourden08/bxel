/* @layer renderer-app @kind logic */
const quotedToken = (text: string): string => (/\s/.test(text) ? `"${text}"` : text);

export { quotedToken };
