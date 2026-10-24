/* @layer renderer-app @kind logic */
const indexHash = async (bytes: Uint8Array): Promise<string> => {
  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', bytes.slice()));
  return `sha256:${[...digest].map((byte) => byte.toString(16).padStart(2, '0')).join('')}`;
};

export { indexHash };
