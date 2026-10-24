/* @layer core @kind logic */
import { NEIGHBOUR } from './terrain.constants';

const corner = (mask: number, edges: number, bit: number): number => ((mask & edges) === edges ? mask & bit : 0);

const reduceMask = (mask: number): number =>
  (mask & (NEIGHBOUR.N | NEIGHBOUR.E | NEIGHBOUR.S | NEIGHBOUR.W)) |
  corner(mask, NEIGHBOUR.N | NEIGHBOUR.E | NEIGHBOUR.NE, NEIGHBOUR.NE) |
  corner(mask, NEIGHBOUR.E | NEIGHBOUR.S | NEIGHBOUR.SE, NEIGHBOUR.SE) |
  corner(mask, NEIGHBOUR.S | NEIGHBOUR.W | NEIGHBOUR.SW, NEIGHBOUR.SW) |
  corner(mask, NEIGHBOUR.W | NEIGHBOUR.N | NEIGHBOUR.NW, NEIGHBOUR.NW);

export { reduceMask };
