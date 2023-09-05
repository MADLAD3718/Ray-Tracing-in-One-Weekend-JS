import { Vec3, add, dot, mul, rotateY, sub } from "./vector.js";
import { Material } from "./material.js";
import { Interval } from "./interval.js";
import { radians } from "./util.js";
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

export class Translate extends Hittable {
    /**
     * Translates a hittable instance.
     * @param {Hittable} object 
     * @param {Vec3} displacement 
     * @returns {Translate}
     */
    constructor(object, displacement) {
        super();
        this.object = object;
        this.offset = displacement;
        this.bounding_box = object.bounding_box;
        this.bounding_box.offset(displacement);
    }
    object;
    offset;
    /**
     * Returns a `HitInfo` instance describing an intersection with the object.
     * @param {Ray} ray 
     * @param {Interval} interval 
     * @returns {HitInfo}
     */
    intersect(ray, interval) {
        const offset_ray = new Ray(sub(ray.origin, this.offset), ray.direction, ray.time);
        const hit = this.object.intersect(offset_ray, interval);
        if (!hit.hasHit) return hit;
        hit.position = add(hit.position, this.offset);
        return hit;
    }
}

export class Rotate_Y extends Hittable {
    /**
     * Rotates a hittable instance by an angle about the Y axis.
     * @param {Hittable} object 
     * @param {Number} angle 
     */
    constructor(object, angle) {
        super();
        const theta = radians(angle);
        this.object = object;
        this.sint = Math.sin(theta);
        this.cost = Math.cos(theta);
        this.bounding_box = object.bounding_box;

        const min = new Vec3(Infinity, Infinity, Infinity);
        const max = new Vec3(-Infinity, -Infinity, -Infinity);

        for (let i = 0; i < 2; ++i)
            for (let j = 0; j < 2; ++j)
                for (let k = 0; k < 2; ++k) {
                    const x = i * this.bounding_box.x.max + (1 - i) * this.bounding_box.x.min;
                    const y = j * this.bounding_box.y.max + (1 - j) * this.bounding_box.y.min;
                    const z = k * this.bounding_box.z.max + (1 - k) * this.bounding_box.z.min;
                    
                    const tester = rotateY(new Vec3(x, y, z), this.sint, this.cost);
                    min.x = Math.min(min.x, tester.x);
                    min.y = Math.min(min.y, tester.y);
                    min.z = Math.min(min.z, tester.z);
                    max.x = Math.max(max.x, tester.x);
                    max.y = Math.max(max.y, tester.y);
                    max.z = Math.max(max.z, tester.z);
                }
        this.bounding_box = new AABB(min, max);
    }
    object;
    sint;
    cost;
    /**
     * Returns a `HitInfo` instance describing an intersection with the object.
     * @param {Ray} ray 
     * @param {Interval} interval 
     * @returns {HitInfo}
     */
    intersect(ray, interval) {
        const origin = rotateY(ray.origin, -this.sint, this.cost);
        const direction = rotateY(ray.direction, -this.sint, this.cost);
        const rotated_ray = new Ray(origin, direction, ray.time);

        const hit = this.object.intersect(rotated_ray, interval);
        if (!hit.hasHit) return hit;

        hit.position = rotateY(hit.position, this.sint, this.cost);
        hit.normal = rotateY(hit.normal, this.sint, this.cost);
        return hit;
    }
}