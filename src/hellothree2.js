import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import Stats from "three/examples/jsm/libs/stats.module";
import "./style.css";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x72645b);

//Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

//Lights
scene.add(new THREE.HemisphereLight(0x443333, 0x111122));
addShadowedLight(1, 1, 1, 0xffffff, 1.35);
addShadowedLight(0.5, 1, -1, 0xffaa00, 1);

scene.add(new THREE.HemisphereLight(0xffffff, 0x111122));

//Ground
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(40, 40),
  new THREE.MeshPhongMaterial({ color: 0x999999, specular: 0x101010 })
);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -0.5;
scene.add(plane);
plane.receiveShadow = true;

//Camera
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  2000
);
camera.position.z = 3;

//Renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2);
document.body.appendChild(renderer.domElement);

//Resize
window.addEventListener("resize", () => {
  //Update Sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  //Update Camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
});

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

//PLY Loader
const loader = new OBJLoader();
// load a resource
loader.load(
  // resource URL
  "asset/adjusted_model.obj",
  // called when resource is loaded
  function (object) {
    scene.add(object);
  },
  // called when loading is in progresses
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  // called when loading has errors
  function (error) {
    console.log("An error happened");
  }
);

const stats = new Stats();
document.body.appendChild(stats.dom);

function animate() {
  requestAnimationFrame(animate);

  controls.update();

  render();

  stats.update();
}

function render() {
  renderer.render(scene, camera);
}

animate();

function addShadowedLight(x, y, z, color, intensity) {
  var directionalLight = new THREE.DirectionalLight(color, intensity);
  directionalLight.position.set(x, y, z);
  scene.add(directionalLight);

  directionalLight.castShadow = true;

  var d = 1;
  directionalLight.shadow.camera.left = -d;
  directionalLight.shadow.camera.right = d;
  directionalLight.shadow.camera.top = d;
  directionalLight.shadow.camera.bottom = -d;

  directionalLight.shadow.camera.near = 1;
  directionalLight.shadow.camera.far = 4;

  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;

  directionalLight.shadow.bias = -0.001;
}
