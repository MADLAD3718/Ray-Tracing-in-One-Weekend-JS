import { Checker_Texture, Image_Texture, Noise_Texture, Solid_Colour } from "./texture.js";
import { Vec3, add, length, mul, randVec3, sub } from "./vector.js";
import { Dielectric, Lambertian, Metal } from "./material.js";
import { Hittable_List } from "./hittable_list.js";
import { Interval } from "./interval.js";
import { Sphere } from "./sphere.js";
import { Camera } from "./camera.js";
import { BVH_Node } from "./bvh.js";

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("screen");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const context = canvas.getContext("2d");
const image = context.createImageData(window.innerWidth, window.innerHeight);

const cam = new Camera(new Vec3(13, 2, 3), new Vec3(0, 0, 0), 20, 10, 0, image);

function random_spheres() {
    const world = new Hittable_List;
    
    const ground_texture = new Checker_Texture(0.05, new Vec3(0.2, 0.3, 0.1), new Vec3(0.9, 0.9, 0.9));
    const ground_material = new Lambertian(ground_texture);
    world.add(new Sphere(new Vec3(0, -1000, 0), undefined, 1000, ground_material));
    
    for (let a = -11; a <= 11; ++a) for (let b = -11; b <= 11; ++b) {
        const choose_mat = Math.random();
        const center = new Vec3(a + 0.9 * Math.random(), 0.2, b + 0.9 * Math.random());
        if (length(sub(center, new Vec3(4, 0.2, 0))) > 0.9) {
            if (choose_mat < 0.8) {
                const albedo = randVec3();
                const center1 = add(center, new Vec3(0, Math.random() * 0.5, 0));
                // world.add(new Sphere(center, center1, 0.2, new Lambertian(albedo)));
                world.add(new Sphere(center, undefined, 0.2, new Lambertian(new Solid_Colour(albedo))));
            } else if (choose_mat < 0.95) {
                const albedo = add(mul(randVec3(), 0.5), new Vec3(0.5, 0.5, 0.5));
                const fuzz = Math.random() * 0.5;
                world.add(new Sphere(center, undefined, 0.2, new Metal(new Solid_Colour(albedo), fuzz)));
            } else {
                world.add(new Sphere(center, undefined, 0.2, new Dielectric(1.5)));
            }
        }
    }
    
    world.add(new Sphere(new Vec3(0, 1, 0), undefined, 1.0, new Dielectric(1.5)));
    world.add(new Sphere(new Vec3(-4, 1, 0), undefined, 1.0, new Lambertian(new Solid_Colour(new Vec3(0.4, 0.2, 0.1)))));
    world.add(new Sphere(new Vec3(4, 1, 0), undefined, 1.0, new Metal(new Solid_Colour(new Vec3(0.7, 0.6, 0.5)), 0)));
    
    world.hittables.sort((a, b) => {
        if (a.bounding_box.x.min < b.bounding_box.x.min) return -1;
        if (a.bounding_box.x.min == b.bounding_box.x.min) return 0;
        return 1;
    });
    const bvh = new BVH_Node(world, 0, world.hittables.length - 1);
    cam.render(context, world);
}

function two_spheres() {
    const world = new Hittable_List;

    const checker = new Checker_Texture(0.05, new Vec3(0.2, 0.3, 0.1), new Vec3(0.9, 0.9, 0.9));

    world.add(new Sphere(new Vec3(0, -10, 0), undefined, 10, new Lambertian(checker)));
    world.add(new Sphere(new Vec3(0, 10, 0), undefined, 10, new Lambertian(checker)));

    const cam = new Camera(new Vec3(13, 2, 3), new Vec3(0, 0, 0), 20, 1, 0, image);
    cam.render(context, world);
}

function earth() {
    const earth_image = document.createElement("img");
    earth_image.setAttribute("src", "images/earthmap.jpg");
    const t_canvas = document.createElement("canvas");
    t_canvas.width = earth_image.width;
    t_canvas.height = earth_image.height;
    const img_loader = t_canvas.getContext("2d");
    earth_image.onload= () => {
        img_loader.drawImage(earth_image, 0, 0);
        const data = img_loader.getImageData(0, 0, earth_image.width, earth_image.height);
        const texture = new Image_Texture(data);
        const world = new Hittable_List;
        world.add(new Sphere(new Vec3, undefined, 2, new Lambertian(texture)));
        const cam = new Camera(new Vec3(0, 0, 12), new Vec3(0, 0, 0), 20, 1, 0, image);
        cam.render(context, world);
        addEventListener("click", (event) => {
            const ipos = new Vec3(event.pageX, event.pageY, 0);
            const ray = cam.generateRay(ipos);
            console.log(world.intersect(ray, new Interval(1e-8, Infinity)));
        });
    }

}

function two_perlin_spheres() {
    const world = new Hittable_List;
    const perlin_texture = new Noise_Texture(2);
    world.add(new Sphere(new Vec3(0, -1000, 0), undefined, 1000, new Lambertian(perlin_texture)));
    world.add(new Sphere(new Vec3(0, 2, 0), undefined, 2, new Lambertian(perlin_texture)));

    const cam = new Camera(new Vec3(13, 2, 3), new Vec3(0, 0, 0), 20, 1, 0, image);
    cam.render(context, world);
}

switch(4) {
    case 1: random_spheres();       break;
    case 2: two_spheres();          break;
    case 3: earth();                break;
    case 4: two_perlin_spheres();   break;
}