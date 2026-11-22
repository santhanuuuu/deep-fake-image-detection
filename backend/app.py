import os
import tempfile

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import features

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get('/')
def home():
    return {"message": "API is running"}


@app.post("/predictImage")
async def predict_image(image: UploadFile = File(...)):
    path = None
    try:
        content = await image.read()

        # unique temp file per request, removed afterwards
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
            tmp.write(content)
            path = tmp.name

        out = features.image_classifier(path)

        if out["status"] == "ok":
            return {
                "result": out["label"],
                "confidence": out["confidence"],
                "face_found": out["face_found"],
            }
        if out["status"] == "inconclusive":
            return {"result": "inconclusive", "confidence": out["confidence"]}
        if out["status"] == "no_face":
            return {"result": "no_face"}
        return {"error": "Could not read this image."}

    except Exception as e:
        print("ERROR:", e)
        return {"error": str(e)}
    finally:
        if path and os.path.exists(path):
            os.remove(path)