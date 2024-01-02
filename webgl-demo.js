import { initBuffers } from "./init-buffers.js";
import { drawScene } from "./draw-scene.js";

let rotRad = 0.0;
let rotRad1 = 0.0;
let deltaTime = 0;
let elapTime = 0.0;
const gacc = 9.8;
let delY = 10.0;
let delvel = 0.0;
let vel = 0.0;

main();
//
// start here
//
function main() {
    const canvas = document.getElementById("glcanvas");
    /* some random learning. Not part of the code.
    for(var gt=0; gt<5;gt++){
      setTimeout(function(){console.log(gt)}, "1000");
      //console.log("ggg")
    };
    console.log("fgg1")
    */
  // Initialize the GL context
    const gl = canvas.getContext("webgl");

  // Only continue if WebGL is available and working
    if (gl === null) {
        alert(
            "Unable to initialize WebGL. Your browser or machine may not support it.",
            );
        return;
    } 

  // Set clear color to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // Clear the color buffer with specified clear color
    gl.clear(gl.COLOR_BUFFER_BIT);
    const vsSource1 = `
        attribute vec4 aVertexPosition1;
        uniform mat4 uModelViewMatrix1;
        uniform mat4 uProjectionMatrix1;
        void main() {
      gl_Position = uProjectionMatrix1 * uModelViewMatrix1 * aVertexPosition1;
        }
        ` ;
        const vsSource2 = `
        attribute vec4 aVertexPosition2;
        attribute vec2 aVertexColor2; 
        uniform mat4 uModelViewMatrix2;
        uniform mat4 uProjectionMatrix2;
        varying lowp vec2 vColor2;
        void main() {
      gl_Position = uProjectionMatrix2 * uModelViewMatrix2 * aVertexPosition2;
      vColor2 = aVertexColor2;  
        }
        ` ;
    const fsSource1 = `
        void main() {
          gl_FragColor = vec4(1.0,1.0,1.0,1.0);
        }
    `;
    const fsSource2 = `
    precision mediump float;
    uniform vec2 uRadi;
    varying lowp vec2 vColor2;
    void main() {
      float dis = (vColor2[0]-0.5)*(vColor2[0]-0.5) + (vColor2[1]-0.5)*(vColor2[1]-0.5);
      if  ((dis >= uRadi[0]*uRadi[0]) && (dis < uRadi[1]*uRadi[1])){
        gl_FragColor = vec4(1.0,1.0,1.0,1.0);
      } else {
        gl_FragColor = vec4(1.0,0.0,0.0,1.0);
      }
    }
`;
    // Initialize a shader program; this is where all the lighting
    // for the vertices and so forth is established.
    const shaderProgram1 = initShaderProgram(gl, vsSource1, fsSource1);
    const shaderProgram2 = initShaderProgram(gl, vsSource2, fsSource2);
    // Collect all the info needed to use the shader program.
    // Look up which attribute our shader program is using
    // for aVertexPosition and look up uniform locations.
    const programInfo = {
        program: [shaderProgram1,shaderProgram2],
        attribLocations: {
              vertexPosition: [gl.getAttribLocation(shaderProgram1, "aVertexPosition1"), 
                                    gl.getAttribLocation(shaderProgram2, "aVertexPosition2")],
              vertexColor: [  ,  gl.getAttribLocation(shaderProgram2, "aVertexColor2")],
            },
        uniformLocations: {
              projectionMatrix: [gl.getUniformLocation(shaderProgram1, "uProjectionMatrix1"),
                                      gl.getUniformLocation(shaderProgram2, "uProjectionMatrix2")],
              modelViewMatrix: [gl.getUniformLocation(shaderProgram1, "uModelViewMatrix1"),
                                      gl.getUniformLocation(shaderProgram2, "uModelViewMatrix2")], 
              radis: gl.getUniformLocation(shaderProgram2, "uRadi")
            },
    };
    console.log("this " + programInfo.uniformLocations.projectionMatrix.length)
    console.log("this " + programInfo.attribLocations.vertexColor.length)
    // Here's where we call the routine that builds all the
    // objects we'll be drawing.
    const buffers = initBuffers(gl);

    // Draw the scene
    //drawScene(gl, programInfo, buffers);
    
    //Render Animation
    let then = 0
    let iter = 0
    // Draw the scene repeatedly
    function render(now) {
      now *= 0.005; // convert to seconds
      deltaTime = now - then;
      elapTime += deltaTime;
      then = now;

      drawScene(gl, programInfo, buffers, rotRad,delY,rotRad1);
      rotRad += deltaTime;
      rotRad1 += deltaTime*iter/2;
      if(rotRad>10){rotRad=0}
      //console.log(rotRad)
      delY += delvel*deltaTime
      delvel += gacc*deltaTime*(-1)  
      if(delY <-6 & delvel <=0){
        delvel = Math.sqrt(2*gacc*25*Math.pow(0.95,iter)) 
        elapTime = 0.0
        iter++  
        rotRad1 = -0
      }
      if (rotRad1 > 50){rotRad1 = 0.0}
      
      //console.log(vel, elapTime, delY)

      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
  
    // Create the shader program
  
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
  
    // If creating the shader program failed, alert
  
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert(
        `Unable to initialize the shader program: ${gl.getProgramInfoLog(
          shaderProgram,
        )}`,
      );
      return null;
    }
  
    return shaderProgram;
  }
  
  //
  // creates a shader of the given type, uploads the source and
  // compiles it.
  //
  function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
  
    // Send the source to the shader object
  
    gl.shaderSource(shader, source);
  
    // Compile the shader program
  
    gl.compileShader(shader);
  
    // See if it compiled successfully
  
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert(
        `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`,
      );
      gl.deleteShader(shader);
      return null;
    }
  
    return shader;
  }
