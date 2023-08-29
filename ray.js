import { Vec3, mul } from "./vector.js";

export class Ray {
    /**
     * Creates a new `Ray` instance.
     * @param {Vec3} origin 
     * @param {Vec3} direction 
     */
    constructor(origin, direction) {
        this.origin = origin;
        this.direction = direction;
    }
    origin = new Vec3;
    direction = new Vec3;
    at = (t) => {return add(this.origin, mul(this.direction, t))}
}