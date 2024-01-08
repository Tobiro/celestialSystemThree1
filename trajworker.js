import * as THREE from 'three'
//import Vector3 from 'three'
// //import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
// //import Stats from 'stats.js'
// import {matrix} from 'mathjs'
// import {zeros} from 'mathjs'
// import {sum} from 'mathjs'

self.onmessage = function(e){
    console.log('Message received from main script');
    // var workerResult = 'Result: ' + (e.data * 2);
    // var y = e.data
    // var temp = ttp(y);
    //console.log(e.data[0]);
    //let temp = doTestData(e.data)
    let temp = intervalTrajectory(e.data[0], e.data[1], e.data[2], e.data[3], e.data[4], e.data[5])
    self.postMessage(temp);
}

function doTestData(data){
    let posjson = data[0];
    let vjson = data[1];
    let masses = data[2];
    let dt = data[3];
    let G = data[4];
    if(posjson.length ===0){return 'emptypos'};
    if(vjson.length ===0){return 'emptyv'};
    let trajBodiesPtsPos = Array.from({length:posjson.length}, (x,i)=> [new THREE.Vector3(posjson[i].x,posjson[i].y, posjson[i].z )]);
    return trajBodiesPtsPos
}

function ttp(y){
    let x = 0
    for(let i=0;i<100000;i++){
        for(j=0;j<10000;j++){
            x+=1
        }
    }
    console.log(x+ y)
    return x
}

function distToScreenAtWorker(num,distanceToScreenMult ){
    return distanceToScreenMult*num
}


function speedToScreenAtWorker(num,distanceToScreenMult){
    return distToScreenAtWorker(num, distanceToScreenMult)
}

function intervalTrajectory( posjson, vjson, masses, dt,G, distanceToScreenMult){
    //console.log('this')
    //return
    // if(trajSet.length != 0){
    //     trajSet.forEach((x,i)=>scene.remove(x));
    // }
    //console.log(posArr)
    if(posjson.length ===0){return []};
    if(vjson.length ===0){return []};
    // let aa =   Array.from({length:posjson.length}, (x,i)=> [new THREE.Vector3(posjson[i].x,posjson[i].y, posjson[i].z )])
    // console.log( aa)
    // console.log(posArr[0])
    let trajPtsCnt = 300;
//    let trajBodiesPtsPos = Array.from({length:posjson.length}, (x,i)=> [new THREE.Vector3(posjson[i].x,posjson[i].y, posjson[i].z )]);
      let trajBodiesPtsPos = Array.from(posjson, a => [new THREE.Vector3(a[0], a[1], a[2])])
      let trajBodiesPtsV = Array.from(vjson, a => [new THREE.Vector3(a[0], a[1], a[2])])
    // let trajBodiesPtsPos = []
    // for(let a of posjson){trajBodiesPtsPos.push( [new THREE.Vector3(a.x,a.y,a.z)]  )}
    //let trajBodiesPtsV = Array.from({length:vjson.length}, (x,i)=> [new THREE.Vector3(vjson[i].x,vjson[i].y, vjson[i].z )]);
    //let masses = Array.from({length:bodies.length}, (x,i)=> bodies[i].mass)
    //console.log(trajBodiesPtsPos[0])
    //console.log(trajBodiesPtsPos)
    //console.log(trajBodiesPtsPos);
    // console.log([new THREE.Vector3(posjson[0].x,posjson[0].y, posjson[0].z )])
    //console.log(trajBodiesPtsPos[0][1])
    // console.log(posjson[0])
    for(let i=0;i<trajPtsCnt;i++){
        let trajBodiesPtsPosTemp = [];
        let trajBodiesPtsVTemp = [];
        trajBodiesPtsPos.forEach((a)=> trajBodiesPtsPosTemp.push(a[i].clone()))
        trajBodiesPtsV.forEach((a)=> trajBodiesPtsVTemp.push(a[i].clone()))
        //let trajBodiesPtsPosTemp = Array.from({length:posjson.length}, (x,p)=> trajBodiesPtsPos[p][i].clone() )
        //let trajBodiesPtsPosTemp = Array.from(trajBodiesPtsPos, (a,p) => a[i].clone())
        //let trajBodiesPtsPosTemp = Array.from([[1,2],[3,4], [5,6]], (a,p) => a[1])
        //let trajBodiesPtsVTemp = Array.from({length:vjson.length}, (x,p)=> trajBodiesPtsV[p][i].clone() )
        //console.log(trajBodiesPtsPos)
        for(let j=0;j<1000;j++){
            let acc =  trajForceEng(masses,trajBodiesPtsPosTemp,G,distanceToScreenMult);
            //console.log(acc);
            // console.log(trajBodiesPtsPosTemp)
            trajBodiesPtsVTemp.forEach((x,k)=> x.add(acc[k].clone().multiplyScalar(dt*10)))
            trajBodiesPtsPosTemp.forEach((x,k)=> x.add(trajBodiesPtsVTemp[k].clone().multiplyScalar(dt*10)) )
        }
        trajBodiesPtsV.forEach((x,i)=> x.push(trajBodiesPtsVTemp[i]))
        trajBodiesPtsPos.forEach((x,i)=> x.push(trajBodiesPtsPosTemp[i]) )
    }
    //let trajSetG = Array.from({length:posArr.length},(x,i)=> new THREE.BufferGeometry().setFromPoints(trajBodiesPtsPos[i]))
    // let trajG = new THREE.BufferGeometry().setFromPoints(trajPtsPos);
    // let trajM = new THREE.LineDashedMaterial( { color: 0x000fff, dashSize: 3, gapSize: 300 } )
    //trajSet = Array.from({length:bodies.length},(x,i)=> new THREE.Line(trajSetG[i], trajMat)   )
    //let traj = new THREE.Line(trajG, trajM) ;
    //trajSet.forEach((x,i)=> scene.add(x));
    //console.log(trajBodiesPtsPos);
    return trajBodiesPtsPos;
}


function trajForceEng(masses, trajBodiesPtsPosTemp,G, distanceToScreenMult){
    let siz = masses.length;
    //console.log(masses)
    let matPos = Array.from({length:siz},()=>Array.from({length:siz},()=> new THREE.Vector3 ))
    let matAcc = Array.from({length:siz},()=>Array.from({length:siz},()=> new THREE.Vector3 ))
    //console.log(matPos)
    let acc = Array.from({ length: siz }, () => new THREE.Vector3);
    for(let i=0;i<siz;i++){
        for(let j=0;j<siz;j++){
            if(j>=0){
                matPos[i][j] = trajBodiesPtsPosTemp[j].clone().sub(trajBodiesPtsPosTemp[i]);
                matAcc[i][j] = forceCalcNew(masses[j],matPos[i][j],G,distanceToScreenMult)
                //console.log(matAcc[i][j])
                acc[i].add(matAcc[i][j])
            }
        }
    }
    //console.log(acc)
    return acc
}

function forceCalcNew(mass,r,G, distanceToScreenMult){
    if(r.length() != 0){
        let rnorm = r.clone().normalize()
        let acc = rnorm.multiplyScalar(G*Math.pow(speedToScreenAtWorker(1, distanceToScreenMult),3)*mass/r.distanceToSquared(new THREE.Vector3()) )
        return acc;
    } else {
        return new THREE.Vector3();
    }
}