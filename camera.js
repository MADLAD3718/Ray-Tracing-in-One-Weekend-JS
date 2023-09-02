import { Vec3, add, cross, div, lerp, mul, norm, randDisk, sub } from "./vector.js";
import { WriteBuffer, gamma, radians } from "./util.js";
import { Hittable_List } from "./hittable_list.js";
import { Interval } from "./interval.js";
import { BVH_Node } from "./bvh.js";
import { Ray } from "./ray.js";

export class Camera {
    /**
     * Creates a new `Camera` instance;
     * @param {Vec3} position 
     * @param {Vec3} lookat 
     * @param {Number} fov 
     * @param {Number} focal_dist 
     * @param {Number} defocus_angle 
     * @param {ImageData} image 
     * @returns {Camera}
     */
    constructor(position, lookat, fov, focal_dist, defocus_angle, image) {
        this.pos = position;
        this.lookat = lookat;
        this.defocus.angle = defocus_angle;
        this.image = image;
        
        const aspect_ratio = image.width / image.height;
        const view_height = 2 * Math.tan(radians(fov / 2)) * focal_dist;
        const view_width = view_height * aspect_ratio;
        
        const w = norm(sub(position, lookat));
        const u = norm(cross(new Vec3(0, 1, 0), w));
        const v = cross(w, u);

        this.view.u = mul(u, view_width);
        this.view.v = mul(v, -view_height);
        this.view.du = div(this.view.u, image.width);
        this.view.dv = div(this.view.v, image.height);

        this.view.origin = sub(sub(this.pos, mul(w, focal_dist)), div(add(this.view.u, this.view.v), 2));
        this.view.pixel_origin = add(this.view.origin, div(add(this.view.du, this.view.dv), 2));

        const defocus_radius = focal_dist * Math.tan(radians(this.defocus.angle / 2));
        this.defocus.u = mul(u, defocus_radius);
        this.defocus.v = mul(v, defocus_radius);
    }
    lookat = new Vec3;
    pos = new Vec3;
    dim = new Vec3;
    spp = 10;
    max_bounces = 10;
    /**
     * @type {ImageData}
     * @readonly
     */
    image;
    /** @readonly */
    view = {
        origin: new Vec3,
        pixel_origin: new Vec3,
        u: new Vec3,
        v: new Vec3,
        du: new Vec3,
        dv: new Vec3
    }
    /** @readonly */
    defocus = {
        angle: 0,
        u: new Vec3,
        v: new Vec3
    }
    /**
     * Renders a given world onto the image.
     * @param {CanvasRenderingContext2D} context 
     * @param {Hittable_List} world 
     */
    render(context, world) {
        let j = 0;
        const start_time = performance.now();
        const render_id = setInterval(() => {
            context.fillRect(0, 0, 1, 1);
            for (let i = 0; i < this.image.width; ++i) {
                const ipos = new Vec3(i, j, 0);
                let colour = new Vec3;
                for (let s = 0; s < this.spp; ++s)
                    colour = add(colour, this.rayColour(world, this.generateRay(ipos), this.max_bounces));
                colour = gamma(div(colour, this.spp));
                WriteBuffer(this.image, (j * this.image.width + i) * 4, colour);
            }
            context.putImageData(this.image, 0, 0);
            if (++j >= this.image.height) {
                const renderTime = (performance.now() - start_time) / 1000;
                console.log(`Render Time: ${renderTime.toFixed(3)}s.`);
                return clearInterval(render_id);
            }
        });
    }
    /**
     * Generates a new `Ray` depending on the given image position.
     * @param {Vec3} ipos 
     * @returns {Ray}
     */
    generateRay(ipos) {
        const pixel_center = add(this.view.pixel_origin, add(mul(this.view.du, ipos.x), mul(this.view.dv, ipos.y)));
        const pixel_sample = add(pixel_center, this.samplePixelSquare());
        const origin = this.defocus.angle <= 0 ? this.pos : this.sampleDefocusDisk();
        const direction = norm(sub(pixel_sample, origin));
        return new Ray(origin, direction, Math.random());
    }
    /**
     * Samples a random position in the pixel bounds.
     * @returns {Vec3}
     */
    samplePixelSquare() {
        const px = Math.random() - 0.5;
        const py = Math.random() - 0.5;
        return add(mul(this.view.du, px), mul(this.view.dv, py));
    }
    /**
     * Samples a random position within the defocus disk bounds.
     * @returns {Vec3}
     */
    sampleDefocusDisk() {
        const disk_sample = randDisk();
        return add(this.pos, add(mul(this.defocus.u, disk_sample.x), mul(this.defocus.v, disk_sample.y)));
    }
    /**
     * Returns the colour of a given ray.
     * @param {BVH_Node} world 
     * @param {Ray} ray 
     * @param {Number} depth 
     * @returns {Vec3}
     */
    rayColour(world, ray, depth) {
        if (depth < 0) return new Vec3;
        const hit = world.intersect(ray, new Interval(1e-8, Infinity));
        if (hit.hasHit) {
            const scattered = hit.material.scatter(ray, hit);
            return mul(this.rayColour(world, scattered, depth - 1), hit.material.attenuation(hit.uv, hit.position));
        }

        const skyUpColour = new Vec3(0.5, 0.7, 1);
        const skyDownColour = new Vec3(1, 1, 1);
        return lerp(skyDownColour, skyUpColour, ray.direction.y * 0.5 + 0.5);
    }
}