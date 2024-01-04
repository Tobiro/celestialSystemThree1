import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import Stats from 'stats.js'
import {matrix} from 'mathjs'
import {zeros} from 'mathjs'
import {sum} from 'mathjs'


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
var delT = 2;
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
// let vv = new Float32Array([3.5,3.5,0]);
// let test = new THREE.BufferGeometry();
// test.setAttribute('position', new THREE.BufferAttribute(vv,3));
// const matt =  new THREE.MeshPhongMaterial({color:0x000fff, size:10});
// matt.side = THREE.DoubleSide;
// const points = new THREE.Points(test,matt);
 const vv = [new THREE.Vector3(3,3,3), new THREE.Vector3(4,4,4)];
 let spl = new THREE.BufferGeometry().setFromPoints(vv);
 const line = new THREE.Line( spl, new THREE.LineDashedMaterial( { color: 0x000fff, dashSize: 3, gapSize: 0.2, linewidth:30 } ) );
 //line.computeLineDistances();



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
            this.body = new THREE.Mesh(this.rocketG, this.rokcetM);
            this.body.position.copy(new THREE.Vector3(X,Y,0));
    }
    movePos(dd, dt){
        this.body.position.add(dd.clone().multiplyScalar(dt));
        //console.log(dd)
    }
    moveVel(dv,dt){
        this.V.add(dv.clone().multiplyScalar(dt));
        //console.log(dv)
    }
    /* NOTE: This function is not being used after phyeng was written*/
    forceOnRocket(body){
        let r = new THREE.Vector3();
        r.subVectors(body.body.position,this.body.position )
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
    _trajForce(body,pos){
        let r = new THREE.Vector3();
        r.subVectors(body.body.position,pos )
        let rnorm = r.clone().normalize()
        //let acc = rnorm.multiplyScalar(1.993* Math.pow(10,(-38))*body.mass/r.distanceToSquared(new THREE.Vector3()) )
        let acc = rnorm.multiplyScalar(G*Math.pow(speedToScreen(1),3)*body.mass/r.lengthSq() )
        return acc;
    }
    _trajForceNew(bodies, pos){
        let siz = bodies.length
        let r = Array.from({ length: siz }, (x, i) => new THREE.Vector3);
        let rnorm = Array.from({ length: siz }, (x, i) => new THREE.Vector3);
        let acc = new THREE.Vector3();
        for(let i=0;i<siz;i++){
            r[i].subVectors(bodies[i].body.position, pos);
            rnorm[i] = r[i].clone().normalize()
            acc.add(rnorm[i].multiplyScalar(G*Math.pow(speedToScreen(1),3) * bodies[i].mass/r[i].lengthSq() )) 
        }
        return acc
    }
    trajectory(dt){
        let trajPtsCnt = 300;
        let trajPtsPos = [this.body.position.clone()];
        let trajPtsV = [this.V.clone()];
        for(let i=0; i<trajPtsCnt;i++){
            let trajPtsPosTemp = trajPtsPos[i].clone();
            let trajPtsVTemp = trajPtsV[i].clone();
            for(let j=0;j<1000;j++){
                let acc = this._trajForceNew(pBodies,trajPtsPosTemp);
                trajPtsVTemp.add(acc.multiplyScalar(dt*20));
                trajPtsPosTemp.add(trajPtsVTemp.clone().multiplyScalar(dt*20));
            }
            trajPtsV.push(trajPtsVTemp)
            trajPtsPos.push(trajPtsPosTemp)
        }
        let trajG = new THREE.BufferGeometry().setFromPoints(trajPtsPos);
        let trajM = new THREE.LineDashedMaterial( { color: 0x000fff, dashSize: 3, gapSize: 300 } )
        let traj = new THREE.Line(trajG, trajM) ;
        return traj;
    }

}
//console.log(G*Math.pow(speedToScreen(1),2))

class Planet {
    constructor(X,Y, Vx, Vy, radius, segments, stasis, mass){
        this.V = new THREE.Vector3(Vx,Vy,0)
        this.radius = radius;
        this.segments = segments;
        this.stasis = stasis;
        this.mass = mass
        this.planetG = new THREE.CircleGeometry(this.radius, this.segments);
        this.planetM = new THREE.MeshPhongMaterial({color:0x000fff});
        this.body = new THREE.Mesh(this.planetG, this.planetM);
        this.body.position.copy(new THREE.Vector3(X,Y,0))
    }
    movePos(dd,dt){
        this.body.position.add(dd.clone().multiplyScalar(dt));
    }
    moveVel(dv, dt){
        this.V.add(dv.clone().multiplyScalar(dt));
    }
}

/**PHYSICS ENGINE******************************/
/*********************************************** */

function forceCalc(body2, r){
    // let r = new THREE.Vector3();
    // r.subVectors(body.body.position,this.body.position )
    //console.log(r.length())
    if(r.length() != 0){
        let rnorm = r.clone().normalize()
        let acc = rnorm.multiplyScalar(G*Math.pow(speedToScreen(1),3)*body2.mass/r.distanceToSquared(new THREE.Vector3()) )
        return acc;
    } else {
        return new THREE.Vector3();
    }
    
};

//let aa = matrix([[1,2], [3,4]])
//sum(aa)
//console.log(sum(aa,0).get([1]))
//console.log(aa.size()[1])


function matVecAdd(mat){
    let siz = mat.size()[0];
    let output = Array.from({ length: siz }, (x, i) => new THREE.Vector3);
    for(let i=0;i<siz;i++){
        for(let j=0;j<siz;j++){
            output[i].add(mat.get([parseInt(i),parseInt(j)]))
        }
    }
    //console.log(output)
    return output
}

/* NOTE: calling mathjs for these simple mat calc is unnecesary. Change this later */
function phyEng(bodies){
    let matPos = zeros(bodies.length, bodies.length)
    let matAcc = zeros(bodies.length, bodies.length)
    for(let i in bodies){
        for(let j in bodies){
            matPos.set([parseInt(i),parseInt(j)], bodies[j].body.position.clone().sub(bodies[i].body.position))
            matAcc.set([parseInt(i),parseInt(j)], forceCalc(bodies[j], matPos.get([parseInt(i),parseInt(j)])))

            //console.log(matAcc.get([parseInt(i),parseInt(j)]))
            //console.log(i,j)
        }
    }
    return matVecAdd(matAcc);
    //return sum(matAcc,1)
    // let aa = sum(matAcc,1)
    // console.log(aa.get([0]))
}




/*************************OBJECT INSTATIATION + SCENE*********************** */
/******************************************************************************** */

const r1 = new Rocket(-distToScreen(AU),0,0.0000,speedToScreen(/*0.0002113*/ 0.000105   *c) ,1,1.5,1,1 );
//const r1 = new Rocket(0,0,0.0000,Math.sqrt(9*Math.pow(10,30 ) *1.993* Math.pow(10,(-38))/30 ) ,1,1.5,1,1 );
const p1 = new Planet(0,0,0,0,2, 50, 1,9*Math.pow(10,30));
const p2 = new Planet(100,50,0,0,2, 50, 1,9*Math.pow(10,30));

//console.log(r1.forceOnRocket(p1).x * AU/100);

 var bodies = [r1,p1,p2]
// console.log(phyEng(bodies))
var pBodies = [p1,p2]


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
scene.add(r1.body);
scene.add(p1.body);
scene.add(p2.body);
scene.add(lght);
scene.add(dl);
scene.add(helper);
scene.add(line);
//scene.add(r1.trajectory(delT))
camera.position.z = 100;
//console.log(r1.trajectory(delT*100))



/**********************ANIMATE LOOP********************************************** */
/******************************************************************************** */
var traj_to_ren_rem;
var trajCnt = 0;
var toggler = 0;
var modul = 5;
// var modulusCntr = 0;
function animate(now) {
    //EVERY RENDER = 1 sec in the simulated world. This is the current setup of the physics engine.
    stats.begin();
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
	controls.update();
   let cntr = 3000

    for(let i = 0;i<cntr; i++){
        //let acc1 = r1.forceOnRocket(p1);
        let acc1 = phyEng(bodies);
        //console.log(delT)
        let acc2 = r1.thrusters(left,right,up,down);
        //console.log(acc2);
        r1.moveVel(acc1[0], delT);
        r1.moveVel(acc2,(delT*10));
        // if(right === 1){
        //     let acc2 = r1.thrusters(0,1,0,0);
        //     r1.moveVel(acc2);
        // }
        r1.movePos(r1.V, delT);
        dl.position.x = r1.body.position.x
        dl.position.y = r1.body.position.y+3

        if(acc2.length()>0){
            if(trajCnt === 0){
                trajCnt++
                scene.remove(traj_to_ren_rem);
            }
            else if(trajCnt>0){
                if(trajCnt%modul === 0){
                    scene.remove(traj_to_ren_rem);   
                    toggler =0 
                    //console.log(trajCnt)
                } else {
                    if(toggler === 0){
                        traj_to_ren_rem = r1.trajectory(delT);
                        scene.add(traj_to_ren_rem);
                        toggler = 1    
                        //console.log(trajCnt)                    
                    }
                    }
                trajCnt++;
            }
            break;
        }
        else {
            if(trajCnt >0){
                scene.remove(traj_to_ren_rem);
                traj_to_ren_rem = r1.trajectory(delT);
                scene.add(traj_to_ren_rem);
                trajCnt = 0
            }
        }
    }
   stats.end();
}
animate();


/**************************ARROW KEY ASYNC********************************/
/******************************************************************************** */


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
