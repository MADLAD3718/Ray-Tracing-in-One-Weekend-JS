export class Interval {
    /**
     * Creates a new `Interval` instance.
     * @param {Number} min 
     * @param {Number} max 
     * @returns {Interval}
     */
    constructor(min, max) {
        this.min = min ?? -Infinity;
        this.max = max ?? Infinity;
    }
    min = -Infinity;
    max = Infinity;
    /**
     * Returns `true` if `x` is within or equal to the interval bounds.
     * @param {Number} x 
     * @returns {Boolean}
     */
    contains(x) {return this.min <= x && x <= this.max;}
    /**
     * Returns `true` if `x` is within the interval bounds.
     * @param {Number} x 
     * @returns {Boolean}
     */
    surrounds(x) {return this.min < x && x < this.max;}
    /**
     * Clamps `x` to the interval bounds.
     * @param {Number} x 
     * @returns {Boolean}
     */
    clamp(x) {
        if (x < this.min) return this.min;
        if (x > this.max) return this.max;
        return x;
    }
    /**
     * Expands the interval by a given `delta`.
     * @param {Number} delta 
     * @returns {Interval}
     */
    expand(delta) {
        const padding = delta / 2;
        return new Interval(this.min - padding, this.max + padding);
    }
}