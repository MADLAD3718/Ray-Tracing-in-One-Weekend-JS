import { ReadBuffer } from "./util.js";
import { Perlin } from "./perlin.js";
import { Vec3, mul } from "./vector.js";

export class Texture {
    /**
     * Samples the texture at the given coordinate.
     * @param {Vec3} uv 
     * @param {Vec3} p
     * @returns {Vec3}
     */
    sample(uv, p) {}
}

export class Solid_Colour extends Texture {
    /**
     * Creates a new solid colour texture.
     * @param {Vec3} colour 
     * @returns {Solid_Colour}
     */
    constructor(colour) {
        super();
        this.colour = colour;
    }
    colour;
    /**
     * Samples the texture at the given coordinate.
     * @param {Vec3} uv 
     * @param {Vec3} p
     * @returns {Vec3}
     */
    sample(uv, p) { return this.colour; }
}

export class Checker_Texture extends Texture {
    /**
     * Creates a new checker texture.
     * @param {Number} scale 
     * @param {Vec3} colour0 
     * @param {Vec3} colour1 
     * @returns {Vec3}
     */
    constructor(scale, colour0, colour1) {
        super();
        this.scale = scale;
        this.colour0 = colour0;
        this.colour1 = colour1;
    }
    scale;
    colour0;
    colour1;
    /**
     * Samples the texture at the given coordinate.
     * @param {Vec3} uv 
     * @param {Vec3} p
     * @returns {Vec3}
     */
    sample(uv, p) {
        const x = Math.floor(uv.x / this.scale);
        const y = Math.floor(uv.y / this.scale);
        const isEven = (x + y) % 2 == 0;
        return isEven ? this.colour0 : this.colour1;
    }
}

export class Image_Texture extends Texture {
    /**
     * Creates a new image texture.
     * @param {ImageData} image 
     * @returns {Vec3}
     */
    constructor(image) {
        super();
        this.image = image;
    }
    image;
    /**
     * Samples the texture at the given coordinate.
     * @param {Vec3} uv 
     * @param {Vec3} p
     * @returns {Vec3}
     */
    sample(uv, p) {
        const x = Math.floor(uv.x * (this.image.width - 1));
        const y = Math.floor(uv.y * (this.image.height - 1));
        return ReadBuffer(this.image, new Vec3(x, y, 0));
    }
}

export class Noise_Texture extends Texture {
    /**
     * Creates a new perlin noise texture.
     * @param {Number} scale 
     * @returns {Vec3}
     */
    constructor(scale) {
        super();
        this.scale = scale;
        this.noise = new Perlin();
    }
    noise;
    scale;
    /**
     * Samples the texture at the given coordinate.
     * @param {Vec3} uv 
     * @param {Vec3} p
     * @returns {Vec3}
     */
    sample(uv, p) {
        const s = mul(p, this.scale);
        const noise = 0.5 * (1 + Math.sin(s.z + 10 * this.noise.turb(s)));
        return mul(new Vec3(1, 1, 1), noise);
    }
}