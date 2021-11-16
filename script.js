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

  // Enable the live webcam view and start classification.
function enableCam(event) {
    // Only continue if the COCO-SSD has finished loading.
    if (!model) {
      return;
    }
    
    // Hide the button once clicked.
    event.target.classList.add('removed');  
    
    // getUsermedia parameters to force video but not audio.
    const constraints = {
      video: {
        facingMode: "environment" ,
        width: { ideal: 1080 }, 
        height: { ideal: 1920 }
      },
    };
  
    // Activate the webcam stream.
    navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
      video.srcObject = stream;
      
      video.addEventListener('loadeddata', predictWebcamTF);
    });
  }

  var children = [];

  function predictWebcamTF() {
    
      // Now let's start classifying a frame in the stream.
    detectTFMOBILE(video).then(function () {
      window.alert("hi"+video.videoWidth.toString()+video.videoHeight.toString());
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
//Loop through predictions and draw them to the live view if they have a high confidence score.
    for (let i = 0; i < 99; i++) {
        
//If we are over 66% sure we are sure we classified it right, draw it!
        
//If confidence is above 70%
        if (predictionScores[i]*100 > 75 && predictionScores[i]*100 <= 100){
            // console.log("hi",video.videoWidth,video.videoHeight)
            // console.log(predictionBoxes[i],predictionClasses[i],predictionScores[i])

        const minY = (predictionBoxes[i][0] * video.videoHeight).toFixed(0);
        const minX = (predictionBoxes[i][1] * video.videoWidth).toFixed(0);
        const maxY = (predictionBoxes[i][2] * video.videoHeight).toFixed(0);
        const maxX = (predictionBoxes[i][3] * video.videoWidth ).toFixed(0);
        const score = predictionScores[i] * 100;
        const width_ = (maxX-minX)
        const height_ = (maxY-minY)
        console.log(minX,minY,maxX,maxY)

        // drawImge(minX,minY);

        
        const highlighter = document.createElement('div');
        highlighter.setAttribute('class', 'highlighter');
        highlighter.style = 'left: ' + minX + 'px; ' +
            'top: ' + minY + 'px; ' +
            'width: ' + width_ + 'px; ' +
            'height: ' + height_ + 'px;';
        highlighter.innerHTML = '<p>'+Math.round(score) + '% ' + 'foot'+'</p>';
        liveView.appendChild(highlighter);
        children.push(highlighter);
        }
    }
}

// ..............................................................

const imageSize = 320;

//Match prob. threshold for object detection:
var classProbThreshold = 0.75;//40%
//Image detects object that matches the preset:
async function detectTFMOBILE(imgToPredict) {

    //Get next video frame:
    await tf.nextFrame();
    //Create tensor from image:
    const tfImg = tf.browser.fromPixels(imgToPredict);

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
    
}



// https://storage.googleapis.com/mybucket_tfjs/model.json
var model = undefined;
model_url = 'https://raw.githubusercontent.com/luckyiron/luckyiron.github.io/main/tfjsexportmodel/model.json';
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
    document.getElementById("demos").classList.remove('invisible');
}
  
