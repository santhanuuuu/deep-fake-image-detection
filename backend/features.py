import cv2
import numpy as np
import tensorflow as tf  # pyright: ignore[reportMissingImports]

# Load your deepfake detection model
model = tf.keras.models.load_model('./models/deepfake2.keras')

# The size the model expects is read from the model itself (not hard-coded),
# so every image is always resized to exactly what the model needs.
MODEL_SIZE = int(model.input_shape[1])

# --- Settings you can tune ---------------------------------------------------
# Smallest face (width in pixels, in the ORIGINAL photo) we will analyze.
# A tiny, far-away face blown up to the model size is just noise, and the
# model gives confident but meaningless answers on it.
MIN_FACE_SIZE = 64

# Below this confidence (%), the model is unsure -> "inconclusive".
MIN_CONFIDENCE = 70

# Keep False. Running the model on a whole drawing/scene gives wrong answers.
ALLOW_FULL_IMAGE_FALLBACK = False

MARGIN = 200
# -----------------------------------------------------------------------------

# Two frontal-face detectors (the second one handles tilted / harder faces better).
# Both ship with OpenCV, nothing extra to install.
_cascades = []
for _name in ('haarcascade_frontalface_default.xml', 'haarcascade_frontalface_alt2.xml'):
    _c = cv2.CascadeClassifier(cv2.data.haarcascades + _name)
    if not _c.empty():
        _cascades.append(_c)


def find_face(img_rgb):
    """
    Return the largest face as (x, y, w, h) in the original image, or None.
    Faces smaller than MIN_FACE_SIZE are ignored on purpose.
    """
    gray = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2GRAY)
    gray = cv2.equalizeHist(gray)  # helps with backlit / sunset / dark photos

    best = None
    for cascade in _cascades:
        faces = cascade.detectMultiScale(
            gray,
            scaleFactor=1.1,
            minNeighbors=5,
            minSize=(MIN_FACE_SIZE, MIN_FACE_SIZE),
        )
        for (x, y, w, h) in faces:
            if best is None or w * h > best[2] * best[3]:
                best = (int(x), int(y), int(w), int(h))
        if best is not None:
            break  # first detector that finds a face wins
    return best


def to_model_input(img_rgb):
    """Resize any crop/image to the model's size and scale to 0-1."""
    return cv2.resize(img_rgb, (MODEL_SIZE, MODEL_SIZE)) / 255.0


def crop_face(img_rgb):
    """Return the face crop ready for the model, or None if no usable face."""
    box = find_face(img_rgb)
    if box is None:
        return None

    x, y, w, h = box
    print(f"[detect] image {img_rgb.shape[1]}x{img_rgb.shape[0]}  face box x={x} y={y} w={w} h={h}")

    x_margin = max(0, x - MARGIN)
    y_margin = max(0, y - MARGIN)
    w_margin = min(img_rgb.shape[1], w + 2 * MARGIN)
    h_margin = min(img_rgb.shape[0], h + 2 * MARGIN)

    cropped = img_rgb[y_margin:y_margin + h_margin, x_margin:x_margin + w_margin]
    return to_model_input(cropped)


def image_classifier(img_path):
    """
    Returns a dict:
      {"status": "ok", "label": "real" | "fake", "confidence": 0-100, "face_found": True}
      {"status": "inconclusive", "confidence": 0-100}
      {"status": "no_face"}
      {"status": "invalid_image"}
    """
    img_bgr = cv2.imread(img_path)
    if img_bgr is None:
        return {"status": "invalid_image"}

    img_rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)

    face = crop_face(img_rgb)
    face_found = face is not None

    if not face_found:
        print(f"[detect] image {img_rgb.shape[1]}x{img_rgb.shape[0]}  no usable face")
        if not ALLOW_FULL_IMAGE_FALLBACK:
            return {"status": "no_face"}
        face = to_model_input(img_rgb)

    input_data = np.expand_dims(face, axis=0)
    pred = model.predict(input_data, verbose=0)[0]
    idx = int(np.argmax(pred))

    # class 1 = fake, class 0 = real
    label = "fake" if idx == 1 else "real"
    confidence = round(float(pred[idx]) * 100, 1)

    if confidence < MIN_CONFIDENCE:
        return {"status": "inconclusive", "confidence": confidence}

    return {
        "status": "ok",
        "label": label,
        "confidence": confidence,
        "face_found": face_found,
    }