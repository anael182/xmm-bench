import asyncio
import os
import subprocess
from collections import deque
from datetime import datetime, timedelta
from typing import Optional, List

import requests
import v4l2py
from dotenv import load_dotenv
from fastapi import FastAPI, Response, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

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


class InputToken(BaseModel):
    username: str
    token_minutes: Optional[int]


class Token(BaseModel):
    creation_date: datetime
    username: str
    expires_date: Optional[datetime]


class QueueResponse(BaseModel):
    queue: List[InputToken]


#
# Webhook management
#


def teams_webhook(summary: str, activity: str, name_message: str, value_message: str):
    data = {
        "@type": "MessageCard",
        "@context": "http://schema.org/extensions",
        "themeColor": "0076D7",
        "summary": summary,
        "sections": [
            {
                "activityTitle": activity,
                "facts": [{"name": name_message, "value": value_message}],
                "markdown": True,
            }
        ],
    }
    if os.getenv("WEBHOOK_URL") is not None:
        requests.post(url=os.getenv("WEBHOOK_URL"), json=data)


#
# Token
#

token = None


def take_token(input_token):
    global token
    token = Token(
        creation_date=datetime.now(),
        expires_date=datetime.now() + timedelta(minutes=input_token.token_minutes)
        if input_token.token_minutes
        else None,
        username=input_token.username,
    )
    teams_webhook(
        f'{token.username} is using {os.getenv("BOARD_NAME")}',
        f'{token.username} is using {os.getenv("BOARD_NAME")}'
        f' since {token.creation_date.strftime("%d/%m/%Y %H:%M:%S")}',
        "Token claimed until" if token.expires_date else "No expiration time",
        f'{token.expires_date.strftime("%d/%m/%Y %H:%M:%S")}'
        if token.expires_date
        else "",
    )


async def check_token_expiration(force_release=False):
    global token
    global queue
    if token is None:
        return

    if force_release or datetime.now() >= token.expires_date:
        teams_webhook(
            f'{token.username} just released {os.getenv("BOARD_NAME")}',
            f'{token.username} just released {os.getenv("BOARD_NAME")}',
            "Manual release of the token"
            if force_release
            else "Token duration expired",
            "",
        )
        token = None

        if len(queue) >= 1:
            token_input = queue.popleft()
            take_token(token_input)


async def background_task():
    while True:
        try:
            await asyncio.sleep(1)
            await check_token_expiration()
        except asyncio.CancelledError:
            raise
        except Exception as e:
            print("Oops! Something went wrong. %r" % e)

#
# Webcam management
#


async def async_stream(stream):
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
        try:
            self.cam = v4l2py.Device.from_id(0)
            self.cam.video_capture.set_format(800, 600, "MJPG")
        except Exception:
            self.cam = None

        self.current = None

    async def run_capture(self):
        if self.cam:
            async for frame in async_stream(
                v4l2py.device.VideoStream(self.cam.video_capture)
            ):
                self.current = frame

    async def video_streamer(self, fps: int):
        if self.cam:
            while True:
                yield (
                    b"--jpgboundary\r\n"
                    + b"Content-Type: image/jpeg\r\n\r\n"
                    + self.current
                )
                await asyncio.sleep(1 / fps)
        else:
            yield b"--jpgboundary\r\n" + b"Content-Type: image/jpeg\r\n\r\n" + open(
                "images/image.jpeg", "rb"
            ).read()


webcam_runner = WebcamRunner()


@app.get("/webcam/{fps}")
async def webcam(fps: int):
    return StreamingResponse(
        webcam_runner.video_streamer(fps),
        media_type="multipart/x-mixed-replace; boundary=--jpgboundary",
    )


#
# Relays
#


XMM_RELAY_BIN = os.getenv("XMM_RELAY_BIN", "/home/korys/bin/xmm_relay")


@app.post("/relay/{name}")
async def toggle_relay(name: str):
    if name == "flash":
        r = subprocess.run([XMM_RELAY_BIN, "-f"])
    elif name == "power":
        r = subprocess.run([XMM_RELAY_BIN, "-p"])
    elif name == "reboot":
        r = subprocess.run([XMM_RELAY_BIN, "-r"])
    elif name == "cv22boot":
        r = subprocess.run([XMM_RELAY_BIN, "-c"])
    elif name == "cv22flash":
        r = subprocess.run([XMM_RELAY_BIN, "-v"])

    return StatusResponse(message="", status=r.returncode == 0)


#
# Queue
#

queue = deque()


@app.post("/reservation/take")
async def create_access_token(input_token: InputToken, response: Response):
    global token
    if token is None:
        take_token(input_token)
        return token
    else:
        response.status_code = status.HTTP_409_CONFLICT
        return StatusResponse(
            message="Token is already taken by " + token.username, status=False
        )


@app.post("/reservation/release")
async def release_token(response: Response):
    global token
    global queue
    if token is None:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return StatusResponse(message="Token is already free", status=False)
    else:
        print("Last user => " + token.username)
        await check_token_expiration(force_release=True)
        return StatusResponse(message="Token released", status=True)


@app.get("/reservation/state")
async def token_state():
    global token
    return token


@app.post("/reservation/queue/join")
async def queue_management_add(input_token: InputToken):
    global queue
    queue.append(input_token)
    return StatusResponse(
        status=True, message=f"Joined queue at position {len(queue)}:"
    )


@app.post("/reservation/queue/leave/{index}")
async def queue_management_delete(index: int):
    global queue
    if len(queue) >= 1:
        if index <= len(queue):
            del queue[index]
            return QueueResponse(queue=list(queue))
        else:
            return StatusResponse(message="Index out of bounds", status=False)
    else:
        return StatusResponse(message="The queue is empty", status=False)


@app.get("/reservation/queue/state")
async def get_queue():
    return QueueResponse(queue=list(queue))


@app.get("/board")
async def get_board():
    if os.getenv("BOARD_NAME") is not None:
        return {"board_name": os.getenv("BOARD_NAME")}
    else:
        return {"board_name": None}


#
# Startup
#


@app.on_event("startup")
async def app_startup():
    asyncio.create_task(webcam_runner.run_capture())
    asyncio.create_task(background_task())
