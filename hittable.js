import { Vec3, dot, mul } from "./vector.js";
import { Interval } from "./interval.js";
import { Ray } from "./ray.js";

export class HitInfo {
    hasHit = false;
    position = new Vec3;
    normal = new Vec3;
    hitT = Infinity;
    isFrontFace = true;
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
    /**
     * Returns a `HitInfo` instance describing an intersection with the object.
     * @param {Ray} ray 
     * @param {Interval} interval 
     * @returns {HitInfo}
     */
    intersect(ray, interval) {}
}