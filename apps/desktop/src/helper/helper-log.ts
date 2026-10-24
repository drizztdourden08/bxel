/* @layer helper @kind logic */
const helperLog = (line: string): void => {
  process.stderr.write(`[bxel-mcp] ${new Date().toISOString()} ${line}\n`);
};

export { helperLog };
