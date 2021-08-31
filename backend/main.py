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
    access_token: str
    creation_date: str
    username: Optional[str] = None


token = Token


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
    token = Token(access_token="im_the_token", creation_date=str(now.strftime("%d/%m/%Y %H:%M:%S")), username=user.username)
    print("Creation du token : "+str(token))
    return {"username": token.username, "token": token.access_token, "creation_date": token.creation_date}


@app.get("/reservation/state")
# http://127.0.0.1:8000/reservation/state
async def token_state():
    global token
    return {"username": token.username, "token": token}


@app.post("/reservation/release")
# http://127.0.0.1:8000reservation/release
def release_token(user: User):
    global token
    token = None
    print("Last user =>" + user.username)

