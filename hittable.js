import { Vec3, dot, mul } from "./vector.js";
import { Material } from "./material.js";
import { Interval } from "./interval.js";
import { AABB } from "./aabb.js";
import { Ray } from "./ray.js";

export class HitInfo {
    hasHit = false;
    position;
    normal;
    hitT = Infinity;
    /** @type {Material} */
    material;
    /** @type {Vec3} */
    uv;
    isFrontFace;
    /**
     * Sets the hit normal depending on front or back face intersection.
     * @param {Vec3} direction 
     */
    setFaceNormal = (direction) => {
        this.isFrontFace = dot(direction, this.normal) <= 0;
        if (!this.isFrontFace) this.normal = mul(this.normal, -1);
    }
}

export class Hittable {
    /** @type {AABB} */
    bounding_box;
    /**
     * Returns a `HitInfo` instance describing an intersection with the object.
     * @param {Ray} ray 
     * @param {Interval} interval 
     * @returns {HitInfo}
     */
    intersect(ray, interval) {}
}