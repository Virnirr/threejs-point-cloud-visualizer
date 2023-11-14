import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader";
import Stats from "three/examples/jsm/libs/stats.module";
import { PCDLoader } from "three/addons/loaders/PCDLoader.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import "./style.css";

// import { PointCloudOctree, Potree } from "/three-loader";
const width = window.innerWidth;
const height = window.innerHeight;

// adding shadows to the model
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
  scene.add(directionalLight);
}

const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper(5));
scene.background = new THREE.Color(0x72645b);

// adding the x, y, z axis helper
scene.add(new THREE.HemisphereLight(0x443333, 0x111122));
addShadowedLight(1, 1, 1, 0xffffff, 1.35);
addShadowedLight(0.5, 1, -1, 0xffaa00, 1);

// const light = new THREE.SpotLight();
// light.position.set(20, 20, 20);
// scene.add(light);

// adding camera for view
const fov = 45;
const aspect = width / height;
const near = 0.1;
const far = 100000000000000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 40;

// renders everything
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
renderer.setPixelRatio(devicePixelRatio);
renderer.shadowMap.enabled = true;

const cameraTarget = new THREE.Vector3(0, -0.1, 0);
document.body.appendChild(renderer.domElement);

// orbital control for movement
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// instantiate a loader
const loader = new OBJLoader();

// load a resource
loader.load(
  // resource URL
  "asset/SaMo_topo_8_color_scaled.obj",
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

// does resize window
window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

// give stats
const stats = new Stats();
document.body.appendChild(stats.dom);

// animates everything every time
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  camera.lookAt(cameraTarget);
  render();
  stats.update();
}

function render() {
  renderer.render(scene, camera);
}

animate();
