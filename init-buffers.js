import * as THREE from 'three';


function initBuffers(gl) {
    const positionBuffer2 = initPositionBuffer2(gl);
    const positionBuffer1 = initPositionBuffer1(gl);
    
    //const colorBuffer1 = initColorBuffer1(gl);
    const colorBuffer2 = initColorBuffer2(gl);
  
    return {
      position: [positionBuffer1, positionBuffer2],
      color: [  , colorBuffer2]
    }; 
}
  

function initPositionBuffer1(gl) {
    // Create a buffer for the square's positions.
    const positionBuffer = gl.createBuffer();
  
    // Select the positionBuffer as the one to apply buffer
    // operations to from here out.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    console.log("1")
  
    // Now create an array of positions for the square.
    // const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];
    // const curve = new THREE.EllipseCurve(
    //   0,  0,            // ax, aY
    //   10, 10,           // xRadius, yRadius
    //   0,  2 * Math.PI,  // aStartAngle, aEndAngle
    //   false,            // aClockwise
    //   0                 // aRotation
    // );
    // const points = curve.getPoints(50);
    // let pointsArray = [];

    //points.forEach((el) => pointsArray =  pointsArray.concat(el.toArray()));
    //console.log(pointsArray)
    const geometry = new THREE.CircleGeometry( 1, 30 );
    let jum = geometry.getAttribute('position').array
    //let jum = geometry.getAttribute('position').array.slice(3)
    // console.log(geometry.index.array.length)
    //console.log( jum)
    //let ass = new Float32Array([1,2,3])
    //console.log(jum.length )
  


  
    // Now pass the list of positions into WebGL to build the
    // shape. We do this by creating a Float32Array from the
    // JavaScript array, then use it to fill the current buffer.
    //gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    gl.bufferData(gl.ARRAY_BUFFER, jum, gl.STATIC_DRAW);
  
    return positionBuffer;
}

function initPositionBuffer2(gl){
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  const positions = [10.0, 10.0, -10.0, 10.0, 10.0, -10.0, -10.0, -10.0];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  console.log("2")
  return positionBuffer;
}


// uncomment if you need a color buffer for shader 1

// function initColorBuffer1(gl) {
//     // const colors = [
//     //   1.0,
//     //   0.0,
//     //   0.0,
//     //   1.0, // white
//     //   0.0,
//     //   1.0,
//     //   0.0,
//     //   1.0, // red
//     //   0.0,
//     //   0.0,
//     //   1.0,
//     //   1.0, // green
//     //   1.0,
//     //   1.0,
//     //   1.0,
//     //   1.0, // blue
//     // ];
//     // const colorNew = [
//     //   1.0,
//     //   1.0,

//     //   1.0,
//     //   0.0,

//     //   0.0,
//     //   1.0,

//     //   0.0,
//     //   0.0
//     // ]
//     const nclr = new Array(124).fill(1.0)
  
//     const colorBuffer = gl.createBuffer();
//     gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
//     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(nclr), gl.STATIC_DRAW);
  
//     return colorBuffer;
//   }



  function initColorBuffer2(gl) {
    const colors = [
      1.0,
      1.0,

      1.0,
      0.0,

      0.0,
      1.0,

      0.0,
      0.0      
    ]
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    console.log(colorBuffer);
    return colorBuffer;
  }


export { initBuffers };