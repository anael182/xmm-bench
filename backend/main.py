from datetime import datetime
from typing import Optional
from fastapi import FastAPI, Response, status
from fastapi.responses import FileResponse
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import requests


app = FastAPI()

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


token = None
webhook_url = "https://korysio.webhook.office.com/webhookb2/5ba335ea-50b1-44e4-9c34-d033490189d1@15d63a43-86e5-40f2-babb-27efcf4bdf52/IncomingWebhook/9252f6b311284deba4f104cc42e882ea/46993418-bc59-4aac-aabb-f1320552c085"

@app.get("/")
# http://127.0.0.1:8000/
def read_root():
    return {"HELLO": "WORLD"}


@app.get("/webcam")
# http://127.0.0.1:8000/webcam/
async def webcam():
    print("/webcam")
    image_webcam = FileResponse("./images/image.jpeg")
    return image_webcam


@app.post("/relay/{name}")
# http://127.0.0.1:8000/relay/
def toggle_relay(name: str):
    print(f"Je toggle {name}")
    r = StatusResponse(message="ok", status=True)
    return r


@app.post("/reservation/take")
# http://127.0.0.1:8000/reservation/take
# JSON INPUT EXAMPLE {"username" : "Johndoe"}
def create_access_token(user: User, response: Response):
    global token
    now = datetime.now()
    if token is None:
        token = Token(access_token="im_the_token", token_creation_date=str(now.strftime("%d/%m/%Y %H:%M:%S")), username=user.username)
        print("Creation du token : "+str(token))
        data = {
            "@type": "MessageCard",
            "@context": "http://schema.org/extensions",
            "themeColor": "0076D7",
            "summary":  user.username+" is using the XMM-bench",
            "sections": [{
                "activityTitle": user.username+" is using the XMM-bench",
                "facts": [{
                    "name": "Assigned to",
                    "value": user.username
                }, {
                    "name": "Date",
                    "value": str(now.strftime("%d/%m/%Y %H:%M:%S"))
                }, {
                    "name": "Status",
                    "value": "XMM bench is busy"
                }],
                "markdown": True
            }]
        }
        requests.post(url=webhook_url, json=data)
        return token
    else:
        response.status_code = status.HTTP_409_CONFLICT
        r = StatusResponse(message="Token is already taken by " + token.username, status=False)
        return r


@app.get("/reservation/state")
# http://127.0.0.1:8000/reservation/state
async def token_state():
    global token
    return token


@app.post("/reservation/release")
# http://127.0.0.1:8000/reservation/release
def release_token( response: Response):
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
            "summary":  token.username+" just released the XMM-bench",
            "sections": [{
                "activityTitle": token.username+" just released the XMM-bench",
                "facts": [{
                    "name": "Assigned to",
                    "value": token.username
                }, {
                    "name": "Date",
                    "value": str(now.strftime("%d/%m/%Y %H:%M:%S"))
                }, {
                    "name": "Status",
                    "value": "XMM bench is free"
                }],
                "markdown": True
            }]
        }
        requests.post(url=webhook_url, json=data)
        token = None
        r = StatusResponse(message="Token released", status=True)
        return r
