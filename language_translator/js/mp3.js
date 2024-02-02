document.addEventListener('DOMContentLoaded', function () {
    const audioFileInput = document.getElementById('audioFile');
    const convertBtn = document.getElementById('convertBtn');
    const output = document.getElementById('output');

    convertBtn.addEventListener('click', async () => {
        const audioFile = audioFileInput.files[0];

        if (!audioFile) {
            alert('Please select an MP3 audio file.');
            return;
        }

        try {
            const audioBlob = await audioFile.arrayBuffer();
            const audioContext = new AudioContext();
            const audioSource = audioContext.createBufferSource();
            const audioData = await audioContext.decodeAudioData(audioBlob);

            audioSource.buffer = audioData;

            const recognition = new webkitSpeechRecognition();
            recognition.lang = 'ta-IN'; // Set the language to Tamil (India)

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                output.textContent = transcript;
            };

            recognition.start();
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while processing the audio.');
        }
    });
});
