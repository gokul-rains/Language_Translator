const audioInput = document.getElementById('audioInput');
const startRecognition = document.getElementById('startRecognition');
const textContainer = document.getElementById('textContainer');

let recognition;
let recognizedText = ''; // Variable to accumulate recognized text

audioInput.addEventListener('change', handleAudioFile);

function handleAudioFile(event) {
    const audioFile = event.target.files[0];
    if (!audioFile) return;

    recognition = new webkitSpeechRecognition() || new SpeechRecognition();
    recognition.lang = 'ta-IN';

    recognition.continuous = true; // Enable continuous recognition
    recognition.interimResults = true; // Enable interim results

    recognition.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
                recognizedText += event.results[i][0].transcript + ' ';
            } else {
                recognizedText += event.results[i][0].transcript;
            }
        }
        // Update the text container with accumulated recognized text
        textContainer.textContent = recognizedText.trim();
    };

    recognition.onend = () => {
        startRecognition.disabled = false;
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
    };

    // Request microphone permission when the button is clicked
    startRecognition.addEventListener('click', () => {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(() => {
                audioInput.style.display = 'none'; // Hide the file input
                startRecognition.disabled = true; // Disable the button after starting recognition
                audioInput.value = ''; // Clear the file input value
                const audio = new Audio();
                audio.src = URL.createObjectURL(audioFile);
                audio.play(); // Start playing the audio
                recognizedText = ''; // Reset recognized text
                recognition.start();
            })
            .catch((error) => {
                console.error('Microphone permission denied:', error);
            });
    });
}