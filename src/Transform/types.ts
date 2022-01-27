type Branded<T, U extends string> = T & { [key in U]: never };

export type Position = { x: number; y: number };

/**
 * @package
 */
export type LocalPosition = Branded<Position, "localPosition">;
/**
 * @package
 */
export type WorldPosition = Branded<Position, "worldPosition">;
/**
 * @package
 */
export type LotationLimit = readonly [min: LocalRotation, max: LocalRotation];
/**
 * @package
 */
export type LocalRotation = Branded<number, "localRotation">;
/**
 * @package
 */
export type WorldRotation = Branded<number, "worldRotation">;
