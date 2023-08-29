import { HitInfo, Hittable } from "./hittable.js";
import { Interval } from "./interval.js";
import { Ray } from "./ray.js";

export class Hittable_List extends Hittable {
    /**
     * @type {Hittable[]}
     * @readonly
     */
    hittables = new Array;
    /**
     * Traces a ray through the list of hittables.
     * @param {Ray} ray 
     * @param {Interval} interval 
     * @returns {HitInfo}
     */
    intersect = (ray, interval) => {
        let closest_hit = new HitInfo;
        for (const hittable of this.hittables) {
            const hit = hittable.intersect(ray, interval);
            if (hit.hasHit) {
                closest_hit = hit;
                interval.max = hit.hitT;
            }
        }
        return closest_hit;
    }
}