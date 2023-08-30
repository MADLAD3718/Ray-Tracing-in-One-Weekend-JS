import { Dielectric, Lambertian, Metal } from "./material.js";
import { Hittable_List } from "./hittable_list.js";
import { Sphere } from "./sphere.js";
import { Camera } from "./camera.js";
import { Vec3 } from "./vector.js";

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("screen");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const context = canvas.getContext("2d");
const image = context.createImageData(window.innerWidth, window.innerHeight);

const cam = new Camera(new Vec3, image);

// World
const world = new Hittable_List;

const material_ground = new Lambertian(new Vec3(0.8, 0.8, 0));
const material_center = new Lambertian(new Vec3(0.1, 0.2, 0.5));
const material_left = new Dielectric(1.5);
const material_right = new Metal(new Vec3(0.8, 0.6, 0.2), 0);

world.hittables.push(new Sphere(new Vec3(0, -100.5, -1), 100, material_ground));
world.hittables.push(new Sphere(new Vec3(0, 0, -1), 0.5, material_center));
world.hittables.push(new Sphere(new Vec3(-1, 0, -1), 0.5, material_left));
world.hittables.push(new Sphere(new Vec3(1, 0, -1), 0.5, material_right));

// Render
const start_time = performance.now();
cam.render(context, world);
const time = (performance.now() - start_time) / 1000;

context.font = "20px serif";
context.direction = "ltr";
context.fillStyle = "black"
context.fillText(`RenderTime: ${time.toFixed(3)}s`, 6, 20);