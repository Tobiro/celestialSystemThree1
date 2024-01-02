import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import Stats from 'stats.js'


const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

var up = 0;
var down = 0;
var left = 0;
var right = 0;
var iters = 10000;
var stretch = 100;


const g = 9.8;
const c = 299792458;
const G = 6.6743 * Math.pow(10,-11);
var delT = 1;
const AU = 1.495978707* Math.pow(10,11);
var distanceToScreenMult = stretch/AU;  

function distToScreen(num){
    return distanceToScreenMult*num
}


function speedToScreen(num){
    return distToScreen(num)
}
// Testing space
// const aa =  new THREE.Vector2(1,2);
// console.log(aa);
// aa.set(4,5);
// console.log(aa);
// let aa = new Float32Array(
//     [
//         -10,-2,0,
//         -10,2,0,
//         3,0,0
//     ]
// )
// const test = new THREE.BufferGeometry();
// test.setAttribute('position', new THREE.BufferAttribute(aa,3));
// const matt = new THREE.MeshPhongMaterial({color:0x000fff});
// matt.side = THREE.DoubleSide;
// const test1 = new THREE.Mesh(test, matt);
// test1.position.add(new THREE.Vector3(-3,0,0))

// let aa1 = new Float32Array(
//     [
//         -20,-1,0,
//         -20,1,0,
//         3,0,0
//     ]
// )
// const testa = new THREE.BufferGeometry();
// testa.setAttribute('position', new THREE.BufferAttribute(aa1,3));
// const test1a = new THREE.Mesh(testa, matt);


//INVOKE THE Rocket and planet Classes//
class Rocket {
    constructor(X,Y,Vx,Vy,width, length, statis, mass){
            this.V = new THREE.Vector3(Vx,Vy,0);
            this.width = width;
            this.length = length;
            this.stasis = statis;
            this.mass = mass;

            this.rocketG = new THREE.BufferGeometry();
            this.vertices = new Float32Array([
                0 - this.length/2, 0 - this.width/2,0,
                0 - this.length/2, 0 + this.width/2,0,
                0 + this.length/2, 0, 0
            ])
            this.rocketG.setAttribute('position', new THREE.BufferAttribute(this.vertices,3)); //NOTE: Maybe change the verices to 3X2 from 3X3 and take 2 at a time from the method
            this.rokcetM = new THREE.MeshPhongMaterial({color:0x000fff});
            this.rokcetM.side = THREE.DoubleSide;
            this.rocket = new THREE.Mesh(this.rocketG, this.rokcetM);
            this.rocket.position.copy(new THREE.Vector3(X,Y,0));
    }
    movePos(dd){
        this.rocket.position.add(dd.multiplyScalar(delT));
    }
    moveVel(dv){
        this.V.add(dv.multiplyScalar(delT));
    }
    forceOnRocket(body){
        let r = new THREE.Vector3();
        r.subVectors(body.planet.position,this.rocket.position )
        let rnorm = r.clone().normalize()
        //let acc = rnorm.multiplyScalar(1.993* Math.pow(10,(-38))*body.mass/r.distanceToSquared(new THREE.Vector3()) )
        let acc = rnorm.multiplyScalar(G*Math.pow(speedToScreen(1),3)*body.mass/r.distanceToSquared(new THREE.Vector3()) )
        return acc;
    };
    thrusters(left,right,up,down){
        let acc1 = new THREE.Vector3();
        let acc2 = new THREE.Vector3();
        let acc3 = new THREE.Vector3();
        let acc4 = new THREE.Vector3();
        let acc5 = new THREE.Vector3();
        if(right === 1){
            acc1 = new THREE.Vector3(g*distanceToScreenMult,0,0);
        }
        if(left === 1){
            acc2 = new THREE.Vector3(-g*distanceToScreenMult,0,0);
        }
        if(up === 1){
            acc3 = new THREE.Vector3(0,g*distanceToScreenMult,0);
        }
        if(down === 1){
            acc4 = new THREE.Vector3(0,-g*distanceToScreenMult,0);
        }
        else{
            acc5 = new THREE.Vector3()
        }
        acc1.add(acc2);
        acc1.add(acc3);
        acc1.add(acc4);
        acc1.add(acc5);
        return acc1;
    };

}
console.log(G*Math.pow(speedToScreen(1),2))

class Planet {
    constructor(X,Y, Vx, Vy, radius, segments, stasis, mass){
        this.V = new THREE.Vector3(Vx,Vy,0)
        this.radius = radius;
        this.segments = segments;
        this.stasis = stasis;
        this.mass = mass
        this.planetG = new THREE.CircleGeometry(this.radius, this.segments);
        this.planetM = new THREE.MeshPhongMaterial({color:0x000fff});
        this.planet = new THREE.Mesh(this.planetG, this.planetM);
        this.planet.position.copy(new THREE.Vector3(X,Y,0))
    }
    movePos(dd){
        this.planet.position.add(dd.multiplyScalar(delT));
    }
    moveVel(dv){
        this.V.add(dv.multiplyScalar(delT));
    }
}


const r1 = new Rocket(-distToScreen(AU),0,0.0000,speedToScreen(0.0000977  *c) ,1,1.5,1,1 );
//const r1 = new Rocket(0,0,0.0000,Math.sqrt(9*Math.pow(10,30 ) *1.993* Math.pow(10,(-38))/30 ) ,1,1.5,1,1 );
const p1 = new Planet(0,0,0,0,2, 50, 1,9*Math.pow(10,30));

console.log(r1.forceOnRocket(p1).x * AU/100);


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 10000)
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera,renderer.domElement);
const lght =new THREE.AmbientLight(0xffffff, 1);
const dl = new THREE.DirectionalLight(0xffffff, 1);
const helper = new THREE.DirectionalLightHelper(dl,1);
//lght.position.set(0,0,10);
//dl.translateX(-100);
dl.translateY(10)
//console.log(dl.position)
//helper.translateX(-20);
scene.add(r1.rocket);
scene.add(p1.planet);
scene.add(lght);
scene.add(dl);
scene.add(helper);
camera.position.z = 100;

function animate(now) {
    //EVERY RENDER = 1 sec in the simulated world. This is the current setup of the physics engine.
    stats.begin();
    //console.log(now)
    //console.log(acc1);
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
	controls.update();
   // console.log(r1.V)
    for(let i = 0;i<10000; i++){
        let acc1 = r1.forceOnRocket(p1);
        let acc2 = r1.thrusters(left,right,up,down);
        //console.log(acc2);
        r1.moveVel(acc1);
        r1.moveVel(acc2.multiplyScalar(0.005));
        // if(right === 1){
        //     let acc2 = r1.thrusters(0,1,0,0);
        //     r1.moveVel(acc2);
        // }
        r1.movePos(r1.V);
        dl.position.x = r1.rocket.position.x
        //console.log(acc1)
    }
    let xxx = r1.thrusters(left,right,up,down)
    //console.log(r1.thrusters(left, right, up,down))
    //console.log(r1.V)
    //console.log(acc)
    console.log(left,right,up,down);
    //console.log(acc1);
   stats.end();
}
animate();

$(document).ready(()=>{
	$(document).keydown(
		function (e) {
			let key = (e.keyCode ? e.keyCode : e.which);
			let charr = String.fromCharCode(key);
			//Left Arrow
            if (key === 37) {
                // r1.movePos(new THREE.Vector2(-0.1,0))
                // dl.translateX(-0.1)
                left = 1;
            }
            //Right Arrow
            if(key === 39){
                // r1.movePos(new THREE.Vector2(0.1,0));
                // dl.translateX(0.1);
                right = 1;
            }
            //Down arrow
            if(key === 40){
                // r1.movePos(new THREE.Vector2(0,-0.1))
                // dl.translateY(-0.1)
                down = 1;
            }
            //up arrow
            if(key === 38){
                // r1.movePos(new THREE.Vector2(0,0.2))
                // dl.translateY(0.1)
                up = 1;
            }
        //console.log(key)
		}
    )
    $(document).keyup(
        function (e) {
            let key = (e.keyCode ? e.keyCode : e.which);
            let charr = String.fromCharCode(key);
            //Left Arrow
            if (key === 37) {
                // r1.movePos(new THREE.Vector2(-0.1,0))
                // dl.translateX(-0.1)
                left = 0;
            }
            //Right Arrow
            if(key === 39){
                // r1.movePos(new THREE.Vector2(0.1,0));
                // dl.translateX(0.1);
                right = 0;
            }
            //Down arrow
            if(key === 40){
                // r1.movePos(new THREE.Vector2(0,-0.1))
                // dl.translateY(-0.1)
                down = 0;
            }
            //up arrow
            if(key === 38){
                // r1.movePos(new THREE.Vector2(0,0.2))
                // dl.translateY(0.1)
                up = 0;
            }
        //console.log(key)
        }
    )
})
