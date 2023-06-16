![GitHub](https://img.shields.io/github/license/lhh9799/CameraServer)
![](https://img.shields.io/badge/status-terminated-red)

# Video Call Server
A P2P Video Call Server that utilizes NodeJS, WebRTC and Socket.IO.

# Table of Contents
* [Demo](#Demo)
* [Verified Environment](#verified-environment)
* [Installation](#installation)
* [How to run](#how-to-run)

# Demo
    Make sure to enter your own domain address. "cana.p-e.kr" is an example.

<center class="half">
  <a href="link"><img src="https://github.com/lhh9799/CameraServer/assets/77262005/338fb048-7b05-42de-9675-41d4d618b3ce" height = "600"></a>
  <a href="link"><img src="https://github.com/lhh9799/CameraServer/assets/77262005/07ec8bbb-0980-4565-8ac3-e7dd4eb52414" height = "600"></a>
</center>
    
# Verified Environment
    Windows 10 Pro
    Version 22H2
    OS Build 19045.3031
    Processor: AMD Ryzen 5 PRO 4650G with Radeon Graphics   3.70 GHz

# Installation
### 1. clone this repository.
    git clone https://github.com/lhh9799/CameraServer.git
    
### 2. Install [Node.js](https://nodejs.org/en).
### 3. Install dependencies.  
&emsp; Open a terminal in the path where ```package.json``` file exists and type the followings

    npm install --no-audit
    npm i nodemon -D
    npm i @babel/core @babel/cli @babel/node -D
    npm i express
    npm i pug
    npm i dotenv
    npm i createServer
    npm i fs
    
### 4. Set Up Port Forwarding  
####    &emsp; If you are using a router, you need to set up port forwarding.
####    &emsp; Since my router doesn't support multiple languages, I couldn't take Screenshots in English. Sorry.

<details>
<summary>How to Set up Port Forwarding (ipTIME router)</summary>
<div markdown="1">

    (1) Access the router's admin page  
![두 이미지 합성](https://github.com/lhh9799/CameraServer/assets/77262005/81251ef1-2bcd-41b8-8134-3f66a8846282)
    
    (2) Login
![mod_Screenshot 2023-06-03 at 14 28 39](https://github.com/lhh9799/CameraServer/assets/77262005/882de249-8225-4454-a511-fe8ad34b2269)

    (3) Click left icon "관리도구"
![mod_Screenshot 2023-06-03 at 14 28 43](https://github.com/lhh9799/CameraServer/assets/77262005/11e7af1f-5d0d-4476-bfe4-0bccefc28e02)

    (4) Expand tree menu and fill out the rules.
![mod_Screenshot 2023-06-03 at 14 31 50 복사](https://github.com/lhh9799/CameraServer/assets/77262005/d552f54a-312c-400b-a4aa-5301449a1d3a)


    (5) Don't forget to hit save button.
![mod_Screenshot 2023-06-03 at 14 31 52 복사](https://github.com/lhh9799/CameraServer/assets/77262005/18296cd7-f424-4dff-8339-7eab1ae85728)

    (6) Port forwarding compelete.
![mod_Screenshot 2023-06-03 at 14 32 41 복사](https://github.com/lhh9799/CameraServer/assets/77262005/39c4b69a-d92d-49a5-9322-fb11159f8a76)

</div>
</details>
<br>

### 5. Start your server by typing "npm run dev" in TERMINAL <br>
### <br>
### 6. Register a Domain Name for Your Website.
### <br>
### 7. Download [WIN-ACME](https://www.win-acme.com/) and unzip the file to convenient directory.
### <br>
### 8. Set up WIN-ACME -Please refer to the screenshot below

<details>
<summary>WIN-ACME Setup Screenshots</summary>
<div markdown="1">

![narrow](https://github.com/lhh9799/CameraServer/assets/77262005/1bc5d6f7-21f1-4f3c-a5ff-eca75c99d9cd)
</div>
</details>
<br>

Note that
>There is a **Failed Validation limit** of 5 failures per account, per hostname, per hour. You can find out Rate Limits [here](https://letsencrypt.org/docs/rate-limits/).  
Keep Port 80 Open if you are going to request HTTP validation. (which is the method I used.)


# How to run
### 1. Proceed with the installation
### 2. Type "npm run dev" in TERMINAL (Directory: Where server.js locates.)
### 3. Open "https://localhost:443/" or type your Domain name in browser.