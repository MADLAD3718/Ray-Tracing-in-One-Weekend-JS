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
    contains(x) {return this.min <= x && x <= this.max;}
    surrounds(x) {return this.min < x && x < this.max;}
    clamp(x) {
        if (x < this.min) return this.min;
        if (x > this.max) return this.max;
        return x;
    }
}