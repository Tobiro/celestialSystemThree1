function drawScene(gl, programInfo, buffers, rotRad,delY, rotRad1) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
    gl.clearDepth(1.0); // Clear everything
    gl.enable(gl.DEPTH_TEST); // Enable depth testing
    gl.depthFunc(gl.LEQUAL); // Near things obscure far things
  
    // Clear the canvas before we start drawing on it.

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
    // Create a perspective matrix, a special matrix that is
    // used to simulate the distortion of perspective in a camera.
    // Our field of view is 45 degrees, with a width/height
    // ratio that matches the display size of the canvas
    // and we only want to see objects between 0.1 units
    // and 100 units away from the camera.
  
    const fieldOfView = (45 * Math.PI) / 180; // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix1 = mat4.create();
    const projectionMatrix2 = mat4.create();
    // the projection matrix above is a unit matrix
    // note: glmatrix.js always has the first argument
    // as the destination to receive the result.
    //console.log(projectionMatrix)
    mat4.perspective(projectionMatrix1, fieldOfView, aspect, zNear, zFar);
    mat4.perspective(projectionMatrix2, fieldOfView, aspect, zNear, zFar);
    //console.log(projectionMatrix)
  
    // Set the drawing position to the "identity" point, which is
    // the center of the scene.
    const modelViewMatrix1 = mat4.create();
    const modelViewMatrix2 = mat4.create();
  
    // Now move the drawing position a bit to where we want to
    // start drawing the square.
    mat4.translate(
      modelViewMatrix1, // destination matrix
      modelViewMatrix1, // matrix to translate
      [-0.0, delY, -50.0],
      //[-0.0, 0.0, -3.0]
    ); // amount to translate
    mat4.rotate(
      modelViewMatrix1,
      modelViewMatrix1,
      rotRad,
      //-1,
      [0,0,1]
    )
    mat4.translate(
      modelViewMatrix2, // destination matrix
      modelViewMatrix2, // matrix to translate
      //[-0.0, delY, -40.0],
      [-0.0, -8.0, -50.0]
    ); // amount to translate
    mat4.rotate(
      modelViewMatrix2,
      modelViewMatrix2,
      //rotRad,
      -1,
      [1,0,0]
    )
    //console.log(modelViewMatrix2)
    const radis = new Float32Array([0.1*rotRad1, 0.15*rotRad1])


    // DRAW the FLOOR//

    setPositionAttribute(gl, buffers, programInfo,1);
    setColorAttribute(gl, buffers, programInfo,1); 
    //console.log(programInfo.program[0]);
    gl.useProgram(programInfo.program[1]);
    gl.uniformMatrix4fv(
      programInfo.uniformLocations.projectionMatrix[1],
      false,
      projectionMatrix2,
    );
    gl.uniformMatrix4fv(
      programInfo.uniformLocations.modelViewMatrix[1],
      false,
      modelViewMatrix2,
    );
    gl.uniform2fv(programInfo.uniformLocations.radis,
      radis) ;
   // console.log(programInfo.uniformLocations.modelViewMatrix[1])
    {
      const offset = 0;
      const vertexCount = 4;
      //console.log(24)
      gl.drawArrays(gl.TRIANGLE_STRIP , offset, vertexCount);
    };


    // DRAW THE BALL//
    //console.log(modelViewMatrix)
    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute.
    // Also the color values
    setPositionAttribute(gl, buffers, programInfo,0);
    //setColorAttribute(gl, buffers, programInfo,0); 

  
    // Tell WebGL to use our program when drawing
    gl.useProgram(programInfo.program[0]);

    
     // Set the shader uniforms
     gl.uniformMatrix4fv(
      programInfo.uniformLocations.projectionMatrix[0],
      false,
      projectionMatrix1,
    );
    gl.uniformMatrix4fv(
      programInfo.uniformLocations.modelViewMatrix[0],
      false,
      modelViewMatrix1,
    );


  
    {
      const offset = 0;
      const vertexCount = 32;
      gl.drawArrays(gl.TRIANGLE_FAN , offset, vertexCount);
    }





  }
  
  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute.
  function setPositionAttribute(gl, buffers, programInfo, indx) {
    var numComponents;
    //console.log("index"+indx)
    if (indx === 0 ){
      numComponents = 3
    } else {numComponents = 2};
    //const numComponents = 2; // pull out 2 values per iteration
    const type = gl.FLOAT; // the data in the buffer is 32bit floats
    const normalize = false; // don't normalize
    const stride = 0; // how many bytes to get from one set of values to the next
    // 0 = use type and numComponents above
    const offset = 0; // how many bytes inside the buffer to start from
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position[indx]);
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexPosition[indx],
      numComponents,
      type,
      normalize,
      stride,
      offset,
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition[indx]);
  }
// Tell WebGL how to pull out the colors from the color buffer
// into the vertexColor attribute.
function setColorAttribute(gl, buffers, programInfo, indx) {
    const numComponents = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color[indx]);
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexColor[indx],
      numComponents,
      type,
      normalize,
      stride,
      offset,
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor[indx]);
  }
  
export { drawScene };