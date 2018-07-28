// fixes Uncaught ReferenceError: regeneratorRuntime is not defined
import * as THREE from "THREE";
import OrbitControls from "three-orbitcontrols";
import { makeGrid } from "./makeGrid";

export function threeInit(gridX, gridY) {
  //three vars
  var camera;
  var scene;
  var renderer;
  var controls;

  ///////////////SETUP SCENE///////////////////////
  let threeDiv = document.createElement("div");
  document.body.appendChild(threeDiv);
  threeDiv.id = "threeDiv";
  threeDiv.className = "threeDiv";

  scene = new THREE.Scene();

  // set up the renderer
  renderer = window.renderer = new THREE.WebGLRenderer({
    alpha: true
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setSize(window.innerWidth, window.innerHeight);

  //put to div
  threeDiv.appendChild(renderer.domElement);

  /////////////// CAMERA ///////////////////////
  if (camera === undefined) {
    // camera = new THREE.PerspectiveCamera(
    //   70,
    //   window.innerWidth / window.innerHeight,
    //   1,
    //   10000
    // );
    // camera.position.set(gridX, 20, gridY);

    /////////////
    var frustumSize = 100;
    var aspect = window.innerWidth / window.innerHeight;
    var zoomFactor = 6;
    camera = new THREE.OrthographicCamera(
      (frustumSize * aspect) / -zoomFactor,
      (frustumSize * aspect) / zoomFactor,
      frustumSize / zoomFactor,
      frustumSize / -zoomFactor,
      0,
      1000
    );
  }
  //set camera in accordance to grid
  camera.position.set(gridX / 2, 10, gridY / 2);

  //IMPORTANT: renderer.domElement solves DAT.GUI
  //issue with drop down-menu not responding
  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(gridX / 2, 0, gridY / 2);

  /////////////// LIGHTS ///////////////////////
  //Create a PointLight and turn on shadows for the light
  var ambLight = new THREE.AmbientLight(0xffffff, 0.25); // soft white light
  scene.add(ambLight);
  // Spotlight for specific illumination
  var spotLight = new THREE.SpotLight(0xfffffff, 0.75);
  spotLight.position.set(30, 40, 30);

  spotLight.castShadow = true;
  spotLight.shadow.bias = 0.0000001;
  spotLight.shadow.mapSize.width = 1024; // Shadow Quality
  spotLight.shadow.mapSize.height = 1024; // Shadow Quality
  scene.add(spotLight);

  ////AXIS GRID HELPERS
  // let axes = new THREE.AxesHelper(100);
  // scene.add(axes);

  //make grid geom

  let grid = makeGrid(gridX, gridY);
  scene.add(grid);

  //call loop when done
  animate();

  //loop
  function animate() {
    requestAnimationFrame(animate);
    render();
  }
  //render
  function render() {
    controls.update();
    renderer.render(scene, camera);
  }
  return grid;
}
