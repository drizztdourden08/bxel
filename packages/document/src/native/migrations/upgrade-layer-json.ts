/* @layer core @kind logic */
const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);

const upgradeLayerJson = (value: unknown): unknown => {
  if (!isRecord(value) || 'lock' in value || !('locked' in value)) return value;
  const { locked, lockTransparency, ...rest } = value;
  return { ...rest, lock: { pixels: locked === true, transparency: lockTransparency === true, position: false } };
};

export { upgradeLayerJson };
