document.addEventListener('DOMContentLoaded', function () {
    const imageFileInput = document.getElementById('imageFile');
    const processButton = document.getElementById('processButton');
    const textResult = document.getElementById('textResult');

    processButton.addEventListener('click', async () => {
        const imageFile = imageFileInput.files[0];

        if (!imageFile) {
            alert('Please select an image.');
            return;
        }

        // Initialize Tesseract.js
        const { createWorker } = Tesseract;
        const worker = createWorker({
            logger: (m) => console.log(m),
        });

        await worker.load();
        await worker.loadLanguage('eng'); // Replace 'eng' with the language of your choice
        await worker.initialize('eng');

        // Process the image and extract text
        const { data: { text } } = await worker.recognize(imageFile);

        textResult.textContent = text;
        await worker.terminate();
    });
});
