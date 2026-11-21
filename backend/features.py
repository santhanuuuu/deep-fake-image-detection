import cv2
import numpy as np
import tensorflow as tf

# Load your deepfake detection model
model = tf.keras.models.load_model('./models/deepfake2.keras')

# Load the face detector once, not on every request
face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
)


def crop_face(img_arr):
    """Return a 224x224 face crop scaled to 0-1, or None if no face is found."""
    img_arr = cv2.cvtColor(img_arr, cv2.COLOR_BGR2RGB)
    faces = face_cascade.detectMultiScale(
        img_arr, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30)
    )

    if len(faces) == 0:
        return None

    # use the largest face instead of the first one found
    x, y, w, h = max(faces, key=lambda f: f[2] * f[3])

    margin = 200
    x_margin = max(0, x - margin)
    y_margin = max(0, y - margin)
    w_margin = min(img_arr.shape[1], w + 2 * margin)
    h_margin = min(img_arr.shape[0], h + 2 * margin)

    cropped_face = img_arr[y_margin:y_margin + h_margin, x_margin:x_margin + w_margin]
    cropped_face = cv2.resize(cropped_face, (224, 224)) / 255.0
    return cropped_face


def image_classifier(img_path):
    """
    Returns a dict:
      {"status": "ok", "label": "real" | "fake", "confidence": 0-100}
      {"status": "no_face"}
      {"status": "invalid_image"}
    """
    img_arr = cv2.imread(img_path)
    if img_arr is None:
        return {"status": "invalid_image"}

    face = crop_face(img_arr)
    if face is None:
        return {"status": "no_face"}

    input_data = np.expand_dims(face, axis=0)
    pred = model.predict(input_data, verbose=0)[0]
    idx = int(np.argmax(pred))

    # class 1 = fake, class 0 = real (same mapping your old app.py used)
    label = "fake" if idx == 1 else "real"
    confidence = round(float(pred[idx]) * 100, 1)

    return {"status": "ok", "label": label, "confidence": confidence}