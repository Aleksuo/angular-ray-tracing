export const degreesToRadians = (degrees: number): number =>
  (degrees * Math.PI) / 180;

export const randomRange = (min: number, max: number): number =>
  Math.random() * (max - min) + min;
