const socket = io();

const myFace = document.getElementById("myFace");
const cameraBtn = document.getElementById("camera");
const camerasSelect = document.getElementById("cameras");
const call = document.getElementById("call");
const peerFace = document.getElementById("peerFace");
const cameraResolutionSelect = document.getElementById("resolutions");
// const enterButton = document.getElementById("Enter");

call.hidden = true;

let myStream;
let muted = false;
let cameraOff = false;
let roomName;
let myPeerConnection;
let myDataChannel;

// Use the "exact" keyword to use the exact camera resolution e.g. video: {width: {exact: 7680}, height: {exact: 4320}}
const videoResolutionPresetJson = {
  "SVGA (800×600)": {
    video: {frameRate: {min: 30}, width: 800, height: 600}
  },

  "HD": {
    video: {frameRate: {min: 30}, width: 1280, height: 720}
  },

  "FHD": {
    video: {frameRate: {min: 30}, width: 1920, height: 1080}
  },

  "Phone (4000×3000)": {
    video: {frameRate: {min: 30}, width: 4000, height: 3000}
  },

  "Phone (2208×2944)": {
    video: {frameRate: {min: 30}, width: 2208, height: 2944}
  },

  "4K": {
    video: {frameRate: {min: 30}, width: 3840, height: 720}
  },

  "8K": { 
    video: {frameRate: {min: 30}, width: 7680, height: 4320}
 }
}

async function initResolutionConfiguration() {
  for (key in videoResolutionPresetJson) {
    const option = document.createElement("option");
    option.value = key;
    option.innerText = key;
    cameraResolutionSelect.appendChild(option);
  }
}

async function getCameras() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter((device) => device.kind === "videoinput");
    cameras.forEach((camera) => {
      const option = document.createElement("option");
      option.value = camera.deviceId;
      option.innerText = camera.label;
      camerasSelect.appendChild(option);
    });
  } catch (e) {
    console.log(e);
  }
}

async function getMedia(deviceId, resConstraint) {
  const initialConstrains = {
    audio: false,
    video: { frameRate: {min: 30}, width: {ideal: 1920}, height: {ideal: 1080}, facingMode: "environment" },
  };
  const cameraConstraints = {
    audio: false,
    video: { frameRate: {min: 30}, width: {ideal: 1920}, height: {ideal: 1080}, deviceId: { exact: deviceId } },
  };
  try {
    let constraint;
    if (resConstraint !== undefined) {
      resConstraint.video.deviceId = {exact: camerasSelect.value};
      constraint = resConstraint;
    } else if (deviceId) {
      constraint = cameraConstraints;
    } else {
      constraint = initialConstrains;
    }

    //Screen Sharing Codes
    /*myStream = await navigator.mediaDevices.getDisplayMedia(
      displayMediaOptions
    );*/
    myStream = await navigator.mediaDevices.getUserMedia(constraint);
    myFace.srcObject = myStream;

    if(myPeerConnection) {
      const videoTrack = myStream.getVideoTracks()[0];
      const videoSender = myPeerConnection
        .getSenders()
        .find((sender) => sender.track.kind === "video");
      videoSender.replaceTrack(videoTrack);
    }
    if (!deviceId) {
      await getCameras();
    }
  } catch (e) {
    console.log(e);
  }
}

function handleMuteClick() {
  myStream
    .getAudioTracks()
    .forEach((track) => (track.enabled = !track.enabled));
  if (!muted) {
    muteBtn.innerText = "Unmute";
    muted = true;
  } else {
    muteBtn.innerText = "Mute";
    muted = false;
  }
}

function handleCameraClick() {
  myStream
    .getVideoTracks()
    .forEach((track) => (track.enabled = !track.enabled));
  if (cameraOff) {
    cameraBtn.innerText = "Turn Camera Off";
    cameraOff = false;
  } else {
    cameraBtn.innerText = "Turn Camera On";
    cameraOff = true;
  }
}

async function handleCameraChange() {
  await getMedia(camerasSelect.value);
  if (myPeerConnection) {
    const videoTrack = myStream.getVideoTracks()[0];
    const videoSender = myPeerConnection
      .getSenders()
      .find((sender) => sender.track.kind === "video");
    videoSender.replaceTrack(videoTrack);
  }
}

async function handleCameraResolutionChange() {
  const constraint = videoResolutionPresetJson[cameraResolutionSelect.value];
  myStream.getVideoTracks().forEach((track) => {track.stop()});
  const deviceId = camerasSelect.value

  getMedia(deviceId, constraint)
}

cameraBtn.addEventListener("click", handleCameraClick);
camerasSelect.addEventListener("input", handleCameraChange);
cameraResolutionSelect.addEventListener("input", handleCameraResolutionChange);
// enterButton.addEventListener("click", () => handleWithoutPasswordWelcomeSubmit())
myFace.addEventListener('loadedmetadata', function() {
  console.log(`Local video videoWidth: ${this.videoWidth}px,  videoHeight: ${this.videoHeight}px`);
});
screen.addEventListener(
  "click",
  (evt) => {
    startCapture();
  },
  false
);
/* 작동 안함
mr.addEventListener("onDataAvailable", (event) => {
  videoArray.push(event.data);
});
mr.addEventListener("onStop", (event) => {
  // 녹음이 종료되면, 배열에 담긴 오디오 데이터(Blob)들을 합친다: 코덱도 설정해준다.
  const blob = new Blob(audioArray, {"type": "audio/ogg codecs=opus"});
  audioArray.splice(0); // 기존 오디오 데이터들은 모두 비워 초기화한다.
  
  // Blob 데이터에 접근할 수 있는 객체URL을 생성한다.
  const blobURL = window.URL.createObjectURL(blob);

  // audio엘리먼트로 재생한다.
  $audioEl.src = blobURL;
  $audioEl.play();
});
*/

// Welcome Form (join a room)

const welcome = document.getElementById("welcome");
const welcomeForm = welcome.querySelector("form");

async function initCall() {
  welcome.hidden = true;
  call.hidden = false;
  await getMedia();
  makeConnection();
  await initResolutionConfiguration();
}

async function handleWelcomeSubmit(event) {
  event.preventDefault();
  const input = welcomeForm.querySelector("input");
  await initCall();
  socket.emit("join_room", input.value);
  roomName = input.value;
  input.value = "";
}

async function handleWithoutPasswordWelcomeSubmit(event) {
  await initCall();
  roomName = "publicRoom";
  socket.emit("join_room", roomName);
}

welcomeForm.addEventListener("submit", handleWelcomeSubmit);

// Socket Code

socket.on("welcome", async () => {
  myDataChannel = myPeerConnection.createDataChannel("chat");
  myDataChannel.addEventListener("message", (event) => console.log(event.data));
  console.log("made data channel");
  const offer = await myPeerConnection.createOffer();
  myPeerConnection.setLocalDescription(offer);
  console.log("sent the offer");
  socket.emit("offer", offer, roomName);
});

socket.on("offer", async (offer) => {
  myPeerConnection.addEventListener("datachannel", (event) => {
    myDataChannel = event.channel;
    myDataChannel.addEventListener("message", (event) =>
      console.log(event.data)
    );
  });
  console.log("received the offer");
  myPeerConnection.setRemoteDescription(offer);
  const answer = await myPeerConnection.createAnswer();
  myPeerConnection.setLocalDescription(answer);
  socket.emit("answer", answer, roomName);
  console.log("sent the answer");
});

socket.on("answer", (answer) => {
  console.log("received the answer");
  myPeerConnection.setRemoteDescription(answer);
});

socket.on("ice", (ice) => {
  console.log("received candidate");
  myPeerConnection.addIceCandidate(ice);
});

socket.on("streamIndex", (streamIndex) => {

});

// RTC Code

function makeConnection() {
  myPeerConnection = new RTCPeerConnection({
    iceServers: [
      {
        urls: [
          "stun:stun.l.google.com:19302",
          "stun:stun1.l.google.com:19302",
          "stun:stun2.l.google.com:19302",
          "stun:stun3.l.google.com:19302",
          "stun:stun4.l.google.com:19302",
        ],
      },
    ],
  });
  myPeerConnection.addEventListener("icecandidate", handleIce);
  myPeerConnection.addEventListener("addstream", handleAddStream);
  myPeerConnection.addEventListener("connectionstatechange", (event) => {
    switch (myPeerConnection.connectionState) {
      case "new": console.log("myPeerConnection state: new"); break;
      case "checking": console.log("myPeerConnection state: checking"); break;
      case "connected": socket.emit("connected");  console.log("myPeerConnection state: connected"); break;
      case "disconnected": socket.emit("disconnected");  console.log("myPeerConnection state: disconnected"); break;
      case "closed": console.log("myPeerConnection state: closed"); break;
      case "failed": console.log("myPeerConnection state: failed"); break;
      default: console.log("myPeerConnection state: Unknown"); break;
    }
  })
  myStream
    .getTracks()
    .forEach((track) => myPeerConnection.addTrack(track, myStream));
}

function handleIce(data) {
  console.log("sent candidate");
  socket.emit("ice", data.candidate, roomName);
}

function handleAddStream(data) {
  peerFace.srcObject = data.stream;
}