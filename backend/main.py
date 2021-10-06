import asyncio
import os
import subprocess
from collections import deque
from datetime import datetime, timedelta
from typing import Optional

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


#
# Webhook management
#


def teams_webhook(summary: str, activity: str, name_message: str, value_message: str):
    data = {
        "@type": "MessageCard",
        "@context": "http://schema.org/extensions",
        "themeColor": "0076D7",
        "summary": summary,
        "sections": [{
            "activityTitle": activity,
            "facts": [
                {
                    "name": name_message,
                    "value": value_message
                }
            ],
            "markdown": True
        }]
    }
    if os.getenv("WEBHOOK_URL") is not None:
        requests.post(url=os.getenv("WEBHOOK_URL"), json=data)


#
# Token
#

token = None


def check_token_expiration():
    global token
    if token and datetime.now() >= token.expires_date:
        teams_webhook(f'{token.username} just released {os.getenv("BOARD_NAME")}',
                      f'{token.username} just released {os.getenv("BOARD_NAME")}',
                      'Token duration expired', "")
        if len(queue) >= 1:
            token = Token(
                creation_date=datetime.now(),
                expires_date=datetime.now() + timedelta(minutes=queue[0].token_minutes) if queue[
                    0].token_minutes else None,
                username=queue[0].username,
            )
            teams_webhook(f'{token.username}  is using {os.getenv("BOARD_NAME")}',
                          f'{token.username} is using {os.getenv("BOARD_NAME")} since {token.creation_date.strftime("%d/%m/%Y %H:%M:%S")}',
                          'token claimed until', f'{token.expires_date.strftime("%d/%m/%Y %H:%M:%S")}')
            queue.popleft()
        elif len(queue) == 0:
            teams_webhook(f'{token.username} just released {os.getenv("BOARD_NAME")}',
                          f'{token.username} just released {os.getenv("BOARD_NAME")}',
                          'The board is free', "")
            token = None


async def background_task():
    global token
    global queue
    while True:
        try:
            await asyncio.sleep(1)
            check_token_expiration()
        except:
            print("Oops! Something went wrong.")


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
            self.cam.video_capture.set_format(800, 600, 'MJPG')
        except:
            self.cam = None

        self.current = None

    async def run_capture(self):
        if self.cam:
            async for frame in async_stream(v4l2py.device.VideoStream(self.cam.video_capture)):
                self.current = frame

    async def video_streamer(self, fps: int):
        if self.cam:
            while True:
                yield b"--jpgboundary\r\n" + b'Content-Type: image/jpeg\r\n\r\n' + self.current
                await asyncio.sleep(1 / fps)
        else:
            yield b"--jpgboundary\r\n" + b'Content-Type: image/jpeg\r\n\r\n' + open('images/image.jpeg', 'rb').read()


webcam_runner = WebcamRunner()


@app.on_event('startup')
async def app_startup():
    asyncio.create_task(webcam_runner.run_capture())
    asyncio.create_task(background_task())


@app.get("/webcam/{fps}")
# http://127.0.0.1:8000/webcam/
def webcam(fps: int):
    return StreamingResponse(
        webcam_runner.video_streamer(fps),
        media_type="multipart/x-mixed-replace; boundary=--jpgboundary",
    )


#
# Relays
#


XMM_RELAY_BIN = os.getenv("XMM_RELAY_BIN", "/home/korys/bin/xmm_relay")


@app.post("/relay/{name}")
# http://127.0.0.1:8000/relay/
def toggle_relay(name: str):
    if name == 'flash':
        r = subprocess.run([XMM_RELAY_BIN, "-f"])
    elif name == 'power':
        r = subprocess.run([XMM_RELAY_BIN, "-p"])
    elif name == 'reboot':
        r = subprocess.run([XMM_RELAY_BIN, "-r"])
    elif name == 'cv22boot':
        r = subprocess.run([XMM_RELAY_BIN, "-c"])
    elif name == 'cv22flash':
        r = subprocess.run([XMM_RELAY_BIN, "-v"])

    r = StatusResponse(message="", status=r.returncode == 0)
    return r


#
# Queue
#

queue = deque()


@app.post("/reservation/take")
# http://127.0.0.1:8000/reservation/take
# JSON INPUT EXAMPLE {"username" : "Johndoe"}
def create_access_token(input_token: InputToken, response: Response):
    global token
    if token is None and input_token.token_minutes is not None:
        token = Token(
            creation_date=datetime.now(),
            expires_date=datetime.now() + timedelta(minutes=input_token.token_minutes),
            username=input_token.username,
        )
        print("Creation du token : " + str(token))
        teams_webhook(f'{token.username}  is using {os.getenv("BOARD_NAME")}',
                      f'{token.username} is using {os.getenv("BOARD_NAME")} since {token.creation_date.strftime("%d/%m/%Y %H:%M:%S")}',
                      'token claimed until', f'{token.expires_date.strftime("%d/%m/%Y %H:%M:%S")}')
        return {
            'creation_date': token.creation_date.strftime("%d/%m/%Y %H:%M:%S"),
            'expires_date': token.expires_date.strftime("%d/%m/%Y %H:%M:%S"),
            'username': token.username,
        }
    elif token is None and input_token.token_minutes is None:
        token = Token(
            creation_date=datetime.now(),
            expires_date=None,
            username=input_token.username,
        )
        teams_webhook(f'{token.username}  is using {os.getenv("BOARD_NAME")}',
                      f'{token.username} is using {os.getenv("BOARD_NAME")} since {token.creation_date.strftime("%d/%m/%Y %H:%M:%S")}',
                      "No expiration time", "")
        return {
            'creation_date': token.creation_date.strftime("%d/%m/%Y %H:%M:%S"),
            'expires_date': None,
            'username': token.username,
        }
    else:
        response.status_code = status.HTTP_409_CONFLICT
        r = StatusResponse(
            message="Token is already taken by " + token.username, status=False
        )
        return r


@app.post("/reservation/release")
# http://127.0.0.1:8000/reservation/release
def release_token(response: Response):
    global token
    global queue
    if token is None:
        response.status_code = status.HTTP_400_BAD_REQUEST
        r = StatusResponse(message="Token is already free", status=False)
        return r
    else:
        print("Last user => " + token.username)
        token.expires_date = datetime.now()
    r = StatusResponse(message="Token released", status=True)
    return r


@app.get("/reservation/state")
# http://127.0.0.1:8000/reservation/state
async def token_state():
    global token
    if token is not None and token.expires_date is not None:
        return {
            'creation_date': token.creation_date.strftime("%d/%m/%Y %H:%M:%S"),
            'expires_date': token.expires_date.strftime("%d/%m/%Y %H:%M:%S"),
            'username': token.username,
        }
    elif token is not None and token.expires_date is None:
        return {
            'creation_date': token.creation_date.strftime("%d/%m/%Y %H:%M:%S"),
            'username': token.username,
        }
    else:
        return None


@app.post("/reservation/queue/join")
def queue_management_add(input_token: InputToken):
    global queue
    queue.append(input_token)
    return {"input_token": input_token, "queue_position": len(queue)}


@app.post("/reservation/queue/leave/{index}")
def queue_management_delete(index: int):
    global queue
    if len(queue) >= 1:
        if index <= len(queue):
            print(f"{queue[index].username} has left the queue.")
            teams_webhook(f"{queue[index].username.capitalize()} has left the queue.",
                          f"{queue[index].username.capitalize()} has left the queue.", "", "")
            del queue[index]
            return {"queue": list(queue)}
        else:
            r = StatusResponse(message="Index out of bounds", status=True)
            return r
    else:
        r = StatusResponse(message="The queue is empty", status=True)
        return r


@app.get("/reservation/queue/state")
def get_queue():
    return {"queue": list(queue)}


@app.get("/board")
# http://127.0.0.1:8000/board
def get_board():
    if os.getenv("BOARD_NAME") is not None:
        return {"board_name": os.getenv("BOARD_NAME")}
    else:
        return {"board_name": None}
