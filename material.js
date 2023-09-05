import { Vec3, dot, normRandDisk, randCosHemisphere, randSphere, reflect, reflectance, refract } from "./vector.js";
import { HitInfo } from "./hittable.js";
import { Texture } from "./texture.js";
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
     * @param {Vec3} uv 
     * @param {Vec3} p 
     * @returns {Vec3}
     */
    attenuation(uv, p) {
        return new Vec3(1, 1, 1);
    }
    /**
     * Returns the emitted light at a given point on the surface.
     * @param {Vec3} uv 
     * @param {Vec3} p 
     * @returns {Vec3}
     */
    emitted(uv, p) {
        return new Vec3(0, 0, 0);
    }
}

export class Lambertian extends Material {
    /**
     * Creates a new `Lambertian` material instance.
     * @param {Texture} texture 
     * @returns {Lambertian}
     */
    constructor(texture) {
        super();
        this.texture = texture;
    }
    texture;
    /**
     * Scatters an incident ray off of the material, returning the scattered ray.
     * @param {Ray} ray 
     * @param {HitInfo} hit 
     * @returns {Ray}
     */
    scatter(ray, hit) {
        const tbn = new Basis(hit.normal);
        const direction = tbn.localize(randCosHemisphere());
        return new Ray(hit.position, direction, ray.time);
    }
    /**
     * Returns the attenuation of the material.
     * @param {Vec3} uv 
     * @param {Vec3} p 
     * @returns {Vec3}
     */
    attenuation(uv, p) { return this.texture.sample(uv, p); }
}

export class Metal extends Material {
    /**
     * Creates a new `Metal` material instance.
     * @param {Texture} texture 
     * @param {Number | undefined} fuzz 
     * @returns {Metal}
     */
    constructor(texture, fuzz) {
        super();
        this.texture = texture;
        this.fuzz = fuzz ?? 0;
    }
    texture;
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
        return new Ray(hit.position, direction, ray.time);
    }
    /**
     * Returns the attenuation of the material.
     * @param {Vec3} uv 
     * @param {Vec3} p 
     * @returns {Vec3}
     */
    attenuation(uv, p) { return this.texture.sample(uv, p); }
}

export class Dielectric extends Material {
    /**
     * Creates a new `Dielectric` material instance.
     * @param {Number} ir 
     * @returns {Dielectric}
     */
    constructor(ir) {
        super();
        this.ir = ir;
    }
    ir = 1;
    /**
     * Scatters an incident ray off of the material, returning the scattered ray.
     * @param {Ray} ray 
     * @param {HitInfo} hit 
     * @returns {Ray}
     */
    scatter(ray, hit) {
        const cost = -dot(ray.direction, hit.normal);
        const eta = hit.isFrontFace ? 1 / this.ir : this.ir;
        let direction;
        const TIR = 1 - 1 / (eta * eta) > cost * cost;
        if (!TIR && reflectance(ray.direction, hit.normal, eta) < Math.random()) direction = refract(ray.direction, hit.normal, eta);
        else direction = reflect(ray.direction, hit.normal);
        return new Ray(hit.position, direction, ray.time);
    }
}

export class Light extends Material {
    /**
     * Creates a new `Light` material instance.
     * @param {Texture} emission 
     * @returns {Light}
     */
    constructor(emission) {
        super();
        this.emission = emission;
    }
    emission;
    /**
     * Scatters an incident ray off of the material, returning the scattered ray.
     * @param {Ray} ray 
     * @param {HitInfo} hit 
     * @returns {Ray}
     */
    scatter(ray, hit) {
        return undefined;
    }
    /**
     * Returns the emitted light at a given point on the surface.
     * @param {Vec3} uv 
     * @param {Vec3} p 
     * @returns {Vec3}
     */
    emitted(uv, p) {
        return this.emission.sample(uv, p);
    }
}

export class Isotropic extends Material {
    /**
     * Creates a new `Isotropic` material instance.
     * @param {Vec3} colour 
     * @returns {Isotropic}
     */
    constructor(colour) {
        super();
        this.colour = colour;
    }
    colour;
    /**
     * Scatters an incident ray off of the material, returning the scattered ray.
     * @param {Ray} ray 
     * @param {HitInfo} hit 
     * @returns {Ray}
     */
    scatter(ray, hit) {
        return new Ray(hit.position, randSphere(), ray.time);
    }
    /**
     * Returns the attenuation of the material.
     * @param {Vec3} uv 
     * @param {Vec3} p 
     * @returns {Vec3}
     */
    attenuation(uv, p) {
        return this.colour;
    }
}