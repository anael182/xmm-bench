from datetime import datetime
from typing import Optional
from fastapi import FastAPI, Response, status
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import requests
from dotenv import load_dotenv
import os
import subprocess
import asyncio
import cv2


app = FastAPI()
load_dotenv()


origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class StatusResponse(BaseModel):
    message: str
    status: bool


class User(BaseModel):
    username: str


class Token(BaseModel):
    token_creation_date: str
    username: Optional[str] = None


#
# Webcam management
#

class WebcamRunner:

    def __init__(self):
        self.en_capture = True
        self.capture = cv2.VideoCapture(0)
        self.capture.set(cv2.CAP_PROP_FRAME_WIDTH, 800)
        self.capture.set(cv2.CAP_PROP_FRAME_HEIGHT, 600)

        self.current = None

    async def run_capture(self):
        while True:
            if self.en_capture:
                rc, img = self.capture.read()
                if not rc:
                    continue
                rc, array = cv2.imencode('.jpg', img)
                self.current = array.tobytes()
            else:
                self.current = None
            await asyncio.sleep(1/30)

    async def video_streamer(self):
        while True:
            yield b"--jpgboundary\r\n"+b'Content-Type: image/jpeg\r\n\r\n'+self.current
            await asyncio.sleep(1/30)


webcam_runner = WebcamRunner()


@app.on_event('startup')
async def app_startup():
    asyncio.create_task(webcam_runner.run_capture())


@app.get("/webcam")
# http://127.0.0.1:8000/webcam/
async def webcam():
    return StreamingResponse(
        webcam_runner.video_streamer(),
        media_type="multipart/x-mixed-replace; boundary=--jpgboundary",
    )


#
# Relays
#


XMM_RELAY_BIN = os.getenv("XMM_RELAY_BIN", "/home/korys/bin/xmm_relay")


@app.post("/relay/{name}")
# http://127.0.0.1:8000/relay/
def toggle_relay(name: str):
    if (name == 'flash'):
        r = subprocess.run([XMM_RELAY_BIN, "-f"])
    elif (name == 'power'):
        r = subprocess.run([XMM_RELAY_BIN, "-p"])
    elif (name == 'reboot'):
        r = subprocess.run([XMM_RELAY_BIN, "-r"])
    elif (name == 'cv22boot'):
        r = subprocess.run([XMM_RELAY_BIN, "-c"])
    elif (name == 'cv22flash'):
        r = subprocess.run([XMM_RELAY_BIN, "-v"])

    r = StatusResponse(message=r.stdout, status=r.returncode == 0)
    return r


#
# Token
#


token = None


@app.post("/reservation/take")
# http://127.0.0.1:8000/reservation/take
# JSON INPUT EXAMPLE {"username" : "Johndoe"}
def create_access_token(user: User, response: Response):
    global token
    now = datetime.now()
    if token is None:
        token = Token(
            access_token="im_the_token",
            token_creation_date=str(now.strftime("%d/%m/%Y %H:%M:%S")),
            username=user.username,
        )
        print("Creation du token : " + str(token))
        data = {
            "@type": "MessageCard",
            "@context": "http://schema.org/extensions",
            "themeColor": "0076D7",
            "summary": user.username + " is using the XMM-bench",
            "sections": [
                {
                    "activityTitle": user.username + " is using the XMM-bench",
                    "facts": [
                        {"name": "Assigned to", "value": user.username},
                        {
                            "name": "Date",
                            "value": str(now.strftime("%d/%m/%Y %H:%M:%S")),
                        },
                        {"name": "Status", "value": "XMM bench is busy"},
                    ],
                    "markdown": True,
                }
            ],
        }
        requests.post(url=os.getenv("WEBHOOK_URL"), json=data)
        return token
    else:
        response.status_code = status.HTTP_409_CONFLICT
        r = StatusResponse(
            message="Token is already taken by " + token.username, status=False
        )
        return r


@app.get("/reservation/state")
# http://127.0.0.1:8000/reservation/state
async def token_state():
    global token
    return token


@app.post("/reservation/release")
# http://127.0.0.1:8000/reservation/release
def release_token(response: Response):
    global token
    if token is None:
        response.status_code = status.HTTP_400_BAD_REQUEST
        r = StatusResponse(message="Token is already free", status=False)
        return r
    else:
        print("Last user => " + token.username)
        now = datetime.now()
        data = {
            "@type": "MessageCard",
            "@context": "http://schema.org/extensions",
            "themeColor": "0076D7",
            "summary": token.username + " just released the XMM-bench",
            "sections": [
                {
                    "activityTitle": token.username + " just released the XMM-bench",
                    "facts": [
                        {"name": "Assigned to", "value": token.username},
                        {
                            "name": "Date",
                            "value": str(now.strftime("%d/%m/%Y %H:%M:%S")),
                        },
                        {"name": "Status", "value": "XMM bench is free"},
                    ],
                    "markdown": True,
                }
            ],
        }
        requests.post(url=os.getenv("WEBHOOK_URL"), json=data)
        token = None
        r = StatusResponse(message="Token released", status=True)
        return r
