import { Vec3, add, div, dot, lerp, sub } from "./vector.js";
import { HitInfo, Hittable } from "./hittable.js";
import { Material } from "./material.js";
import { Interval } from "./interval.js";
import { AABB } from "./aabb.js";
import { Ray } from "./ray.js";

export class Sphere extends Hittable {
    /**
     * Creates a new `Sphere` instance.
     * @param {Vec3} center0 
     * @param {Vec3} [center1] 
     * @param {Number} radius 
     * @param {Material} material 
     * @returns {Sphere}
     */
    constructor(center0, center1, radius, material) {
        super();
        this.center0 = center0;
        if (center1 != undefined) {
            this.isMoving = true;
            this.center1 = center1;
        }
        this.radius = radius;
        this.material = material;
        const rvec = new Vec3(radius, radius, radius);
        this.bounding_box = new AABB(sub(this.center0, rvec), add(this.center0, rvec));
    }
    center0 = new Vec3;
    /** @type {Vec3 | undefined} */
    center1;
    isMoving = false;
    radius = 0;
    /** @type {Material} */
    material;
    /**
     * Returns the center of the sphere based on the input time.
     * @param {Number} time 
     * @returns {Vec3}
     */
    center(time) { return lerp(this.center0, this.center1, time); }
    /**
     * Returns the uv coordinates on the sphere depending on a position.
     * @param {Vec3} p 
     * @returns {Vec3}
     */
    getSphereUV(p) {
        const theta = Math.acos(p.y);
        const phi = Math.atan2(-p.z, p.x) + Math.PI;
        return new Vec3(phi / (2 * Math.PI), theta / Math.PI);
    }
    /**
     * Returns a `HitInfo` instance describing an intersection with the sphere.
     * @param {Ray} ray 
     * @param {Interval} interval 
     * @returns {HitInfo}
     */
    intersect(ray, interval) {
        const hit = new HitInfo;
        const center = this.isMoving ? this.center(ray.time) : this.center0;
        const oc = sub(ray.origin, center);
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
                hit.normal = div(sub(hit.position, center), this.radius);
                hit.setFaceNormal(ray.direction);
                hit.material = this.material;
                hit.uv = this.getSphereUV(hit.normal);
            }
        }
        return hit;
    }
}