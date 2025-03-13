// python -m http.server 8000
// http://localhost:8000/
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
let mean_calibrate_dist = 0;
let calibrate_dist = [];
let dist = -1;
let mode = 0; // 0: calibrate; 1: detect distance

const h1 = document.getElementById('header_id');
const detectButton = document.getElementById('detect_button_id');
const runningMode = "IMAGE";
const canvas = document.getElementById('photo_canvas_id');
const faceImage = document.getElementById('photo_image_id');
//const faceImage = canvas.toDataURL('image/png');
const imageDiv = document.getElementById('image_div_id');
const video = document.getElementById('camera_preview_id');
const captureButton = document.getElementById('capture_button_id');
const instructionH1 = document.getElementById('mode_header_id');
const verdictH1 = document.getElementById('verdict_header_id');


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

function get_dist(keypoint1, keypoint2){
    let x1 = keypoint1.x;
    let y1 = keypoint1.y;
    let x2 = keypoint2.x;
    let y2 = keypoint2.y;
    return (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2);
}

function point(x, y, context_used, size, color="cyan"){
    // const context_used = canvas_used.getContext("2d");
    context_used.fillStyle = color;
    context_used.fillRect(x-size/2,y-size/2,size,size);
}

function displayImageDetections(detections, resultElement){
    const ratio = resultElement.height / resultElement.naturalHeight;
    console.log(ratio);
    h1.innerHTML = "display image detections running"
    const context = canvas.getContext('2d');


    for (let detection of detections.detections){

        let colors = ["red", "green", "blue", "cyan", "#F0F8FF", "#7FFFD4"];
        let color_counter = 0;

        for (let keypoint of detection.keypoints) {

            let x = canvas.width * keypoint.x;
            let y = canvas.height * keypoint.y;
            point(x, y, context, 3, "#F0F8FF");
            color_counter = color_counter +1;

        }
        dist = get_dist(detection.keypoints[0], detection.keypoints[1]);
        console.log("distance:", dist);

        if (mode==0){
            calibrate_dist.push(dist);
            if (calibrate_dist.length>=3){
                mode = 1;
                instructionH1.innerHTML = "Calibration complete - press detect again to check if you are a safe distance away from your screen!";
                mean_calibrate_dist = 0;
                for (var i=0; i<calibrate_dist.length; i++){
                    mean_calibrate_dist += calibrate_dist[i];
                }
                mean_calibrate_dist /= calibrate_dist.length;
            }else{
                instructionH1.innerHTML = `Calibration mode - please take ${3-calibrate_dist.length} more photo${3-calibrate_dist.length==1? "": "s"} of yourself at a safe distance from the screen!`
            }
        }else{
            if (dist > mean_calibrate_dist * 1.2){
                verdictH1.style.display='block';
                verdictH1.innerHTML = "Don't be this close to the screen!";
                verdictH1.className = 'verdict-red';
            }else{
                //good
                verdictH1.style.display='block';
                verdictH1.innerHTML = "You are a safe distance from your screen! Keep it up!";
                verdictH1.className = 'verdict-green';
            }
        }


    }
    // TODO: update number of pics, 
}


