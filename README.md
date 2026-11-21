# DeepFake Image Detection

A web app that checks whether a photo of a person is **real or digitally manipulated**. Upload an image, and get a clear verdict with a confidence score.

## Features

- Drag-and-drop or click-to-upload image checking
- Clear result: **Likely authentic** or **Likely manipulated**, with a confidence score
- Friendly "No face detected" message for images without a usable face
- Responsive, accessible interface

## What it detects

- Face swaps
- AI-generated faces
- Heavily edited or altered faces
- Digitally created images of people

> **Note:** results are an estimate, not proof. The system only analyzes photos where a human face is clearly visible. Drawings, artwork, masked characters and photos without a visible face cannot be checked.

## Tech stack

| Part | Technology |
| --- | --- |
| Frontend | React 18, Vite, Tailwind CSS v4, Motion |
| Backend | FastAPI (Python) |
| Model | TensorFlow / Keras image classifier |
| Face detection | OpenCV (Haar cascade) |

## Project structure

```
deep-fake-image-detection/
├── backend/
│   ├── app.py            # FastAPI app and /predictImage endpoint
│   ├── features.py       # face detection + model inference
│   ├── models/           # trained Keras model
│   └── requirements.txt
└── frontend/
    ├── public/           # favicon and icons
    ├── src/
    │   ├── app/          # App.tsx and page sections
    │   └── styles/
    └── package.json
```

## Getting started

### Prerequisites

- Python 3.10 - 3.12 (TensorFlow 2.19 does not support newer versions)
- Node.js 18 or newer

### 1. Run the backend

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

The API is now running at `http://localhost:8000`.

### 2. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Open the URL printed in the terminal (usually `http://localhost:5173`).

To test against your local backend, set the request URL in `frontend/src/app/App.tsx` to `http://localhost:8000/predictImage`.

## API

### `POST /predictImage`

Send the image as `multipart/form-data` with the field name `image`.

**Response**

```json
{ "result": "real", "confidence": 87.3 }
```

| `result` | Meaning |
| --- | --- |
| `real` | No signs of manipulation found |
| `fake` | Signs of manipulation or generation found |
| `no_face` | No usable face detected in the image |

`confidence` (0-100) is returned for `real` and `fake`. Errors return `{ "error": "..." }`.

## Limitations

- Works on photos of human faces only
- Very small, blurry or heavily cropped faces may not be detected
- Like any classifier, it can be wrong. Do not use results as legal or forensic evidence

## Author

Built by [santhanuuuu](https://github.com/santhanuuuu).
