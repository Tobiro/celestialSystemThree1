import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 100)
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera,renderer.domElement);
//const geometry = new THREE.SphereGeometry(2);
const geometry = new THREE.BoxGeometry(2,2,2);
//const material = new THREE.MeshStandardMaterial({color:0x00ffff});
const material = new THREE.MeshPhongMaterial({color:0x000fff});
const cube = new THREE.Mesh( geometry, material );
const lght =new THREE.AmbientLight(0xffffff, 1);
const dl = new THREE.DirectionalLight(0xffffff, 1);
const helper = new THREE.DirectionalLightHelper(dl,1);
dl.position.set(0,2,0);
//lght.position.set(0,50,0)
scene.add( cube );
scene.add(lght);
scene.add(dl);
scene.add(helper);
// cube.rotateX(5);
// cube.rotateY(0);
// cube.rotateZ(0);
//cube.translateZ(5);
cube.translateZ(1)
camera.position.z = 4;
camera.rotateX(0.0)
//controls.update();
controls.target.set(-10,0,0);
controls.autoRotate=true;
console.log(camera);
//controls.mouseButtons = {LEFT: THREE.MOUSE.PAN};

function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
	controls.update();
}
animate();
