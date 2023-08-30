import { Vec3, add, div, lerp, mul, norm, sub } from "./vector.js";
import { Hittable_List } from "./hittable_list.js";
import { Interval } from "./interval.js";
import { Ray } from "./ray.js";
import { WriteBuffer, flatToIPos } from "./util.js";

export class Camera {
    /**
     * Creates a new `Camera` instance;
     * @param {Vec3} position 
     * @param {Vec3} lookat 
     * @param {ImageData} image 
     * @returns {Camera}
     */
    constructor(position, image) {
        this.pos = position;
        this.image = image;

        const aspect_ratio = image.width / image.height;
        const focal_length = 1;
        const view_height = 2;
        const view_width = view_height * aspect_ratio;

        this.view.u = new Vec3(view_width, 0, 0);
        this.view.v = new Vec3(0, -view_height, 0);
        this.view.du = div(this.view.u, image.width);
        this.view.dv = div(this.view.v, image.height);

        this.view.origin = sub(sub(this.pos, new Vec3(0, 0, focal_length)), div(add(this.view.u, this.view.v), 2));
    }
    pos = new Vec3;
    dim = new Vec3;
    /**
     * @type {ImageData}
     * @readonly
     */
    image;
    /** @readonly */
    view = {
        origin: new Vec3,
        u: new Vec3,
        v: new Vec3,
        du: new Vec3,
        dv: new Vec3
    }
    /**
     * Renders a given world onto the image.
     * @param {CanvasRenderingContext2D} context 
     * @param {Hittable_List} world 
     */
    render(context, world) {
        const pixel00_loc = add(this.view.origin, div(add(this.view.du, this.view.dv), 2));
        let lasty = 0;
        for (let i = 0; i < this.image.data.length / 4; ++i) {
            const ipos = flatToIPos(this.image, i * 4);
            if (lasty != ipos.y) console.log(`Lines Remaining: ${this.image.height - (lasty = ipos.y) - 1}`);
            const pixel_center = add(pixel00_loc, mul(add(this.view.du, this.view.dv), ipos));
            const direction = norm(sub(pixel_center, this.pos));
            const ray = new Ray(this.pos, direction);
            const colour = this.rayColour(world, ray);
            WriteBuffer(this.image, i * 4, colour);
        }
        context.putImageData(this.image, 0, 0);
    }
    /**
     * Returns the colour of a given ray.
     * @param {Hittable_List} world 
     * @param {Ray} ray 
     * @returns {Vec3}
     */
    rayColour(world, ray) {
        const hit = world.intersect(ray, new Interval(0, Infinity));
        if (hit.hasHit)
            return div(add(hit.normal, new Vec3(1, 1, 1)), 2);

        const skyUpColour = new Vec3(0.5, 0.7, 1);
        const skyDownColour = new Vec3(1, 1, 1);
        return lerp(skyDownColour, skyUpColour, ray.direction.y * 0.5 + 0.5);
    }
}