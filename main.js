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

world.hittables.push(new Sphere(new Vec3(0, 0, -1), 0.5));
world.hittables.push(new Sphere(new Vec3(0, -100.5, -1), 100));

// Render
const start_time = performance.now();
cam.render(context, world);
const time = (performance.now() - start_time) / 1000;

context.font = "20px serif";
context.direction = "ltr";
context.fillStyle = "black"
context.fillText(`RenderTime: ${time.toFixed(3)}s`, 6, 20);