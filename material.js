import { Vec3, normRandDisk, randCosHemisphere, reflect } from "./vector.js";
import { HitInfo } from "./hittable.js";
import { Basis } from "./basis.js";
import { Ray } from "./ray.js";

export class Material {
    /**
     * Scatters an incident ray off of the material, returning the scattered ray.
     * @param {Ray} ray 
     * @param {HitInfo} hit 
     * @returns {Ray}
     */
    scatter(ray, hit) {}
    /**
     * Returns the attenuation of the material.
     * @returns {Vec3}
     */
    attenuation() {}
}

export class Lambertian extends Material {
    /**
     * Creates a new `Lambertian` material instance.
     * @param {Vec3} albedo 
     * @returns {Lambertian}
     */
    constructor(albedo) {
        super();
        this.albedo = albedo;
    }
    albedo = new Vec3;
    /**
     * Scatters an incident ray off of the material, returning the scattered ray.
     * @param {Ray} ray 
     * @param {HitInfo} hit 
     * @returns {Ray}
     */
    scatter(ray, hit) {
        const tbn = new Basis(hit.normal);
        const direction = tbn.localize(randCosHemisphere());
        return new Ray(hit.position, direction);
    }
    /**
     * Returns the attenuation of the material.
     * @returns {Vec3}
     */
    attenuation() {return this.albedo;}
}

export class Metal extends Material {
    /**
     * Creates a new `Metal` material instance.
     * @param {Vec3} albedo 
     * @param {Number | undefined} fuzz 
     * @returns {Metal}
     */
    constructor(albedo, fuzz) {
        super();
        this.albedo = albedo;
        this.fuzz = fuzz ?? 0;
    }
    albedo = new Vec3;
    fuzz = 0;
    /**
     * Scatters an incident ray off of the material, returning the scattered ray.
     * @param {Ray} ray 
     * @param {HitInfo} hit 
     * @returns {Ray}
     */
    scatter(ray, hit) {
        const tbn = new Basis(reflect(ray.direction, hit.normal));
        const direction = tbn.localize(normRandDisk(this.fuzz));
        return new Ray(hit.position, direction);
    }
    /**
     * Returns the attenuation of the material.
     * @returns {Vec3}
     */
    attenuation() {return this.albedo;}
}