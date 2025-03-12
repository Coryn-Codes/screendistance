// python -m http.server 8000
// http://localhost:8000/hello.html
// ref: https://codepen.io/mediapipe-preview/pen/OJByWQr?editors=1010
// ctrl+F5 is clear cache refresh (just F5 doesnt do that)

/*
window.button_function = function(n){
    console.log('console is here');
    console.log(n);
    document.getElementById('header_id').innerHTML = "You pressed button 1! This is hello.js";
}
    */


//const button1 = document.getElementById('button_1_id');
const h1 = document.getElementById('header_id');
const detectButton = document.getElementById('detect_button_id');
const runningMode = "IMAGE";
const canvas = document.getElementById('photo_canvas_id');
const faceImage = document.getElementById('photo_image_id');
//const faceImage = canvas.toDataURL('image/png');
const imageDiv = document.getElementById('image_div_id');
const video = document.getElementById('camera_preview_id');
const captureButton = document.getElementById('capture_button_id');


navigator.mediaDevices.getUserMedia({video: true})
    .then( (MediaStream) =>{
        video.srcObject = MediaStream;
    })
    .catch( (error) =>{
        // yo we fried
        console.error('Error accessing the camera:', error);
        alert('Unable to access the camera. Please ensure you have granted permission');
    });



import {
    FaceDetector,
    FilesetResolver
    // Detection
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0";



// const demosSection = document.getElementById("demos");
// == remove the typscript? 
//let faceDetector: FaceDetector;
//let runningMode: string = "IMAGE";

// Initialize the object detector

let faceDetector = 0;
const initializefaceDetector = async () => {

    const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
    );
    faceDetector = await FaceDetector.createFromOptions(vision, {
        baseOptions: {
        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite`,
        delegate: "GPU"
        },
        runningMode: runningMode
    });
};
initializefaceDetector();

detectButton.addEventListener('click', detectChain);
// captureButton.addEventListener('click', capture);

function detectChain(event){
    console.log('detect is pressed')
    console.log(event);
    capture();
    faceImage.onload = handleDetectClick;
    
}

function capture(){
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const photoDataUrl = canvas.toDataURL('image/png');
    h1.innerHTML = 'captured something 1';
    faceImage.src = photoDataUrl;
};

async function handleDetectClick(event){
    console.log('handleDetectClick triggered');
    //console.log(event)
    h1.innerHTML = 'capture.js: detect button is pressed';
    //let detections = -1;
    try{
        const detections = faceDetector.detect(faceImage);
        console.log(detections);
        h1.innerHTML = detections;
        displayImageDetections(detections, imageDiv);
    }catch (error){
        console.error(error);
        console.log("detect fried");
        h1.innerHTML = error;
    }    
}

function point(x, y, context_used, size){
    // const context_used = canvas_used.getContext("2d");
    context_used.fillStyle = "cyan";
    context_used.fillRect(x-size/2,y-size/2,size,size);
}

function displayImageDetections(detections, resultElement){
    const ratio = resultElement.height / resultElement.naturalHeight;
    console.log(ratio);
    h1.innerHTML = "display image detections running"
    const context = canvas.getContext('2d');

    point(0, 0, context, 10);


    for (let detection of detections.detections){
        /*
        const p = document.createElement('p');
        p.setAttribute("class", "info");
        p.innerText = 
            "Confidence: " +
            Math.round(parseFloat(detection.categories[0].score) * 100) +
            "% .";
        p.style =
            "left: " +
            detection.boundingBox.originX * ratio +
            "px;" +
            "top: " +
            (detection.boundingBox.originY * ratio - 30) +
            "px; " +
            "width: " +
            (detection.boundingBox.width * ratio - 10) +
            "px;" +
            "hight: " +
            20 +
            "px;";
        const highlighter = document.createElement("div");
        highlighter.setAttribute("class", "highlighter");
        highlighter.style = 
            "left: " +
            detection.boundingBox.originX * ratio +
            "px;" +
            "top: " +
            detection.boundingBox.originY * ratio +
            "px;" +
            "width: " +
            detection.boundingBox.width * ratio +
            "px;" +
            "height: " +
            detection.boundingBox.height * ratio +
            "px;";
        
        resultElement.appendChild(highlighter);
        resultElement.appendChild(p);
        */
        for (let keypoint of detection.keypoints) {
            /*
            const keypointEl = document.createElement("span");
            keypointEl.className = "key-point";
            keypointEl.style.top = `${keypoint.y * resultElement.height - 3}px`;
            keypointEl.style.left = `${keypoint.x * resultElement.width - 3}px`;
            resultElement.appendChild(keypointEl);
            */
            // redo: draw directly on the canvas

            let x = canvas.width * keypoint.x;
            let y = canvas.height * keypoint.y;
            point(x, y, context, 3);

        }
    }
}


//ref: https://www.jsdelivr.com/package/npm/@mediapipe/tasks-vision
//import * as mediapipetasksVision from 'https://esm.run/@mediapipe/tasks-vision';
//console.log(mediapipetasksVision);
/*
async function async_function(){
    const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
    );
    const poseLandmarker = await PoseLandmarker.createFromModelPath(vision,
        "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task"
    );


    // const image = document.getElementById("image") as HTMLImageElement;
    // const landmarks = poseLandmarker.detect(image);
}

*/