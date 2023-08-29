import { Vec3, add, div, lerp, mul, norm, sub } from "./vector.js";
import { WriteBuffer, flatToIPos } from "./util.js";
import { Hittable_List } from "./hittable_list.js";
import { Interval } from "./interval.js";
import { Sphere } from "./sphere.js";
import { Ray } from "./ray.js";

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("screen");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const context = canvas.getContext("2d");
const image = context.createImageData(window.innerWidth, window.innerHeight);

/**
 * Returns the colour of a given ray.
 * @param {Ray} ray 
*/
function ray_colour(ray) {
    const hit = world.intersect(ray, new Interval(0, Infinity));
    if (hit.hasHit)
        return div(add(hit.normal, new Vec3(1, 1, 1)), 2);

    const skyUpColour = new Vec3(0.5, 0.7, 1);
    const skyDownColour = new Vec3(1, 1, 1);
    return lerp(skyDownColour, skyUpColour, ray.direction.y * 0.5 + 0.5);
}

// Image
const aspect_ratio = image.width / image.height;

// World
const world = new Hittable_List;

world.hittables.push(new Sphere(new Vec3(0, 0, -1), 0.5));
world.hittables.push(new Sphere(new Vec3(0, -100.5, -1), 100));

// Camera
const focal_length = 1;
const view_height = 2;
const view_width = view_height * aspect_ratio;
const camera_center = new Vec3(0, 0, 0);

const view_u = new Vec3(view_width, 0, 0);
const view_v = new Vec3(0, -view_height, 0);
const pixel_delta_u = div(view_u, image.width);
const pixel_delta_v = div(view_v, image.height);

const view_upper_left = sub(sub(sub(camera_center, new Vec3(0, 0, focal_length)), div(view_u, 2)), div(view_v, 2));
const pixel00_loc = add(view_upper_left, div(add(pixel_delta_u, pixel_delta_v), 2));

// Render
const start_time = performance.now();

let lasty = 0;
for (let i = 0; i < image.data.length / 4; ++i) {
    const ipos = flatToIPos(image, i * 4);
    if (lasty != ipos.y) console.log(`Lines Remaining: ${image.height - (lasty = ipos.y) - 1}`);
    const pixel_center = add(pixel00_loc, mul(add(pixel_delta_u, pixel_delta_v), ipos));
    const direction = norm(sub(pixel_center, camera_center));
    const ray = new Ray(camera_center, direction);
    const colour = ray_colour(ray);
    WriteBuffer(image, i * 4, colour);
}
context.putImageData(image, 0, 0);

const time = (performance.now() - start_time) / 1000;
context.font = "20px serif";
context.direction = "ltr";
context.fillStyle = "black"
context.fillText(`RenderTime: ${time.toFixed(3)}s`, 6, 20);