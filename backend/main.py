from fastapi import FastAPI
from pydantic import BaseModel

from fastapi.responses import FileResponse

app = FastAPI()


class Response(BaseModel):
    message: str
    statut: bool


@app.get("/")
def read_root():
    return {"Hello": "World"}


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

