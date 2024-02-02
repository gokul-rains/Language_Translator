const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const transcriptionTextArea = document.getElementById('transcriptionTextArea');
const copyButton = document.getElementById('copyButton');
const downloadButton = document.getElementById('downloadButton');
let recognition = null;

if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();

    recognition.lang = 'ta-IN'; // Tamil (India) language code

    recognition.onstart = () => {
        startButton.textContent = 'Recording...';
        startButton.disabled = true;
        stopButton.disabled = false;
    };

    recognition.onresult = (event) => {
        const result = event.results[0][0].transcript;
        transcriptionTextArea.value += result + ' ';
        copyButton.disabled = false; 
        downloadButton.disabled = false;
        transcriptionTextArea.scrollTop = transcriptionTextArea.scrollHeight;
    };

    recognition.onend = () => {
        startButton.textContent = 'Start Recording';
        startButton.disabled = false;
        stopButton.disabled = true;
    };

    recognition.onerror = (event) => {
        console.error('Error:', event.error);
    };

    startButton.addEventListener('click', () => {
        transcriptionTextArea.value = '';
        recognition.start();
    });

    stopButton.addEventListener('click', () => {
        recognition.stop();
    });

    copyButton.addEventListener('click', () => {
        transcriptionTextArea.select();
        transcriptionTextArea.setSelectionRange(0, 99999); // For mobile devices
        document.execCommand('copy');

        copyButton.textContent = 'Copied!';
        setTimeout(() => {
            copyButton.textContent = 'Copy Text';
        }, 1000);
    });

    downloadButton.addEventListener('click', () => {
        const textToDownload = transcriptionTextArea.value;
        if (textToDownload.trim() !== '') {
            const blob = new Blob([textToDownload], { type: 'text/plain' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'transcribed_text.txt';

            // Trigger a click on the link
            a.dispatchEvent(new MouseEvent('click'));

            // Clean up the temporary URL
            URL.revokeObjectURL(a.href);
        }
    });
} else {
    startButton.disabled = true;
    stopButton.disabled = true;
    transcriptionTextArea.placeholder = 'Speech recognition not supported in this browser.';
}
