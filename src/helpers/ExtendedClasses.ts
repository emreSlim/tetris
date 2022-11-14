export class Random {
  /**
   *
   * @param max integer
   * @param min integer
   * @returns random integer b/w min max (including)
   */
  static int(max: number, min = 0) {
    return Math.floor(Math.random() * (max + 1 - min) + min);
  }
  /**
   *
   * @param arr any type of array
   * @returns random item from given array
   */
  static item<T>(arr: T[]) {
    return arr[Random.int(arr.length - 1)];
  }

  static string(length: number = 15) {
    let str = "";
    for (let i = length; i >= 0; i--) {
      str += String.fromCharCode(Random.int(90, 65));
    }
    return str;
  }

  static boolean() {
    return Math.random() > 0.5;
  }

  static color(min = 0, max = 255) {
    max = NumberE.withLimits(max, 0, 255);
    min = NumberE.withLimits(min, 0, 255);

    return `rgb(${Random.int(max, min)},${Random.int(max, min)},${Random.int(
      max,
      min
    )})`;
  }
  static iterations(cb: CallableFunction, maxCount = 10) {
    const limit = Random.int(maxCount);
    for (let i = 0; i < limit; i++) cb();
  }
}
/**
 * Object extended functionalities
 */
export class ObjectE {
  /**
   * Uses JSON.stringify
   * @param plainObject (shouldn't contain functions)
   * @returns newly cloned object
   */
  static readonly clone = <T>(plainObject: T) =>
    JSON.parse(JSON.stringify(plainObject)) as T;

  /**
   * Uses lodash isEqual
   * @param o1 first object
   * @param o2 second object
   * @returns boolean
   */
  //   static readonly isEqual = (o1: object, o2: object) => _.isEqual(o1, o2);
}

/**
 * Number extended functionalities
 */
export class NumberE {
  static withLimits(val: number, min: number, max: number) {
    if (val < min) return min;
    else if (val > max) return max;
    else return val;
  }

  static roundToPrecision(val: number, precision = 1) {
    const pre = Math.pow(10, precision);
    let _val = pre * val;
    _val = Math.round(_val);
    return _val / pre;
  }
  static cielToPrecision(val: number, precision = 1) {
    const pre = Math.pow(10, precision);
    let _val = pre * val;
    _val = Math.ceil(_val);
    return _val / pre;
  }

  static radToDeg = (x: number) => (x * 180) / Math.PI;
}
