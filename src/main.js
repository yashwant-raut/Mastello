import * as THREE from "three";
import Stats from "three/addons/libs/stats.module.js";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";

let camera, scene, renderer, composer, controls, clock, stats, mixer;

init();

function init() {
  let container = document.getElementById("viewer");

  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("draco/");
  dracoLoader.setDecoderConfig({ type: "js" });
  const loader = new GLTFLoader();
  loader.setDRACOLoader(dracoLoader);
  loader.setPath("models/");

  clock = new THREE.Clock();

  stats = new Stats();
  container.appendChild(stats.dom);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setAnimationLoop(animate);
  container.appendChild(renderer.domElement);

  const pmremGenerator = new THREE.PMREMGenerator(renderer);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xbfe3dd);
  scene.environment = pmremGenerator.fromScene(
    new RoomEnvironment(),
    0.04
  ).texture;

  camera = new THREE.PerspectiveCamera(
    40,
    window.innerWidth / window.innerHeight,
    1,
    100
  );
  camera.position.set(5, 2, 8);

  controls = new OrbitControls(camera, renderer.domElement);
  // controls.target.set(0, 0.5, 0);
  controls.update();

  //

  loader.load(
    "room.glb",
    (gltf) => {
      const model = gltf.scene;
      scene.add(model);
      console.log("Model loaded:", model);
    },
    () => {
      console.log("Loading model...");
    },
    (e) => console.error(e)
  );

  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
}

function animate() {
  controls.update();
  renderer.render(scene, camera);
  stats.begin();
  stats.end();
}
