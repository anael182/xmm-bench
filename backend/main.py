from fastapi import FastAPI
from fastapi.responses import FileResponse
from pydantic import BaseModel
from starlette.middleware.cors import CORSMiddleware


app = FastAPI()

origins = ["*"]


class Response(BaseModel):
    message: str
    statut: bool


@app.get("/")
def read_root():
    return {"message": "Hello World"}


@app.get("/webcam")
async def webcam():
    print("/webcam")
    print("J'allume la caméra")
    image_webcam = FileResponse("./images/image.jpeg")
    return image_webcam


@app.post("/relay/{name}")
def toggle_relay(name):
    print(f"Je toggle {name}")
    Response.message = "ok"
    return Response.message



