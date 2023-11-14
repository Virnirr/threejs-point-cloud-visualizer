import * as THREE from "three";
import "./style.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";

const scene = new THREE.Scene();

//Create our sphere, just the shape of object.
//however, there's no material (how it looks like)
const geometry = new THREE.SphereGeometry(3, 64, 64);
const material = new THREE.MeshStandardMaterial({
  color: "#00ff83",
});
// mesh is a combination of geometry and materials
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

//Sizes: size of viewport so that it takes up all the available spaces
const sizes = {
  width: window.innerWidth,
  height: window.innerWidth,
};

//Light: adding light so you can see on screen
const light = new THREE.PointLight(0xffffff, 70, 100, 1.7);
light.position.set(0, 10, 10);
// x, y, z light position
scene.add(light);
// Camera: essential a movie scene and the thing you're going to see on the screen
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  100
);
// not see any object farther than 100 and closer than 0.1
// camera is on top of each other so you cannot see the sphere, so move the camera back in z position
camera.position.z = 20; // this number can be anything, can be cm, m, or inch
// can go inside of the object if your z value is too close
// orthographic camera view and perspective camera view
scene.add(camera);

//paint or render on canvas
//Renderer
const canvas = document.querySelector(".webgl");
// renders the whole scene on canvas
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2); // smoothing out the edges
renderer.render(scene, camera); // render the scene and camera

// Controls: move around the spheres
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true; // how fast you move up and down, based on physics
controls.enablePan = false; // disable panning (i.e. move around)
controls.enableZoom = false; // disable zooming
controls.autoRotate = true; // auto-rotating the sphere like earth
controls.autoRotateSpeed = 5;

// Resize
window.addEventListener("resize", () => {
  // Updates Sizes when window resizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // fix issue of weird shape distortion when changing camera size:
  camera.updateProjectionMatrix();
  // Update Camera
  camera.aspect = sizes.width / sizes.height;
  // set size for renderer
  renderer.setSize(sizes.width, sizes.height);
});

const loop = () => {
  // animation
  controls.update(); // this will continue to update after you release it
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
};
loop(); // re-render everything during event loop every 60 frames per seconds

// Timeline magiccc
// allows us to essential synchronous multiple animations together
// animates the mesh scale up
const t1 = gsap.timeline({ defaults: { duration: 1 } });
t1.fromTo(mesh.scale, {z:0, x:0, y:0}, {z: 1, x:1, y:1}) // animate the scale