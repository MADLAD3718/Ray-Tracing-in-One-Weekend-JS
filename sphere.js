import { Vec3, div, dot, sub } from "./vector.js";
import { HitInfo, Hittable } from "./hittable.js";
import { Material } from "./material.js";
import { Interval } from "./interval.js";
import { Ray } from "./ray.js";

export class Sphere extends Hittable {
    /**
     * Creates a new `Sphere` instance.
     * @param {Vec3} center 
     * @param {Number} radius 
     * @param {Material} material 
     * @returns {Sphere}
     */
    constructor(center, radius, material) {
        super();
        this.center = center;
        this.radius = radius;
        this.material = material;
    }
    center = new Vec3;
    radius = 0;
    /** @type {Material} */
    material;
    /**
     * Returns a `HitInfo` instance describing an intersection with the sphere.
     * @param {Ray} ray 
     * @param {Interval} interval 
     * @returns {HitInfo}
     */
    intersect(ray, interval) {
        const hit = new HitInfo;
        const oc = sub(ray.origin, this.center);
        const h = dot(ray.direction, oc);
        const c = dot(oc, oc) - this.radius * this.radius;
        const discriminant = h * h - c;
        if (discriminant >= 0) {
            const sqrt = Math.sqrt(discriminant)
            const t1 = -h - sqrt;
            const t2 = -h + sqrt;
            hit.hasHit = interval.surrounds(t1) || interval.surrounds(t2);
            if (hit.hasHit) {
                hit.hitT = t1 < t2 ? interval.surrounds(t1) ? t1 : t2 : t2;
                hit.position = ray.at(hit.hitT);
                hit.normal = div(sub(hit.position, this.center), this.radius);
                hit.setFaceNormal(ray.direction);
                hit.material = this.material;
            }
        }
        return hit;
    }
}