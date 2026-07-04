from flask import Flask, render_template, request, jsonify, send_from_directory
import speech_recognition as sr
import pyttsx3
import os
import uuid
import threading
import time

app = Flask(__name__)

UPLOAD_FOLDER = "static/audio"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# =========================
# SPEECH ENGINE (FIXED)
# =========================
def create_engine():
    engine = pyttsx3.init()
    engine.setProperty("rate", 170)
    engine.setProperty("volume", 1.0)
    return engine

# =========================
# HOME
# =========================
@app.route("/")
def index():
    return render_template("index.html")

# =========================
# TEXT TO SPEECH (FIXED)
# =========================
@app.route("/text-to-speech", methods=["POST"])
def text_to_speech():
    data = request.json
    text = data.get("text", "")

    if not text.strip():
        return jsonify({"error": "No text provided"})

    filename = f"{uuid.uuid4()}.wav"
    file_path = os.path.join(UPLOAD_FOLDER, filename)

    try:
        engine = create_engine()   # IMPORTANT: fresh engine each request
        engine.save_to_file(text, file_path)
        engine.runAndWait()

        return jsonify({
            "audio_url": f"/static/audio/{filename}"
        })

    except Exception as e:
        return jsonify({"error": str(e)})

# =========================
# SPEECH TO TEXT
# =========================
@app.route("/speech-to-text", methods=["POST"])
def speech_to_text():
    if "audio" not in request.files:
        return jsonify({"error": "No audio file"})

    file = request.files["audio"]
    filename = f"{uuid.uuid4()}.wav"
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    recognizer = sr.Recognizer()

    try:
        with sr.AudioFile(filepath) as source:
            audio_data = recognizer.record(source)

        text = recognizer.recognize_google(audio_data)

        return jsonify({"text": text})

    except Exception as e:
        return jsonify({"error": str(e)})

# =========================
# CLEAN OLD FILES
# =========================
def cleanup_audio():
    while True:
        time.sleep(300)
        for file in os.listdir(UPLOAD_FOLDER):
            path = os.path.join(UPLOAD_FOLDER, file)
            try:
                if os.path.isfile(path):
                    os.remove(path)
            except:
                pass

thread = threading.Thread(target=cleanup_audio, daemon=True)
thread.start()

# =========================
# RUN APP
# =========================
if __name__ == "__main__":
    app.run(debug=True)