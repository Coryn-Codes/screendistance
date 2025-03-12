//document.addEventListener('DOMContentLoaded', () =>{
    const h1 = document.getElementById('header_id');
    const button2 = document.getElementById('button_2_id');
    const video = document.getElementById('camera_preview_id');
    const captureButton = document.getElementById('capture_button_id');
    const canvas = document.getElementById('photo_canvas_id');
    const photoImage = document.getElementById('photo_image_id');
    const imageDiv = document.getElementById('image_div_id');
    
`window.capture_test_button_function = function(n){
    console.log('this comes from capture.js');
    console.log(n);
    h1.innerHTML = "You pressed button 2! This is capture.js";
}`

button2.addEventListener('click', () =>{
    console.log('capture.js: button 2 is pressed');
    h1.innerHTML = 'capture.js: button 2 is pressed';
})

navigator.mediaDevices.getUserMedia({video: true})
    .then( (MediaStream) =>{
        video.srcObject = MediaStream;
    })
    .catch( (error) =>{
        // yo we fried
        console.error('Error accessing the camera:', error);
        alert('Unable to access the camera. Please ensure you have granted permission');
    });

// merged into hello.js - detectButton

/*
captureButton.addEventListener('click', () =>{
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const photoDataUrl = canvas.toDataURL('image/png');
    imageDiv.style.border = 'dotted black';
    h1.innerHTML = 'captured something 1';

    //imageDiv.style.backgroundImage = photoDataUrl;
    photoImage.src = photoDataUrl;
    });
//});
*/

