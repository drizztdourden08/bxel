/* @layer renderer-app @kind logic */
const randomBytes = (length: number): Uint8Array => crypto.getRandomValues(new Uint8Array(length));

export { randomBytes };
