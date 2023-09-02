import { Vec3, add, mul } from "./vector.js";

export class Ray {
    /**
     * Creates a new `Ray` instance.
     * @param {Vec3} origin 
     * @param {Vec3} direction 
     * @param {number} [time=0] 
     * @returns {Ray}
     */
    constructor(origin, direction, time = 0) {
        this.origin = origin;
        this.direction = direction;
        this.time = time;
    }
    origin = new Vec3;
    direction = new Vec3;
    time = 0;
    /**
     * Returns the position of the ray at extent `t`.
     * @param {Number} t 
     * @returns {Vec3}
     */
    at(t) {
        return add(this.origin, mul(this.direction, t));
    }
}