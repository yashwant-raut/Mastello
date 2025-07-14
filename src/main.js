import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";

import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { RGBELoader } from "three/examples/jsm/Addons.js";
import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";

// === Global Variables ===
let scene, camera, renderer, controls, model;
let modelGroup = new THREE.Group();
modelGroup.name = "ModelGroup-global";

const params = {
  roughness: 0.5,
  metalness: 0.5,
  exposure: 0.2,
};
// === Init ===
initScene();
initCamera();
initRenderer();
initControls();
initEnvironment();
initDefaultModel();
animate();
initGUI();

// === Functions ===

function initScene() {
  scene = new THREE.Scene();

  document.querySelectorAll("#sidebar img").forEach((img) => {
    img.addEventListener("click", () => {
      const name = img.dataset.model;

      let modelList = [];
      switch (name) {
        case "DRY Amsterdam":
          modelList = [
            {
              objPath: "models/Meir/DRY Amsterdam.obj",
              mtlPath: "models/Meir/DRY Amsterdam.mtl",
            },
          ];
          break;
        case "MA02-400":
          modelList = [
            {
              objPath: "models/Meir/MA02-400.obj",
              mtlPath: "models/Meir/MA02-400.mtl",
            },
          ];
          break;

        case "MB03":
          modelList = [
            {
              objPath: "models/Meir/MB03.obj",
              mtlPath: "models/Meir/MB03.mtl",
            },
          ];
          break;

        case "MB04-R3":
          modelList = [
            {
              objPath: "models/Meir/MB04-R3.obj",
              mtlPath: "models/Meir/MB04-R3.mtl",
            },
          ];
          break;

        case "MP01-R":
          modelList = [
            {
              objPath: "models/Meir/MP01-R.obj",
              mtlPath: "models/Meir/MP01-R.mtl",
            },
          ];
          break;

        case "MP01S-B":
          modelList = [
            {
              objPath: "models/Meir/MP01S-B.obj",
              mtlPath: "models/Meir/MP01S-B.mtl",
            },
          ];
          break;

        case "MS05":
          modelList = [
            {
              objPath: "models/Meir/MS05.obj",
              mtlPath: "models/Meir/MS05.mtl",
            },
          ];
          break;

        case "MTV22TS":
          modelList = [
            {
              objPath: "models/Meir/MTV22TS.obj",
              mtlPath: "models/Meir/MTV22TS.mtl",
            },
          ];
          break;

        case "MW03S-FIN":
          modelList = [
            {
              objPath: "models/Meir/MW03S-FIN.obj",
              mtlPath: "models/Meir/MW03S-FIN.mtl",
            },
          ];
          break;

        case "MZ04B":
          modelList = [
            {
              objPath: "models/Meir/MZ04B.obj",
              mtlPath: "models/Meir/MZ04B.mtl",
            },
          ];
          break;

        case "MZ06B":
          modelList = [
            {
              objPath: "models/Meir/MZ06B.obj",
              mtlPath: "models/Meir/MZ06B.mtl",
            },
          ];
          break;
      }
      loadAndPlaceModels(modelList, scene, 50);
      console.log("Clicked on model:", img.dataset.model);
      console.log(scene);
    });
  });
}

function initCamera() {
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    5000
  );
  camera.position.z = 3;
  scene.add(camera);
}

function initRenderer() {
  let container = document.getElementById("viewer");
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.setSize(window.innerWidth, window.innerHeight);
  // document.body.appendChild(renderer.domElement);
  container.appendChild(renderer.domElement);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  window.addEventListener("resize", onWindowResize, false);
}

function initDefaultModel() {
  let modelList = [];
  modelList = [
    {
      objPath: "models/Meir/DRY Amsterdam.obj",
      mtlPath: "models/Meir/DRY Amsterdam.mtl",
    },
  ];
  loadAndPlaceModels(modelList, scene, 50);
}
function initControls() {
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
}

function initEnvironment() {
  const cameraLight1 = new THREE.DirectionalLight(0xffffff, 10);
  cameraLight1.castShadow = true;
  const cameraLight2 = new THREE.DirectionalLight(0xffffff, 10);
  cameraLight2.castShadow = true;
  const cameraLight3 = new THREE.DirectionalLight(0xffffff, 10);
  cameraLight3.castShadow = true;
  camera.add(cameraLight1);
  camera.add(cameraLight2);
  camera.add(cameraLight3);
  cameraLight1.position.set(0, 0, 0);
  cameraLight2.position.set(-10, 0, 0);
  cameraLight3.position.set(10, 0, 0);

  exrLightMap();
  scene.background = new THREE.Color(0xffffff);
}

function exrLightMap() {
  const pmremGenerator = new THREE.PMREMGenerator(renderer);

  const exrLoader = new EXRLoader();
  exrLoader.load("textures/env_metal_002_56e651d175.exr", function (exrMap) {
    const envMap = pmremGenerator.fromEquirectangular(exrMap).texture;
    scene.environment = envMap;
  });
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  render();
}

function render() {
  if (modelGroup) {
    modelGroup.traverse((child) => {
      if (child.isMesh && child.material?.isMeshStandardMaterial) {
        child.material.roughness = params.roughness;
        child.material.metalness = params.metalness;
        child.material.needsUpdate = true; // if dynamically changing maps/textures
      }
    });
  }

  renderer.toneMappingExposure = params.exposure;
  renderer.render(scene, camera);
}

function loadAndPlaceModels(modelList, scene, spacing = 100) {
  controls.reset();
  //remove existing model group if it exists
  if (modelGroup.children.length > 0) {
    scene.remove(modelGroup);
    modelGroup = new THREE.Group(); // reset the group
  }
  let loadedCount = 0;
  const mtlLoader = new MTLLoader();
  const objLoader = new OBJLoader();

  modelList.forEach((entry, index) => {
    const { objPath, mtlPath } = entry;

    mtlLoader.load(
      mtlPath,
      (materials) => {
        materials.preload();
        objLoader.setMaterials(materials);

        objLoader.load(
          objPath,
          (object) => {
            const box = new THREE.Box3().setFromObject(object);
            const size = new THREE.Vector3();
            const center = new THREE.Vector3();
            box.getSize(size);
            box.getCenter(center);

            object.position.sub(center);

            object.position.x = index * (size.x + spacing);
            convertMaterialsToStandard(object);
            object.castShadow = true;
            modelGroup.add(object);
            loadedCount++;

            if (loadedCount === modelList.length) {
              scene.add(modelGroup);
              fitToView(modelGroup, camera, controls);
              // addGroundPlaneBeneath(modelGroup, scene, 0.1, 2, 0x808080);
              console.log("All models loaded.");
            }
          },
          undefined,
          (err) => console.error(`Failed loading ${objPath}`, err)
        );
      },
      undefined,
      (err) => console.error(`Failed loading ${mtlPath}`, err)
    );
  });
}

function convertMaterialsToStandard(object) {
  // const texture = new THREE.TextureLoader().load("/textures/Meir/Koper.png");

  object.traverse((child) => {
    if (child.isMesh && child.material) {
      const oldMat = child.material;

      const map = oldMat.map ?? null;
      child.material = new THREE.MeshStandardMaterial({
        color: oldMat.color,
        map: map,
        metalness: params.metalness,
        roughness: params.roughness,
        side: THREE.DoubleSide,

        // map: texture,
      });
    }
  });
}

function initGUI() {
  const gui = new GUI();

  gui.add(params, "roughness", 0, 1, 0.01);
  gui.add(params, "metalness", 0, 1, 0.01);
  gui.add(params, "exposure", 0, 2, 0.01);
  gui.open();
}

function fitToView(object, camera, controls) {
  const box = new THREE.Box3().setFromObject(object);
  const size = new THREE.Vector3();
  box.getSize(size);
  const center = new THREE.Vector3();
  box.getCenter(center);
  console.log("Object size:", size, "Center:", center);
  const maxSize = Math.max(size.x, size.y, size.z);
  const fov = THREE.MathUtils.degToRad(camera.fov);
  const distance = maxSize / (1 * Math.tan(fov / 2));

  const direction = new THREE.Vector3()
    .subVectors(camera.position, controls.target)
    .normalize();

  camera.position.copy(center).add(direction.multiplyScalar(distance));
  camera.near = distance / 100;
  camera.far = distance * 10;
  camera.updateProjectionMatrix();

  controls.target.copy(center);
  controls.update();
}
