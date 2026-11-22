import cv2
import numpy as np
import tensorflow as tf  # pyright: ignore[reportMissingImports]

# Load your deepfake detection model
model = tf.keras.models.load_model('./models/deepfake2.keras')

# The size the model expects is read from the model itself (not hard-coded),
# so every image is always resized to exactly what the model needs.
MODEL_SIZE = int(model.input_shape[1])

# Load the face detector once, not on every request
face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
)

# If no face is found, analyze the whole image instead of giving up.
# Set to False to return "no_face" in that case.
ALLOW_FULL_IMAGE_FALLBACK = True

MARGIN = 200


def find_face(img_rgb):
    """
    Look for the largest face. If none is found, zoom in (upscale 2x) and
    try again with a more lenient detector. Returns (x, y, w, h) in the
    ORIGINAL image's coordinates, or None.
    """
    # attempt 1: same settings as before
    faces = face_cascade.detectMultiScale(
        img_rgb, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30)
    )
    if len(faces) > 0:
        return tuple(max(faces, key=lambda f: f[2] * f[3]))

    # attempt 2: zoom in so small faces become detectable
    h, w = img_rgb.shape[:2]
    if max(h, w) <= 1500:
        zoom = 2.0
        big = cv2.resize(img_rgb, None, fx=zoom, fy=zoom, interpolation=cv2.INTER_CUBIC)
        faces = face_cascade.detectMultiScale(
            big, scaleFactor=1.1, minNeighbors=4, minSize=(60, 60)
        )
        if len(faces) > 0:
            x, y, fw, fh = max(faces, key=lambda f: f[2] * f[3])
            return (int(x / zoom), int(y / zoom), int(fw / zoom), int(fh / zoom))

    return None


def to_model_input(img_rgb):
    """Resize any crop/image to the model's size and scale to 0-1."""
    return cv2.resize(img_rgb, (MODEL_SIZE, MODEL_SIZE)) / 255.0


def crop_face(img_rgb):
    """Return the face crop ready for the model, or None if no face is found."""
    box = find_face(img_rgb)
    if box is None:
        return None

    x, y, w, h = box
    x_margin = max(0, x - MARGIN)
    y_margin = max(0, y - MARGIN)
    w_margin = min(img_rgb.shape[1], w + 2 * MARGIN)
    h_margin = min(img_rgb.shape[0], h + 2 * MARGIN)

    cropped = img_rgb[y_margin:y_margin + h_margin, x_margin:x_margin + w_margin]
    return to_model_input(cropped)


def image_classifier(img_path):
    """
    Returns a dict:
      {"status": "ok", "label": "real" | "fake", "confidence": 0-100,
       "face_found": True | False}
      {"status": "no_face"}          (only when ALLOW_FULL_IMAGE_FALLBACK is False)
      {"status": "invalid_image"}
    """
    img_bgr = cv2.imread(img_path)
    if img_bgr is None:
        return {"status": "invalid_image"}

    img_rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)

    face = crop_face(img_rgb)
    face_found = face is not None

    if not face_found:
        if not ALLOW_FULL_IMAGE_FALLBACK:
            return {"status": "no_face"}
        face = to_model_input(img_rgb)  # whole image, resized silently

    input_data = np.expand_dims(face, axis=0)
    pred = model.predict(input_data, verbose=0)[0]
    idx = int(np.argmax(pred))

    # class 1 = fake, class 0 = real
    label = "fake" if idx == 1 else "real"
    confidence = round(float(pred[idx]) * 100, 1)

    return {
        "status": "ok",
        "label": label,
        "confidence": confidence,
        "face_found": face_found,
    }