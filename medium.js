import { HitInfo, Hittable } from "./hittable.js";
import { Isotropic } from "./material.js";
import { Interval } from "./interval.js";
import { Vec3 } from "./vector.js";
import { Ray } from "./ray.js";

export class Constant_Medium extends Hittable {
    /**
     * Creates a new `Constant_Medium` instance.
     * @param {Hittable} bound 
     * @param {Number} density 
     * @param {Vec3} colour 
     * @returns {Constant_Medium}
     */
    constructor(bound, density, colour) {
        super();
        this.bounding_box = bound.bounding_box;
        this.boundary = bound;
        this.neg_inv_density = -1 / density;
        this.phase_function = new Isotropic(colour);
    }
    boundary;
    neg_inv_density;
    phase_function;
    /**
     * Returns a `HitInfo` instance describing an intersection with the constant medium.
     * @param {Ray} ray 
     * @param {Interval} interval 
     * @returns {HitInfo}
     */
    intersect(ray, interval) {
        const entrance_hit = this.boundary.intersect(ray, new Interval(-Infinity, Infinity));
        if (!entrance_hit.hasHit) return entrance_hit;

        const exit_hit = this.boundary.intersect(ray, new Interval(entrance_hit.hitT + 1e-6, Infinity));
        if (!exit_hit.hasHit) return exit_hit;

        if (entrance_hit.hitT < interval.min) entrance_hit.hitT = interval.min;
        if (exit_hit.hitT > interval.max) exit_hit.hitT = interval.max;
        if (entrance_hit.hitT >= exit_hit.hitT) return new HitInfo;
        if (entrance_hit.hitT < 0) entrance_hit.hitT = 0;

        const bound_dist = exit_hit.hitT - entrance_hit.hitT;
        const hit_dist = this.neg_inv_density * Math.log(Math.random());
        if (hit_dist > bound_dist) return new HitInfo;
        
        entrance_hit.hitT += hit_dist;
        entrance_hit.position = ray.at(entrance_hit.hitT);
        entrance_hit.normal = new Vec3(1, 0, 0);
        entrance_hit.isFrontFace = true;
        entrance_hit.material = this.phase_function;
        return entrance_hit;
    }
}