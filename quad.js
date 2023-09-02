import { Vec3, add, cross, det, norm, sub } from "./vector.js";
import { HitInfo, Hittable } from "./hittable.js";
import { Material } from "./material.js";
import { Interval } from "./interval.js";
import { Ray } from "./ray.js";
import { AABB } from "./aabb.js";

export class Quad extends Hittable {
    /**
     * Creates a new `Quad` instance.
     * @param {Vec3} origin 
     * @param {Vec3} u
     * @param {Vec3} v
     * @param {Material} material
     * @returns {Quad}
     */
    constructor(origin, u, v, material) {
        super();
        this.origin = origin;
        this.u = u;
        this.v = v;
        this.material = material;
        const box = new AABB(origin, add(origin, add(u, v)));
        box.expand(1e-4);
        this.bounding_box = box;
    }
    origin;
    u;
    v;
    material;
    /**
     * Returns a `HitInfo` instance describing an intersection with the quad.
     * @param {Ray} ray 
     * @param {Interval} interval 
     * @returns {HitInfo}
     */
    intersect(ray, interval) {
        const hit = new HitInfo;
        // Using Cramer's Rule to determine alpha, beta and t for ray/quad intersection.
        const oq = sub(ray.origin, this.origin);
        const invDet = 1 / -det(this.u, this.v, ray.direction);
        const alpha = -det(oq, this.v, ray.direction) * invDet;
        const beta = -det(this.u, oq, ray.direction) * invDet;
        const t = det(this.u, this.v, oq) * invDet;
        const interval01 = new Interval(0, 1);
        if (interval.contains(t) && interval01.contains(alpha) && interval01.contains(beta)) {
            hit.hasHit = true;
            hit.hitT = t;
            hit.position = ray.at(t);
            hit.normal = norm(cross(this.u, this.v));
            hit.setFaceNormal(ray.direction);
            hit.material = this.material;
            hit.uv = new Vec3(alpha, beta, 0);
        }
        return hit;
    }
}