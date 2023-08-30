import { Vec3, add, length, mul, randVec3, sub } from "./vector.js";
import { Dielectric, Lambertian, Metal } from "./material.js";
import { Hittable_List } from "./hittable_list.js";
import { Sphere } from "./sphere.js";
import { Camera } from "./camera.js";

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("screen");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const context = canvas.getContext("2d");
const image = context.createImageData(window.innerWidth, window.innerHeight);

const cam = new Camera(new Vec3(13, 2, 3), new Vec3(0, 0, 0), 20, 10, 0.6, image);

// World
const world = new Hittable_List;

const ground_material = new Lambertian(new Vec3(0.5, 0.5, 0.5));
world.hittables.push(new Sphere(new Vec3(0, -1000, 0), 1000, ground_material));

for (let a = -11; a < 11; ++a) for (let b = -11; b < 11; ++b) {
    const choose_mat = Math.random();
    const center = new Vec3(a + 0.9 * Math.random(), 0.2, b + 0.9 * Math.random());
    if (length(sub(center, new Vec3(4, 0.2, 0))) > 0.9) {
        if (choose_mat < 0.8) {
            const albedo = randVec3();
            world.hittables.push(new Sphere(center, 0.2, new Lambertian(albedo)));
        } else if (choose_mat < 0.95) {
            const albedo = add(mul(randVec3(), 0.5), new Vec3(0.5, 0.5, 0.5));
            const fuzz = Math.random() * 0.5;
            world.hittables.push(new Sphere(center, 0.2, new Metal(albedo, fuzz)));
        } else {
            world.hittables.push(new Sphere(center, 0.2, new Dielectric(1.5)));
        }
    }
}

world.hittables.push(new Sphere(new Vec3(0, 1, 0), 1.0, new Dielectric(1.5)));
world.hittables.push(new Sphere(new Vec3(-4, 1, 0), 1.0, new Lambertian(new Vec3(0.4, 0.2, 0.1))));
world.hittables.push(new Sphere(new Vec3(4, 1, 0), 1.0, new Metal(new Vec3(0.7, 0.6, 0.5), 0)));

// Render
const start_time = performance.now();
cam.render(context, world);
const time = (performance.now() - start_time) / 1000;

context.font = "20px serif";
context.direction = "ltr";
context.fillStyle = "black"
context.fillText(`RenderTime: ${time.toFixed(3)}s`, 6, 20);