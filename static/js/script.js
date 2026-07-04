const textInput = document.getElementById("textInput");
const audioPlayer = document.getElementById("audioPlayer");
const robotFace = document.querySelector(".robot-face");

function startListening() {
    alert("Speech Recognition Started");

    const recognition = new webkitSpeechRecognition();

    recognition.lang = "en-US";

    recognition.onstart = () => {
        console.log("Listening...");
        alert("Now Speak");
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        alert("You said: " + transcript);
        textInput.value = transcript;
    };

    recognition.onerror = (event) => {
        alert("Error: " + event.error);
        console.log(event.error);
    };

    recognition.onend = () => {
        alert("Recognition Ended");
    };

    recognition.start();
}

function convertText() {
    const text = textInput.value;

    if (!text.trim()) return;

    const speech = new SpeechSynthesisUtterance(text);

    speech.lang = "en-US";
    speech.rate = 1;
    speech.pitch = 1;
    speech.volume = 1;

    speech.onstart = () => {
        robotFace.style.boxShadow = "0 0 120px cyan";
    };

    speech.onend = () => {
        robotFace.style.boxShadow = "0 0 60px cyan";
    };

    window.speechSynthesis.speak(speech);
}
if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(position=>{
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        document.getElementById("locationInfo").innerHTML =
            "Latitude: " + lat.toFixed(2) +
            " | Longitude: " + lon.toFixed(2);
    });
}else{
    document.getElementById("locationInfo").innerHTML =
        "Location not supported";
}