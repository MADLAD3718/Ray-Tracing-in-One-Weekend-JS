import { Vec3, add, div, dot, lerp, mul, norm, sub } from "./vector.js";
import { WriteBuffer, flatToIPos, invGamma } from "./util.js";
import { Ray } from "./ray.js";

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("screen");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const context = canvas.getContext("2d");
const image = context.createImageData(window.innerWidth, window.innerHeight);

/**
 * Returns `true` if a given ray instersects the sphere.
 * @param {Vec3} center 
 * @param {Number} radius 
 * @param {Ray} ray 
 * @returns {Boolean}
 */
function hit_sphere(center, radius, ray) {
    const oc = sub(ray.origin, center);
    const h = dot(ray.direction, oc);
    const c = dot(oc, oc) - radius * radius;
    const discriminant = h * h - c;
    return discriminant >= 0;
}

/**
 * Returns the colour of a given ray.
 * @param {Ray} ray 
*/
function ray_colour(ray) {
    if (hit_sphere(new Vec3(0, 0, -1), 0.5, ray))
        return new Vec3(1, 0, 0);

    const skyUpColour = new Vec3(0.5, 0.7, 1);
    const skyDownColour = new Vec3(1, 1, 1);
    return lerp(skyDownColour, skyUpColour, ray.direction.y * 0.5 + 0.5);
}

// Image
const aspect_ratio = image.width / image.height;

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
    // Canvas appears to automatically apply gamma conversion to the image once 
    // it's displayed, so apply inverse gamma to match with the book's image.
    const colour = invGamma(ray_colour(ray));
    WriteBuffer(image, i * 4, colour);
}
context.putImageData(image, 0, 0);

const time = (performance.now() - start_time) / 1000;
context.font = "20px serif";
context.direction = "ltr";
context.fillStyle = "black"
context.fillText(`RenderTime: ${time.toFixed(3)}s`, 6, 20);