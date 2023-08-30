import { Vec3, add, cross, mul, norm } from "./vector.js";

export class Basis {
    /**
     * Creates a new orthonormal basis instance.
     * @param {Vec3} w 
     * @returns {Basis}
     */
    constructor(w) {
        this.w = w;
        const a = Math.abs(w.x) > 0.9 ? new Vec3(0, 1, 0) : new Vec3(1, 0, 0);
        this.v = norm(cross(w, a));
        this.u = cross(w, this.v);
    }
    u = new Vec3;
    v = new Vec3;
    w = new Vec3;
    /**
     * Returns a localized `v` within the basis.
     * @param {Vec3} v 
     * @returns {Vec3} 
     */
    localize(v) {
        const a = mul(this.u, v.x);
        const b = mul(this.v, v.y);
        const c = mul(this.w, v.z);
        return add(add(a, b), c);
    }
}