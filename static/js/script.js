const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const resultContainer = document.getElementById('result-container');
const resultImage = document.getElementById('result-image');
const loadingText = document.getElementById('loading-text');
const resultLabel = document.getElementById('result-label');

// Prevent defualt drag behavior
['dragenter','dragover','dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, preventDefaults, false)
});



function preventDefaults (e) {
    e.preventDefault();
    e.stopPropagation();
}

// Add and remove highlight on drag events
dropZone.addEventListener('dragover', (e) =>  dropZone.classList.add('dragover'));
dropZone.addEventListener('dragleave', () =>  dropZone.classList.remove('dragover'));
dropZone.addEventListener('drop', (e) => dropZone.classList.remove('dragover'));
dropZone.addEventListener('drop', handleDrop)
dropZone.addEventListener('click', () => fileInput.click())
fileInput.addEventListener('change', (e) => uploadFile(e.target.files[0]));

function handleDrop(e) {
    dropZone.classList.remove('highlight');
    const dt = e.dataTransfer;
    const files = dt.files[0];
    uploadFile(files);
}

// Upload file to server
function uploadFile(file) {
    if (!file) return;

    // loading state
    loadingText.classList.remove('hidden');
    resultImage.classList.add('hidden');
    resultContainer.classList.remove('hidden');
    resultLabel.classList.add('hidden');

    // Create package to send
    const formData = new FormData();
    formData.append('file', file);

    // Send file to server
    fetch('/predict', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            resultImage.src = data.predict_image_url;
            resultLabel.textContent = "Detected: " + data.detected_object.join(", ");
            resultLabel.classList.remove('hidden');
            resultImage.classList.remove('hidden');
            
        }
        else {
            alert('Error' + data.error)
        }
    })
    .catch(error => {
        console.log('Error:' + error) 
        alert('Something went wrong')

    })
    .finally(() => loadingText.classList.add('hidden'));
}


