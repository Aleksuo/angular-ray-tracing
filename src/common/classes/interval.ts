export class Interval {
  min: number;

  max: number;

  static EMPTY = new Interval(
    Number.POSITIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
  );

  static UNIVERSE = new Interval();

  constructor(min?: number, max?: number) {
    this.min = min ?? Number.NEGATIVE_INFINITY;
    this.max = max ?? Number.POSITIVE_INFINITY;
  }

  contains(num: number): boolean {
    return this.min <= num && num <= this.max;
  }

  surrounds(num: number): boolean {
    return this.min < num && num < this.max;
  }
}
