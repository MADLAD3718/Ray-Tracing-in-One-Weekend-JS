import { Vec3 } from "./vector.js";

/**
 * Applies gamma conversion to `c`.
 * @param {Vec3} c 
 * @returns {Vec3}
 */
export function gamma(c) {
    return new Vec3(Math.pow(c.x, 1 / 2.2), Math.pow(c.y, 1 / 2.2), Math.pow(c.z, 1 / 2.2));
}

/**
 * Reverses gamma conversion on `c`.
 * @param {Vec3} c 
 * @returns {Vec3}
*/
export function invGamma(c) {
    return new Vec3(Math.pow(c.x, 2.2), Math.pow(c.y, 2.2), Math.pow(c.z, 2.2));
}

/**
 * Converts a flat position to an image position.
 * @param {ImageData} image 
 * @param {Number} i 
 * @returns {Vec3}
 */
export function flatToIPos(image, i) {
    return new Vec3(Math.floor(i / 4) % image.width, Math.floor(i / 4 / image.width));
}

/**
 * Converts an image position to a flat position.
 * @param {ImageData} image 
 * @param {Vec3} ipos 
 * @returns {Number}
 */
export function iPosToFlat(image, ipos) {
    return (ipos.y * image.width + ipos.x) * 4;
}

/**
 * Returns `x` * `x`.
 * @param {Number} x 
 * @returns {Number}
 */
export function square(x) {
    return x * x;
}

/**
 * Converts an angle from degrees to radians.
 * @param {Number} degrees 
 * @returns {Number}
 */
export function radians(degrees) {
    return degrees * Math.PI / 180;
}

/**
 * Converts an angle from radians to degrees.
 * @param {Number} radians 
 * @returns {Number}
 */
export function degrees(radians) {
    return radians * 180 / Math.PI;
}

/**
 * Converts a float (0 to 1) to an 8-bit integer (0 to 255).
 * @param {Number} f 
 * @returns {Number}
 */
export function toUint8(f) {
    return Math.round(f * 255);
}

/**
 * Writes a colour to a given position in an image buffer.
 * @param {ImageData} image 
 * @param {Number} i 
 * @param {Vec3} colour 
 */
export function WriteBuffer(image, i, colour) {
    image.data[i]     = toUint8(colour.x);
    image.data[i + 1] = toUint8(colour.y);
    image.data[i + 2] = toUint8(colour.z);
    image.data[i + 3] = 255;
}