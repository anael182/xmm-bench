from datetime import datetime
from typing import Optional
from fastapi import FastAPI
from fastapi.responses import FileResponse
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer

app = FastAPI()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Response(BaseModel):
    message: str
    status: bool


class User(BaseModel):
    username: str


class Token(BaseModel):
    creation_date: str
    username: Optional[str] = None


token = None


@app.get("/")
# http://127.0.0.1:8000/
def read_root():
    return {"HELLO": "WORLD"}


@app.get("/webcam")
# http://127.0.0.1:8000/webcam/
async def webcam():
    print("/webcam")
    print("J'allume la caméra")
    image_webcam = FileResponse("./images/image.jpeg")
    return image_webcam


@app.post("/relay/{name}")
# http://127.0.0.1:8000/relay/
def toggle_relay(name: str):
    print(f"Je toggle {name}")
    r = Response(message="ok", status=True)
    return r


@app.post("/reservation/take")
# http://127.0.0.1:8000/reservation/take
# JSON INPUT EXAMPLE {"username" : "Johndoe"}
def create_access_token(user: User):
    global token
    now = datetime.now()
    if token is None:
        token = Token(access_token="im_the_token", creation_date=str(now.strftime("%d/%m/%Y %H:%M:%S")), username=user.username)
        print("Creation du token : "+str(token))
        return token
    else:
        r = Response(message="HTTP 409 - Token is already taken by " + token.username, status=True)
        return r


@app.get("/reservation/state")
# http://127.0.0.1:8000/reservation/state
async def token_state():
    global token
    if token is None:
        r = Response(message="Token is free", status=True)
        return r
    else:
        return token


@app.post("/reservation/release")
# http://127.0.0.1:8000reservation/release
def release_token():
    global token
    if token is None:
        r = Response(message="HTTP 400 - Bad Request", status=True)
        return r
    else:
        print("Last user =>" + token.username)
        token = None
        r = Response(message="Token released", status=True)
        return r


