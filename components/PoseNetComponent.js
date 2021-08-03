import * as tf from '@tensorflow/tfjs';
import * as posenet from '@tensorflow-models/posenet';
import React from 'react';
import Webcam from 'react-webcam';
import Script from 'next/script'
import { drawKeypoints, drawSkeleton } from './../components/tsUtils';
export default function App() {
  const webcamRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const [count, setCount] = React.useState(0)

  const detectWebcamFeed = async (posenet_model) => {
    if (
      typeof webcamRef.current !== 'undefined' &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;
      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;
      // Make Estimation
      const pose = await posenet_model.estimateMultiplePoses(video, {
        flipHorizontal: false,
        maxDetections: 5,
        scoreThreshold: 0.7,
        nmsRadius: 20,
      });
      console.log(pose);
      setCount(pose.length)
      drawResult(pose, video, videoWidth, videoHeight, canvasRef);
    }
  };
  const runPosenet = async () => {
    const posenet_model = await posenet.load({
      inputResolution: { width: 640, height: 480 },
      scale: 0.8,
    });
    //
    setInterval(() => {
      detectWebcamFeed(posenet_model);
    }, 100);
  };
  runPosenet();
  const drawResult = (pose, video, videoWidth, videoHeight, canvas) => {
    const ctx = canvas.current.getContext('2d');
    canvas.current.width = videoWidth;
    canvas.current.height = videoHeight;
    for(let i=0; i < pose.length; i++){
    drawKeypoints(pose[i]['keypoints'], 0.6, ctx);
    drawSkeleton(pose[i]['keypoints'], 0.7, ctx);
  }
  };
  return (
    <div className="App">
      <Script src="https://unpkg.com/ml5@0.1.1/dist/ml5.min.js"/>
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          style={{
            position: 'absolute',
            marginLeft: 'auto',
            marginRight: 'auto',
            left: 0,
            right: 0,
            textAlign: 'center',
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            marginLeft: 'auto',
            marginRight: 'auto',
            left: 0,
            right: 0,
            textAlign: 'center',
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />
      </header>
      <h1>{count}</h1>
    </div>
  );
}
