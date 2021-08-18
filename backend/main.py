from fastapi import FastAPI
from fastapi.openapi.models import Response

from fastapi.responses import FileResponse

app = FastAPI()


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

