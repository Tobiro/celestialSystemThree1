import * as THREE from 'three'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 5.1, 100)
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry( 2, 2, 2 );
//const material = new THREE.MeshStandardMaterial({color:0x00ff00});
const material = new THREE.MeshPhongMaterial({color:0x000fff});
const cube = new THREE.Mesh( geometry, material );
const lght =new THREE.AmbientLight(0xffffff, 1);
const dl = new THREE.DirectionalLight(0xffffff, 0.5);
dl.position.set(0,0,0);
//lght.position.set(0,50,0)
scene.add( cube );
scene.add(lght);
cube.rotateX(20);
cube.rotateY(25);
cube.rotateZ(10);
//cube.translateZ(5);
//cube.translateZ(8)
camera.position.z = 20;
camera.rotateX(0.09)

function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}
animate();
