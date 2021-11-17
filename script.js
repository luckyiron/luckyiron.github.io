// ................................... Start THREE JS Boiler Plate Code....................................................//

import * as THREE from "./js/build/three.module.js";
import { OrbitControls } from './js/examples/jsm/controls/OrbitControls.js';
import {OBJLoader} from './js/examples/jsm/loaders/OBJLoader.js';
import { DDSLoader } from './js/examples/jsm/loaders/DDSLoader.js';
import {MTLLoader} from './js/examples/jsm/loaders/MTLLoader.js';

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);      /* PerspectiveCamera allow you to have depth */  /* Orthographic no depth, flat 2D */
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor( 0xffffff );
document.body.appendChild(renderer.domElement);

// Update Viewport on Resize
window.addEventListener( 'resize', function(){
    var width  = window.innerWidth;
    var height = window.innerHeight;

    renderer.setSize(width, height);
    camera.aspect = width/height;
    camera.updateProjectionMatrix();
})

// ................................... End THREE JS Boiler plate code ....................................................//

// ................................... start THREE JS FPS code ....................................................//
function myfunction(){
  var script=document.createElement('script');
  script.onload=function(){
    var stats=new Stats();document.body.appendChild(stats.dom);
    requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};
    script.src='//mrdoob.github.io/stats.js/build/stats.min.js';document.head.appendChild(script);
}

myfunction();
// ................................... End THREE JS FPS code ....................................................//

///................................... Start THREE JS Helper functions for loading ...............///
const onProgress = function ( xhr ) {

  if ( xhr.lengthComputable ) {

      const percentComplete = xhr.loaded / xhr.total * 100;

  }

};

const onError = function () { };

///................................... End THREE JS Helper functions for loading ...............///


///................................... Start THREE JS OBJ loader ...............///

const manager = new THREE.LoadingManager();
manager.addHandler( /\.dds$/i, new DDSLoader() );

var shoe_object = "notloaded_yet";
var shoe_object_left = "notloaded_yet"


// left shoe object loader
new MTLLoader( manager )
	.setPath( 'models/main_shoe/' )
	.load( 'mainshoe.mtl', function ( materials ) {
		materials.preload();

		new OBJLoader( manager )
		.setMaterials( materials )
		.setPath( 'models/main_shoe/' )
		.load( 'mainshoe.obj', function ( object ) {

		
        object.scale.set(parseInt(Math.cbrt(window.innerWidth/0.00046)), parseInt (Math.cbrt(window.innerWidth/0.00046)), parseInt (Math.cbrt(window.innerWidth/0.00046)));
        
        object.rotation.y += -90*(Math.PI/180);

        shoe_object = object;
		scene.add( object );
    // shoe_object.visible = false;
        
		}, onProgress, onError );

		} );



// left shoe object loader
new MTLLoader( manager )
	.setPath( 'models/main_shoe/' )
	.load( 'mainshoe.mtl', function ( materials ) {
		materials.preload();

		new OBJLoader( manager )
		.setMaterials( materials )
		.setPath( 'models/main_shoe/' )
		.load( 'mainshoe.obj', function ( object ) {

        object.scale.set(parseInt(Math.cbrt(window.innerWidth/0.00046)), parseInt (Math.cbrt(window.innerWidth/0.00046)), parseInt (Math.cbrt(window.innerWidth/0.00046)));
        
        object.rotation.y += -90*(Math.PI/180);

        shoe_object_left = object;
		scene.add( object );
    // shoe_object_left.visible = false;

		}, onProgress, onError );

		} );




camera.position.z = 3;
///................................... End THREE JS OBJ loader ...............///

///................................... Start THREE JS OBJ Lighting ...............///
// Directional Light
{
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
}
///................................... End THREE JS OBJ Lighting ...............///


const video = document.getElementById('webcam');
const liveView = document.getElementById('liveView');
const demosSection = document.getElementById('demos');
const enableWebcamButton = document.getElementById('webcamButton');
var vidHeight = 1920
var vidWidth=1080
var xStart = 0
var yStart = 0

tf.setBackend('webgl');

// Check if webcam access is supported.
function getUserMediaSupported() {
    return !!(navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia);
  }
  
  // If webcam supported, add event listener to button for when user
  // wants to activate it to call enableCam function which we will 
  // define in the next step.
  if (getUserMediaSupported()) {
    enableWebcamButton.addEventListener('click', enableCam);
  } else {
    console.warn('getUserMedia() is not supported by your browser');
  }

var started = 0

var video_started = 0

  // Enable the live webcam view and start classification.
function enableCam(event) {
    // Only continue if the COCO-SSD has finished loading.

  if (started === 0){
      started = 1;
      document.getElementById("webcamButton").innerHTML = "Stop Camera";
      if (!model) {
        return;
      }
      
      // Hide the button once clicked.
      event.target.classList.add('removed');  

      // width: { ideal: 2000 }, 
      //     height: { ideal: 900 }
      
      // getUsermedia parameters to force video but not audio.
      const constraints = {
        audio: false,
        video: {
          facingMode: "environment" ,
          width: { ideal: 640 }, 
          height: { ideal: 330 }
        },
      };
    
      // Activate the webcam stream.
      navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
        video.srcObject = stream;
        
        // video.addEventListener('loadeddata', predictWebcamTF);
        video.onloadeddata= (event) => {
          video_started =1
          predictWebcamTF();
        };
      });

  }

  else if (started === 1){


    // A video's MediaStream object is available through its srcObject attribute
    const mediaStream = video.srcObject;

    // Through the MediaStream, you can get the MediaStreamTracks with getTracks():
    const tracks = mediaStream.getTracks();

    
    

    //Tracks are returned as an array, so if you know you only have one, you can stop it with Or stop all like so:
    tracks.forEach(track => track.stop())

    started = 0
    document.getElementById("webcamButton").innerHTML = "Start Camera";
    location.reload();
  }
  }

  var children = [];

  function predictWebcamTF() {
    
      // Now let's start classifying a frame in the stream.
    detectTFMOBILE(video).then(function () {
      
        // Call this function again to keep predicting when the browser is ready.
        window.requestAnimationFrame(predictWebcamTF);
    });
    
  }


//.......................My name.................................
// function drawImge(minX,minY){
//     var video = document.querySelector("#webcam");
//     var canvas = document.querySelector("#videoCanvas");
//     var ctx = canvas.getContext('2d');

//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;


//     ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

//     var faceArea = 300;
//     var pX=canvas.width/2 - faceArea/2;
//     var pY=canvas.height/2 - faceArea/2;

//     ctx.rect(minX,minY,faceArea,faceArea);
//     ctx.lineWidth = "6";
//     ctx.strokeStyle = "red";    
//     ctx.stroke();

// }
//...............................................................

//Function Renders boxes around the detections:
function renderPredictionBoxes (predictionBoxes, predictionClasses, predictionScores)
{
    //Remove all detections:
    for (let i = 0; i < children.length; i++) {
        liveView.removeChild(children[i]);
    }
    children.splice(0);

    let top_i = predictionScores.indexOf(Math.max(...predictionScores))
    let second_top_arr = JSON.parse(JSON.stringify(predictionScores));
    second_top_arr.splice(top_i,1)
    let two_top_i = predictionScores.indexOf(Math.max(...second_top_arr))

    var indices = [top_i,two_top_i]

    for (let i = 0; i < 2; i++) {
      // console.log(predictionScores.length)
        

      if (predictionScores[indices[i]]*100 > 55 && predictionScores[indices[i]]*100 <= 100){
         

      const minY = (predictionBoxes[indices[i]][0] * video.videoHeight).toFixed(0);
      const minX = (predictionBoxes[indices[i]][1] * video.videoWidth).toFixed(0);
      const maxY = (predictionBoxes[indices[i]][2] * video.videoHeight).toFixed(0);
      const maxX = (predictionBoxes[indices[i]][3] * video.videoWidth ).toFixed(0);
      const score = predictionScores[indices[i]] * 100;
      const width_ = (maxX-minX)
      const height_ = (maxY-minY)

      if (i === 0){
        var tmpGeometry = new THREE.PlaneGeometry(1000, 1000, 1, 1);
        tmpGeometry.position = new THREE.Vector3(0, 0, 0);
        var tmpMesh = new THREE.Mesh(tmpGeometry);

        var spherevectorcoord = new THREE.Vector3( ((predictionBoxes[indices[i]][1]+predictionBoxes[indices[i]][3])/2)*2-1, -((predictionBoxes[indices[i]][0]+predictionBoxes[indices[i]][2])/2)*2+1, 0.0);
        spherevectorcoord.unproject(camera);
        var norm = spherevectorcoord.sub(camera.position).normalize();
        var ray = new THREE.Raycaster(camera.position, norm);
        var intersects = ray.intersectObject(tmpMesh);
        
        if (shoe_object !== "notloaded_yet"){
          shoe_object.position.x = intersects[0].point.x 
          shoe_object.position.y = intersects[0].point.y 
          shoe_object.position.z=0
          // shoe_object.rotation.y =
          
          shoe_object.rotation.y=-275*(Math.PI/180);
          shoe_object.rotation.z=45
          //
          shoe_object.scale.set(parseInt(Math.cbrt(window.innerWidth/0.00046)), parseInt (Math.cbrt(window.innerWidth/0.00046)), parseInt (Math.cbrt(window.innerWidth/0.00046)));
          
      }

    }

      if (i === 1){
        var tmpGeometry = new THREE.PlaneGeometry(1000, 1000, 1, 1);
        tmpGeometry.position = new THREE.Vector3(0, 0, 0);
        var tmpMesh = new THREE.Mesh(tmpGeometry);

        var spherevectorcoord_left = new THREE.Vector3( ((predictionBoxes[indices[i]][1]+predictionBoxes[indices[i]][3])/2)*2-1, -((predictionBoxes[indices[i]][0]+predictionBoxes[indices[i]][2])/2)*2+1, 0.0);
        spherevectorcoord_left.unproject(camera);
        var norm_left = spherevectorcoord_left.sub(camera.position).normalize();
        var ray_left = new THREE.Raycaster(camera.position, norm_left);
        var intersects_left = ray_left.intersectObject(tmpMesh);
        
        if (shoe_object !== "notloaded_yet"){
          shoe_object_left.position.x = intersects_left[0].point.x 
          shoe_object_left.position.y = intersects_left[0].point.y 
          shoe_object_left.rotation.y=-275*(Math.PI/180);
          shoe_object_left.rotation.z=45
          // 
          shoe_object_left.scale.set(parseInt(Math.cbrt(window.innerWidth/0.00046)), parseInt (Math.cbrt(window.innerWidth/0.00046)), parseInt (Math.cbrt(window.innerWidth/0.00046)));
          
      }
      
    }
     

      
      // const highlighter = document.createElement('div');
      // highlighter.setAttribute('class', 'highlighter');
      // highlighter.style = 'left: ' + minX + 'px; ' +
      //     'top: ' + minY + 'px; ' +
      //     'width: ' + width_ + 'px; ' +
      //     'height: ' + height_ + 'px;';
      // highlighter.innerHTML = '<p>'+Math.round(score) + '% ' + 'foot'+"width:"+video.videoWidth.toString()+ " height:" +video.videoHeight.toString() +'</p>';
      // liveView.appendChild(highlighter);
      // children.push(highlighter);
      }
  }
//Loop through predictions and draw them to the live view if they have a high confidence score.
    // for (let i = 0; i < 99; i++) {
        

    //     if (predictionScores[i]*100 > 65 && predictionScores[i]*100 <= 100){

    //     const minY = (predictionBoxes[i][0] * video.videoHeight).toFixed(0);
    //     const minX = (predictionBoxes[i][1] * video.videoWidth).toFixed(0);
    //     const maxY = (predictionBoxes[i][2] * video.videoHeight).toFixed(0);
    //     const maxX = (predictionBoxes[i][3] * video.videoWidth ).toFixed(0);
    //     const score = predictionScores[i] * 100;
    //     const width_ = (maxX-minX)
    //     const height_ = (maxY-minY)
       

        
    //     const highlighter = document.createElement('div');
    //     highlighter.setAttribute('class', 'highlighter');
    //     highlighter.style = 'left: ' + minX + 'px; ' +
    //         'top: ' + minY + 'px; ' +
    //         'width: ' + width_ + 'px; ' +
    //         'height: ' + height_ + 'px;';
    //     highlighter.innerHTML = '<p>'+Math.round(score) + '% ' + 'foot'+"width:"+video.videoWidth.toString()+ " height:" +video.videoHeight.toString() +'</p>';
    //     liveView.appendChild(highlighter);
    //     children.push(highlighter);
    //     }
    // }
}

const canvas = document.createElement("canvas");
// var update =function (){
//     ///................................... Start THREE JS Background Image...............///
  
//   if (video_started === 1){
//   // console.log("hi")
//   // scale the canvas accordingly
//   canvas.width = video.videoWidth;
//   canvas.height = video.videoHeight;
//   // draw the video at that frame
//   canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
//   // convert it to a usable data URL
//   const dataURL = canvas.toDataURL();
//   //  console.log(dataURL)
//   // Background Image
//   var imgsrc=dataURL;
//   var bgTexture = new THREE.TextureLoader().load(imgsrc,
//       function ( texture ) {
//         scene.background = texture;
//       } );
  

//   // shoe_object_left.rotation.y += 0.01
//   }
  

//   ///................................... End THREE JS Background Image...............///
// }

// ..............................................................

const imageSize = 320;


//Match prob. threshold for object detection:
var classProbThreshold = 0.75;//40%
//Image detects object that matches the preset:
async function detectTFMOBILE(imgToPredict) {

    ///................................... Start THREE JS Background Image...............///
  
    if (video_started === 1){
      // console.log("hi")
      // scale the canvas accordingly
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      // draw the video at that frame
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
      // convert it to a usable data URL
      const dataURL = canvas.toDataURL();
      //  console.log(dataURL)
      // Background Image
      var imgsrc=dataURL;
      var bgTexture = new THREE.TextureLoader().load(imgsrc,
          function ( texture ) {
            scene.background = texture;
          } );
      
    
      // shoe_object_left.rotation.y += 0.01
      }
      
    
      ///................................... End THREE JS Background Image...............///



  tf.engine().startScope()

    //Get next video frame:
    await tf.nextFrame();

    //another tensor for background
    // const newtfImg = tf.browser.fromPixels(imgToPredict);
    // newtfImg.dispose();
    // console.log([await newtfImg.array()]);
    
    //Create tensor from image:
    const tfImg = tf.browser.fromPixels(imgToPredict);
    // console.log(await tfImg.array());
    //Create smaller image which fits the detection size
    const smallImg = tf.image.resizeBilinear(tfImg, [video.videoHeight,video.videoWidth]);


    const resized = tf.cast(smallImg, 'int32');
    var tf4d_ = tf.tensor4d(Array.from(resized.dataSync()), [1,video.videoHeight, video.videoWidth, 3]);
    const tf4d = tf.cast(tf4d_, 'int32');


    
    //Perform the detection with your layer model:
    let predictions = await model.executeAsync(tf4d);
    // console.log(await predictions[2].array())
    

    const boxes = await predictions[6].array()
    const classes = await predictions[3].array()
    const scores = await predictions[2].array()

    // console.log(await predictions[6].array())
    
    //Draw box around the detected object:
    renderPredictionBoxes(boxes[0], classes[0], scores[0]);
    //Dispose of the tensors (so it won't consume memory)
    tfImg.dispose();
    smallImg.dispose();
    resized.dispose();
    tf4d.dispose();
    tf.dispose(predictions);
    
    tf.engine().endScope();
}



// https://storage.googleapis.com/mybucket_tfjs/model.json
var model = undefined;
var model_url = 'https://raw.githubusercontent.com/luckyiron/luckyiron.github.io/main/tfjsexportmodel/model.json';
//Call load function
asyncLoadModel(model_url);

//Function Loads the GraphModel type model of
async function asyncLoadModel(model_url) {
    model = await tf.loadGraphModel(model_url);
    console.log('Model loaded');
    // //Enable start button:
    // enableWebcamButton.classList.remove('invisible');
    // enableWebcamButton.innerHTML = 'Start camera';
    // Show demo section now model is ready to use.
    // demosSection.classList.remove('invisible');
    // document.getElementById("demos").classList.remove('invisible');
    document.getElementById("webcamButton").classList.remove("disabled");
    document.getElementById("webcamButton").classList.remove("btn-secondary");
    document.getElementById("webcamButton").classList.add("btn-info");
    document.getElementById("webcamButton").innerHTML = "Start Camera";
}
  
// draw Scene
var render = function()
{
    renderer.render(scene,camera);
};

// run game loop (update, render, repeat)
var GameLoop = function()
{
    requestAnimationFrame(GameLoop);
    // update();
    render();
};

GameLoop();