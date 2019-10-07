/*
*  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
*
*  Use of this source code is governed by a BSD-style license
*  that can be found in the LICENSE file in the root of the source
*  tree.
*/

// This code is adapted from
// https://rawgit.com/Miguelao/demos/master/mediarecorder.html

'use strict';

/* globals MediaRecorder */

const mediaSource = new MediaSource();
mediaSource.addEventListener('sourceopen', handleSourceOpen, false);
let mediaRecorder;
let recordedBlobs;
let sourceBuffer;

const errorMsgElement = document.querySelector('span#errorMsg');
const recordedVideo = document.querySelector('video#recorded');
const recordButton = document.querySelector('button#record');
const coordsButton = document.querySelector('button#getPlayerCoords')
const videoPlayer = document.querySelector('video#gum');



//coordsButton.addEventListener('click', () => {
//	var rect = videoPlayer.getBoundingClientRect();
//	console.log(rect.top, rect.right, rect.bottom, rect.left);
//	var c = document.getElementById("videoCanvas");
//	c.width = 1280;
//	c.height = 720
//	var video = document.getElementById('gum')
//	var ctx = c.getContext("2d");
//		ctx.drawImage(video, 0, 0);
//		ctx.beginPath();
//		ctx.lineWidth = "6";
//		ctx.strokeStyle = "red";
//		ctx.rect(460, 200, 400, 400);
//		ctx.stroke();
//	});

recordButton.addEventListener('click', () => {
  if (recordButton.textContent === 'Start Recording') {
    startRecording();
    document.getElementById('gum').style.display = 'none';
	document.getElementById('videoCanvas').style.display = 'none';
    wrap();
  } else {
    stopRecording();
    stop();
    document.body.style.background = 'white';
    //clearInterval(intervalId);
    document.getElementById('gum').style.display = 'block';
    recordButton.textContent = 'Start Recording';
    //playButton.disabled = false;
    downloadButton.disabled = false;
    document.querySelector('p#text_two').hidden = true;
    document.querySelector('p#text_three').hidden = true;
    document.querySelector('p#text_four').hidden = false;
  }
});

//const playButton = document.querySelector('button#play');
//playButton.addEventListener('click', () => {
//  const superBuffer = new Blob(recordedBlobs, {type: 'video/webm'});
//  recordedVideo.src = null;
//  recordedVideo.srcObject = null;
//  recordedVideo.src = window.URL.createObjectURL(superBuffer);
//  recordedVideo.controls = true;
//  recordedVideo.play();
//});

const downloadButton = document.querySelector('button#download');
downloadButton.addEventListener('click', () => {
  const blob = new Blob(recordedBlobs, {type: 'video/webm'});
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = 'test.webm';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 100);
});

function handleSourceOpen(event) {
  console.log('MediaSource opened');
  sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp8"');
  console.log('Source buffer: ', sourceBuffer);
}

function handleDataAvailable(event) {
  if (event.data && event.data.size > 0) {
    recordedBlobs.push(event.data);
  }
}

function startRecording() {
  recordedBlobs = [];
  let options = {mimeType: 'video/webm;codecs=vp9'};
  if (!MediaRecorder.isTypeSupported(options.mimeType)) {
    console.error(`${options.mimeType} is not Supported`);
    errorMsgElement.innerHTML = `${options.mimeType} is not Supported`;
    options = {mimeType: 'video/webm;codecs=vp8'};
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      console.error(`${options.mimeType} is not Supported`);
      errorMsgElement.innerHTML = `${options.mimeType} is not Supported`;
      options = {mimeType: 'video/webm'};
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.error(`${options.mimeType} is not Supported`);
        errorMsgElement.innerHTML = `${options.mimeType} is not Supported`;
        options = {mimeType: ''};
      }
    }
  }

  try {
    mediaRecorder = new MediaRecorder(window.stream, options);
  } catch (e) {
    console.error('Exception while creating MediaRecorder:', e);
    errorMsgElement.innerHTML = `Exception while creating MediaRecorder: ${JSON.stringify(e)}`;
    return;
  }

  console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
  recordButton.textContent = 'Stop Recording';
  //playButton.disabled = true;
  downloadButton.disabled = true;
  mediaRecorder.onstop = (event) => {
    console.log('Recorder stopped: ', event);
  };
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.start(10); // collect 10ms of data
  console.log('MediaRecorder started', mediaRecorder);
}

function stopRecording() {
  mediaRecorder.stop();
  console.log('Recorded Blobs: ', recordedBlobs);
}

function handleSuccess(stream) {
  recordButton.disabled = false;
  console.log('getUserMedia() got stream:', stream);
  window.stream = stream;

  const gumVideo = document.querySelector('video#gum');
  gumVideo.srcObject = stream;
}

async function init(constraints) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    handleSuccess(stream);
  } catch (e) {
    console.error('navigator.getUserMedia error:', e);
    errorMsgElement.innerHTML = `navigator.getUserMedia error:${e.toString()}`;
  }
}

var flag = true;
var smileState = 0
function wrap() {
   setInterval(chBackcolor,2000);
   return innerIntervalId;
   }
function chBackcolor(color) {
   if (flag == true && smileState == 0) {
      document.body.style.background = 'white';
     smileState = 1;
   }
   else if (flag == true && smileState == 1){
      document.body.style.background = 'darkolivegreen';
	  smileState = 2;
   }
   else if (flag == true && smileState == 2){
   if (flag == true) {
   document.body.style.background = 'black';
   document.querySelector('p#text_two').style.color = 'white';
   document.querySelector('p#text_three').style.color = 'white';
   document.querySelector('p#text_four').style.color = 'white';
   flag = false
   }
   else {
   document.body.style.background = 'white';
   document.querySelector('p#text_two').style.color = 'black';
   document.querySelector('p#text_three').style.color = 'black';
   document.querySelector('p#text_four').style.color = 'black';
   flag = true
   }
}
document.querySelector('button#start').addEventListener('click', async () => {
  document.querySelector('p#text_one').hidden = true;
  document.querySelector('p#text_two').hidden = false;
  document.querySelector('p#text_three').hidden = false;
  //const hasEchoCancellation = document.querySelector('#echoCancellation').checked;
  const constraints = {
    audio: {
      //echoCancellation: {exact: hasEchoCancellation}
    },
    video: {
      width: 1280, height: 720
    }
  };
  console.log('Using media constraints:', constraints);
  await init(constraints);
  
});

window.onkeydown = function(event){
    if(event.keyCode === 32) {
        event.preventDefault();
        document.querySelector('button#record').click(); //This will trigger a click on the first <a> element.
    }
};

window.onkeydown = function(event){
    if(event.keyCode === 83) {
        event.preventDefault();
        document.querySelector('button#getPlayerCoords').click(); //This will trigger a click on the first <a> element.
    }
};

$(function() {
  var canvas = document.getElementById('videoCanvas');
  var ctx = canvas.getContext('2d');
  var video = document.getElementById('gum');
  var rect = videoPlayer.getBoundingClientRect();
  coordsButton.addEventListener('click', function() {
    var $this = video; //cache
	canvas.width = 1280;
	canvas.height = 720;
	console.log(rect.top, rect.right, rect.bottom, rect.left);
    (function loop() {
      if (!$this.paused && !$this.ended) {
        ctx.drawImage($this, 0, 0);

		ctx.beginPath();
		ctx.lineWidth = "6";
		ctx.strokeStyle = "red";
		//ctx.rect(384, 90, 512, 540);
		//ctx.rect(486.4, 144, 307.2, 432); 
		ctx.rect(448, 120, 384, 510); //big frame
		ctx.stroke();
        setTimeout(loop, 1000 / 30); // drawing at 30fps
      }
    })();
  }, 0);
});
