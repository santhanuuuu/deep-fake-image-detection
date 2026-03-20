from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import features

app = FastAPI()

# ✅ CORS (important for frontend connection)
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
    try:
        image_path = "image.jpg"

        content = await image.read()
        with open(image_path, "wb") as f:
            f.write(content)

        prediction = features.image_classifier(image_path)

        # ✅ FORCE clean output
        if str(prediction).lower() in ["real", "1", "true"]:
            result = "fake"
        else:
            result = "real"

        return {"result": result}

    except Exception as e:
        print("ERROR:", e)
        return {"error": str(e)}