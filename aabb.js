import { Interval } from "./interval.js";
import { HitInfo } from "./hittable.js";
import { Vec3 } from "./vector.js";
import { Ray } from "./ray.js";

export class AABB {
    /**
     * Creates a new `AABB` instance.
     * @param {Vec3} min 
     * @param {Vec3} max 
     * @returns {AABB}
     */
    constructor(min, max) {
        this.x = new Interval(Math.min(min.x, max.x), Math.max(min.x, max.x));
        this.y = new Interval(Math.min(min.y, max.y), Math.max(min.y, max.y));
        this.z = new Interval(Math.min(min.z, max.z), Math.max(min.z, max.z));
    }
    x = new Interval;
    y = new Interval;
    z = new Interval;
    /**
     * Returns the corresponding axis according to `n`.
     * @param {Number} n 
     * @returns {Interval}
     */
    axis(n) {
        if (n == 1) return this.y;
        if (n == 2) return this.z;
        return this.x;
    }
    /**
     * Returns a `HitInfo` instance describing an intersection with the `AABB`.
     * @param {Ray} ray 
     * @param {Interval} interval 
     * @returns {HitInfo}
     */
    intersect(ray, interval) {
        const hit = new HitInfo;
        const origin = [ray.origin.x, ray.origin.y, ray.origin.z];
        const direction = [ray.direction.x, ray.direction.y, ray.direction.z];
        const axis = [this.x, this.y, this.z];
        for (let a = 0; a < 3; ++a) {
            const invD = 1 / direction[a];
            const orig = origin[a];
            const b_min = (axis[a].min - orig) * invD;
            const b_max = (axis[a].max - orig) * invD;
            const t0 = Math.min(b_min, b_max);
            const t1 = Math.max(b_min, b_max);
            const t_min = Math.max(t0, interval.min);
            const t_max = Math.min(t1, interval.max);
            if (t_max <= t_min) return hit;
        }
        hit.hasHit = true;
        return hit;
    }
}

/**
 * Constructs an `AABB` that surrounds both `a` and `b`.
 * @param {AABB} a 
 * @param {AABB} b 
 * @returns {AABB}
 */
export function surroundingBox(a, b) {
    const min = new Vec3(Math.min(a.x.min, b.x.min),
                         Math.min(a.y.min, b.y.min),
                         Math.min(a.z.min, b.z.min));
    const max = new Vec3(Math.max(a.x.max, b.x.max),
                         Math.max(a.y.max, b.y.max),
                         Math.max(a.z.max, b.z.max));
    return new AABB(min, max);
}