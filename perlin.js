import { Vec3, dot, mul, randSphere } from "./vector.js";

export class Perlin {
    constructor() {
        this.randVec = new Array(this.point_count);
        for (let i = 0; i < this.point_count; ++i)
            this.randVec[i] = randSphere();
        this.perm_x = this.perlin_generate_perm();
        this.perm_y = this.perlin_generate_perm();
        this.perm_z = this.perlin_generate_perm();
    }
    point_count = 256;
    perm_x;
    perm_y;
    perm_z;
    randVec;
    /**
     * Returns a perlin noise value depending on the input point.
     * @param {Vec3} p 
     * @returns {Number}
     */
    noise(p) {
        const u = p.x - Math.floor(p.x);
        const v = p.y - Math.floor(p.y);
        const w = p.z - Math.floor(p.z);
        const i = Math.floor(p.x);
        const j = Math.floor(p.y);
        const k = Math.floor(p.z);
        /** @type {Vec3[][][]} */
        const c = [[[],[]],[[],[]]];
        for (let di = 0; di < 2; di++) 
            for (let dj = 0; dj < 2; dj++) 
                for (let dk = 0; dk < 2; dk++) 
                    c[di][dj][dk] = this.randVec[
                        this.perm_x[(i + di) & 255] ^
                        this.perm_y[(j + dj) & 255] ^
                        this.perm_z[(k + dk) & 255]
                    ];
        return this.perlin_interp(c, u, v, w);
    }
    turb(p, depth = 7) {
        let accum = 0, temp_p = p, weight = 1;
        for (let i = 0; i < depth; i++) {
            accum += weight * this.noise(temp_p);
            weight *= 0.5;
            temp_p = mul(temp_p, 2);
        }
        return Math.abs(accum);
    }
    /**
     * Applies perlin interpolation.
     * @param {Vec3[][][]} c 
     * @param {Number} u 
     * @param {Number} v 
     * @param {Number} w 
     */
    perlin_interp(c, u, v, w) {
        const uu = u * u * (3 - 2 * u);
        const vv = v * v * (3 - 2 * v);
        const ww = w * w * (3 - 2 * w);
        let accum = 0;
        for (let i = 0; i < 2; i++)
            for (let j = 0; j < 2; j++)
                for (let k = 0; k < 2; k++) {
                    const weight_v = new Vec3(u - i, v - j, w - k);
                    accum += (i * uu + (1 - i) * (1 - uu))
                           * (j * vv + (1 - j) * (1 - vv))
                           * (k * ww + (1 - k) * (1 - ww))
                           * dot(c[i][j][k], weight_v);
                }
        return accum;
    }
    perlin_generate_perm() {
        const p = new Array(this.point_count);
        for (let i = 0; i < this.point_count; i++) p[i] = i;
        this.permute(p);
        return p;
    }
    /**
     * Randomly shuffles an array.
     * @param {Number[]} p
     */
    permute(p) {
        for (let i = p.length - 1; i > 0; i--) {
            const target = Math.floor(Math.random() * i);
            const tmp = p[i];
            p[i] = p[target];
            p[target] = tmp;
        }
    }
}