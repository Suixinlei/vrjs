//please write your code below
let THREE = require('three');
THREE.FlyControls = require('./FlyControls');
const Stats = require('stats.js');
const dat = require('./dat.gui');

let camera, controls, scene, renderer;
let stats;
let clock = new THREE.Clock();

let Earth;

let VaryObject = {
  color0: '#ffffff'
};
var gui = new dat.GUI();
gui.addColor(VaryObject, 'color0');

function World (container, settings) {
  settings = settings || {};
  let distance = 50000;

  // 1.如果canavs本身有宽和高属性,我们将会使用元素本身的属性
  // 2.寻找css中是否有对该canavs定义的宽和高
  // 3.如果没有定义我们将会用其充满container
  let width = settings.width || container.offsetWidth || window.innerHeight;
  let height = settings.height || container.offsetHeight || window.innerHeight;

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(45, width / height, 50, 1e7);
  camera.position.z = distance;

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize(width, height);
  renderer.domElement.style.position = 'absolute';
  container.appendChild(renderer.domElement);

  controls = new THREE.FlyControls( camera, renderer.domElement );
  controls.movementSpeed = 1000;
  controls.rollSpeed = Math.PI / 24;
  controls.autoForward = false;
  controls.dragToLook = false;
  scene.add(camera);

  window.addEventListener('resize', onWindowResize, false);

  if (settings.stats) {
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    container.appendChild( stats.domElement );
  }
}

World.prototype.addMesh  = function () {
  let Earth_Geometry = new THREE.SphereGeometry( 6371, 100, 50 );
  let Earth_Material = new THREE.MeshBasicMaterial({
    color: '#ffffff'
  });
  Earth = new THREE.Mesh(Earth_Geometry, Earth_Material);
  let Earth1 = new THREE.Mesh(Earth_Geometry, Earth_Material);
  Earth.position.y = 6371 * 2;
  console.log(Earth);
  scene.add(Earth);
  scene.add(Earth1);
};

World.prototype.render = function (callback) {
  var delta = clock.getDelta();
  requestAnimationFrame(function() {
    World.prototype.render(callback);
  });
  callback();
  controls.update( delta );
  stats.update();
  renderer.render(scene, camera);
};

function onWindowResize( event ) {
  var SCREEN_HEIGHT = window.innerHeight;
  var SCREEN_WIDTH  = window.innerWidth;
  renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
  camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
  camera.updateProjectionMatrix();
}

module.exports = World;