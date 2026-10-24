/* @layer renderer-app @kind logic */
import { RULER_SIZES } from './ruler.constants';

const nearHandle = (at: number, handleAt: number | null): boolean => handleAt !== null && Math.abs(at - handleAt) <= RULER_SIZES.handleReach;

export { nearHandle };
