const textInput = document.getElementById("textInput");
const audioPlayer = document.getElementById("audioPlayer");
const robotFace = document.querySelector(".robot-face");

function startListening() {
    const recognition = new webkitSpeechRecognition();
    recognition.lang = "en-US";

    recognition.onstart = () => {
        robotFace.style.boxShadow = "0 0 100px lime";
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        textInput.value = transcript;
    };

    recognition.onend = () => {
        robotFace.style.boxShadow = "0 0 60px cyan";
    };

    recognition.start();
}

function convertText() {
    const text = textInput.value;

    fetch("/text-to-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text })
    })
    .then(res => res.json())
    .then(data => {
        if (data.audio_url) {
            audioPlayer.src = data.audio_url;
            audioPlayer.play();

            robotFace.style.boxShadow = "0 0 120px cyan";

            setTimeout(() => {
                robotFace.style.boxShadow = "0 0 60px cyan";
            }, 3000);
        }
    });
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