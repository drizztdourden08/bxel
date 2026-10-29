/* @layer renderer-app @kind logic */
const quoted = (name: string): string => (/\s/.test(name) ? `"${name}"` : name);

export { quoted };
