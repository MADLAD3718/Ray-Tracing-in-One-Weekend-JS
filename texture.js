import { ReadBuffer, toFloat } from "./util.js";
import { Vec3 } from "./vector.js";

export class Texture {
    /**
     * Samples the texture at the given coordinate.
     * @param {Vec3} uv 
     * @returns {Vec3}
     */
    sample(uv) {}
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
     * @returns {Vec3}
     */
    sample(uv) { return this.colour; }
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
     * @returns {Vec3}
     */
    sample(uv) {
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
     * @returns {Vec3}
     */
    sample(uv) {
        const x = Math.floor(uv.x * (this.image.width - 1));
        const y = Math.floor(uv.y * (this.image.height - 1));
        return ReadBuffer(this.image, new Vec3(x, y, 0));
    }
}