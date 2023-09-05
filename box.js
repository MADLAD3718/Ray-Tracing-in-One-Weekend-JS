import { Hittable_List } from "./hittable_list.js";
import { Material } from "./material.js";
import { Vec3, mul } from "./vector.js";
import { Quad } from "./quad.js";

/**
 * Creates a box out of 6 sides.
 * @param {Vec3} a 
 * @param {Vec3} b 
 * @param {Material} material 
 * @returns {Hittable_List}
 */
export function box(a, b, material) {
    const sides = new Hittable_List;

    const min = new Vec3(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.min(a.z, b.z));
    const max = new Vec3(Math.max(a.x, b.x), Math.max(a.y, b.y), Math.max(a.z, b.z));

    const dx = new Vec3(max.x - min.x, 0, 0);
    const dy = new Vec3(0, max.y - min.y, 0);
    const dz = new Vec3(0, 0, max.z - min.z);

    sides.add(new Quad(new Vec3(min.x, min.y, max.z), dx, dy, material));           // front
    sides.add(new Quad(new Vec3(max.x, min.y, max.z), mul(dz, -1), dy, material));  // right
    sides.add(new Quad(new Vec3(max.x, min.y, min.z), mul(dx, -1), dy, material));  // back
    sides.add(new Quad(new Vec3(min.x, min.y, min.z), dz, dy, material));           // left
    sides.add(new Quad(new Vec3(min.x, max.y, max.z), dx, mul(dz, -1), material));  // top
    sides.add(new Quad(new Vec3(min.x, min.y, min.z), dx, dz, material));           // bottom

    return sides;
}