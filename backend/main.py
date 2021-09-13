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
import v4l2py


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

async def AsyncStream(stream):
    import asyncio
    cap = stream.video_capture
    fd = cap.device.fileno()
    loop = asyncio.get_event_loop()
    event = asyncio.Event()
    loop.add_reader(fd, event.set)
    try:
        cap.start()
        while True:
            await event.wait()
            event.clear()
            yield stream.read()
    finally:
        cap.stop()
        loop.remove_reader(fd)


class WebcamRunner:

    def __init__(self):
        self.cam = v4l2py.Device.from_id(0)
        self.cam.video_capture.set_format(800, 600, 'MJPG')

        self.current = None

    async def run_capture(self):
        async for frame in AsyncStream(v4l2py.device.VideoStream(self.cam.video_capture)):
            self.current = frame

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
            "summary":  user.username+" is using "+os.getenv("BOARD_NAME"),
            "sections": [{
                "activityTitle": user.username+" is using "+os.getenv("BOARD_NAME"),
                "facts": [],
                "markdown": True
            }]
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
            "summary":  token.username+" just released "+os.getenv("BOARD_NAME"),
            "sections": [{
                "activityTitle": token.username+" just released "+os.getenv("BOARD_NAME"),
                "facts": [],
                "markdown": True
            }]
        }
        requests.post(url=os.getenv("WEBHOOK_URL"), json=data)
        token = None
        r = StatusResponse(message="Token released", status=True)
        return r


@app.get("/board")
# http://127.0.0.1:8000/board
def get_board():
    return {"board_name": os.getenv("BOARD_NAME")}
