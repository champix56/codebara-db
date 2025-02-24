export interface IDeck {
  frontUrl: string;
  backUrl: string;
  width: number;
  height: number;
  positions: Array<IDeckPosition>;
}
export interface IDeckPosition {
  type:
    | "image"
    | "name"
    | "id"
    | "special"
    | "health"
    | "healthbar"
    | "attack"
    | "attackbar"
    | "special";
  x: number;
  y: number;
  width?: number|undefined;
  height?: number|undefined;
}
