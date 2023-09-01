import { Hittable_List } from "./hittable_list.js";
import { HitInfo, Hittable } from "./hittable.js";
import { surroundingBox } from "./aabb.js";

export class BVH_Node extends Hittable {
    /**
     * Creates a new `BVH_Node` instance.
     * @param {Hittable_List} src_objects 
     * @param {Number} start 
     * @param {Number} end 
     * @returns {BVH_Node}
     */
    constructor(src_objects, start, end) {
        super();
        const object_span = end - start + 1;
        
        if (object_span == 1) {
            this.left = src_objects.hittables[start];
            this.right = src_objects.hittables[start];
        } else if (object_span == 2) {
            if (this.comparison(src_objects.hittables[start], src_objects.hittables[start + 1]) < 0) {
                this.left = src_objects.hittables[start];
                this.right = src_objects.hittables[start + 1];
            } else {
                this.left = src_objects.hittables[start + 1];
                this.right = src_objects.hittables[start];
            }
        } else {
            const mid = start + Math.floor(object_span / 2);
            this.left = new BVH_Node(src_objects, start, mid);
            this.right = new BVH_Node(src_objects, mid + 1, end);
        }
        this.bounding_box = surroundingBox(this.left.bounding_box, this.right.bounding_box);
    }
    left = new Hittable;
    right = new Hittable;
    /**
     * @param {Hittable} a 
     * @param {Hittable} b 
     */
    comparison(a, b) {
        if (a.bounding_box.x.min < b.bounding_box.x.min) return -1;
        if (a.bounding_box.x.min == b.bounding_box.x.min) return 0;
        return 1;
    }
    /**
     * Returns a `HitInfo` instance describing an intersection with the object.
     * @param {Ray} ray 
     * @param {Interval} interval 
     * @returns {HitInfo}
     */
    intersect(ray, interval) {
        const hit = new HitInfo;
        if (!this.bounding_box.intersect(ray, interval).hasHit) return hit;
        const hit_left = this.left.intersect(ray, interval);
        const hit_right = this.right.intersect(ray, interval);
        if (hit_left.hasHit || hit_right.hasHit) {
            const left_lower = hit_left.hitT < hit_right.hitT;
            return left_lower ? hit_left : hit_right;
        }
        return hit;
    }
}