export class Vec3 {
    /**
     * Creates a new `Vec3` instance.
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     * @returns {Vec3}
     */
    constructor(x, y, z) {
        this.x = x ?? 0;
        this.y = y ?? 0;
        this.z = z ?? 0;
    }
    x;
    y;
    z;
}

/**
 * Returns `u` + `v`.
 * @param {Vec3} u 
 * @param {Vec3} v 
 * @returns {Vec3}
 */
export function add(u, v) {
    return new Vec3(u.x + v.x, u.y + v.y, u.z + v.z);
}

/**
 * Returns `u` - `v`.
 * @param {Vec3} u 
 * @param {Vec3} v 
 * @returns {Vec3}
 */
export function sub(u, v) {
    return new Vec3(u.x - v.x, u.y - v.y, u.z - v.z);
}

/**
 * Returns the component-wise multiplication of `u` and `v`.
 * @param {Vec3} u 
 * @param {Vec3 | Number} v 
 * @returns {Vec3}
 */
export function mul(u, v) {
    if (typeof v == "number")
        return new Vec3(u.x * v, u.y * v, u.z * v);
    return new Vec3(u.x * v.x, u.y * v.y, u.z * v.z);
}

/**
 * Returns the component-wise division of `u` and `v`.
 * @param {Vec3} u 
 * @param {Vec3 | Number} v 
 * @returns {Vec3}
 */
export function div(u, v) {
    if (typeof v == "number")
        return new Vec3(u.x / v, u.y / v, u.z / v);
    return new Vec3(u.x / v.x, u.y / v.y, u.z / v.z);
}

/**
 * Returns the dot product of `u` and `v`.
 * @param {Vec3} u 
 * @param {Vec3} v 
 * @returns {Number}
 */
export function dot(u, v) {
    return u.x * v.x + u.y * v.y + u.z * v.z;
}

/**
 * Returns the cross product of `u` and `v`.
 * @param {Vec3} u 
 * @param {Vec3} v 
 * @returns {Vec3}
 */
export function cross(u, v) {
    return new Vec3(u.y * v.z - u.z * v.y,
                    u.z * v.x - u.x * v.z,
                    u.x * v.y - u.y * v.x);
}

/**
 * Returns the length of `u`.
 * @param {Vec3} u 
 * @returns {Number}
 */
export function length(u) {
    return Math.sqrt(dot(u, u));
}

/**
 * Returns a normalized `u`.
 * @param {Vec3} u 
 * @returns {Vec3}
 */
export function norm(u) {
    return div(u, length(u));
}

/**
 * Returns the distance between `u` and `v`.
 * @param {Vec3} u 
 * @param {Vec3} v 
 * @returns {Number}
 */
export function dist(u, v) {
    return length(sub(u, v));
}

/**
 * Lerps between two vectors `u` and `v` based on `s`.
 * @param {Vec3} u 
 * @param {Vec3} v 
 * @param {Number} s 
 * @return {Vec3}
 */
export function lerp(u, v, s) {
    return add(mul(u, 1 - s), mul(v, s));
}

/**
 * Reflects an incident direction off of a normal.
 * @param {Vec3} i 
 * @param {Vec3} n 
 * @returns {Vec3}
 */
export function reflect(i, n) {
    return sub(i, mul(n, 2 * dot(i, n)));
}

/**
 * Refracts an incident direction through a surface based on each medium's refractive indices.
 * @param {Vec3} i 
 * @param {Vec3} n 
 * @param {Number} n1 
 * @param {Number} n2 
 * @returns {Vec3}
 */
export function refract(i, n, n1, n2) {
    const eta = n1 / n2;
    const cosi = -dot(i, n);
    const sin2t = eta * eta * (1 - cosi * cosi);
    const cost = Math.sqrt(1 - sin2t);
    return add(mul(i, eta), mul(n, eta * cosi - cost));
}

/**
 * Generates a uniform randomly sampled direction on a hemisphere.
 * @returns {Vec3}
 */
export function randHemisphere() {
    const u = Math.random();
    const phi = 2 * Math.PI * Math.random();
    const sint = Math.sqrt(u * (2 - u));
    const x = Math.cos(phi) * sint;
    const y = Math.sin(phi) * sint;
    const z = 1 - u;
    return new Vec3(x, y, z);
}

/**
 * Generates a randomly sampled direction on a cosine-weighted hemisphere.
 * @returns {Vec3}
 */
export function randCosHemisphere() {
    const u = Math.random();
    const phi = 2 * Math.PI * Math.random();
    const sint = Math.sqrt(u);
    const x = Math.cos(phi) * sint;
    const y = Math.sin(phi) * sint;
    const z = Math.sqrt(1 - u);
    return new Vec3(x, y, z);
}

/**
 * Returns a normalized vector in the direction of a randomly
 * sampled disk position, projected onto the unit sphere.
 * @param {Number} r The radius of the disk, ranging from 0 to 1.
 * @returns {Vec3}
 */
export function normRandDisk(r) {
    // Setting r = 1 leads to a perfect match with the cosine-weighted
    // hemisphere distribution, which I feel like is one of the craziest
    // math discoveries I've personally come accross. It also acts as a 
    // proof that a cosine-weighted hemisphere distribution can be achieved
    // through projecting the unit disk onto the unit sphere distribution.
    const u = Math.random();
    const phi = 2 * Math.PI * Math.random();
    const sint = r * Math.sqrt(u);
    const x = Math.cos(phi) * sint;
    const y = Math.sin(phi) * sint;
    const z = Math.sqrt(1 - r * r * u);
    return new Vec3(x, y, z);
}

/**
 * Generates a randomly sampled direction on a uniformly weighted sphere.
 * @returns {Vec3}
 */
export function randSphere() {
    const u = Math.random();
    const phi = 2 * Math.PI * Math.random();
    const sint = 2 * Math.sqrt(u * (1 - u));
    const x = Math.cos(phi) * sint;
    const y = Math.sin(phi) * sint;
    const z = 1 - 2 * u;
    return new Vec3(x, y, z);
}