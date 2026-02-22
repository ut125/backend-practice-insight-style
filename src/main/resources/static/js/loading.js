document.addEventListener('DOMContentLoaded', function() {
    // --- 1. Get DOM Elements ---
    const fileNameDisplay = document.getElementById('file-name-display');
    const progressBar = document.getElementById('progress-bar');
    const deleteIcon = document.getElementById('delete-icon');
    const questionBox = document.getElementById('question-box');
    const fileItem = document.getElementById('file-item');
    const publicCheckbox = document.getElementById('access-public');
    const privateCheckbox = document.getElementById('access-private');
    const urlInput = document.getElementById('url-input');
    const startBtn = document.getElementById('start-btn');
    const urlErrorMessage = document.getElementById('url-error-message');

    // --- 2. State Management Logic ---

    // Function to save the current state to localStorage
    function saveState() {
        const state = {
            accessType: publicCheckbox.checked ? 'public' : (privateCheckbox.checked ? 'private' : null),
            accessUrl: urlInput.value
        };
        localStorage.setItem('loadingState', JSON.stringify(state));
    }

    // Function to restore the UI from a saved state
    function restoreState() {
        const savedStateJSON = localStorage.getItem('loadingState');
        if (!savedStateJSON) {
            return false; // No saved state found
        }

        const savedState = JSON.parse(savedStateJSON);

        if (savedState.accessType === 'public') {
            publicCheckbox.checked = true;
            privateCheckbox.checked = false;
            urlInput.value = savedState.accessUrl || ''; // Restore URL
        } else if (savedState.accessType === 'private') {
            privateCheckbox.checked = true;
            publicCheckbox.checked = false;
        }

        // Directly show the completed state without animation
        fileItem.classList.add('completed');
        progressBar.style.width = '100%'; // Set progress bar to 100%
        questionBox.style.display = 'block';
        questionBox.classList.add('visible');
        handleCheckboxChange(); // Update UI based on restored state (e.g., show URL input and Start button)

        return true; // State was restored
    }

    // --- 3. Initial Page Load ---
    const uploadedFileName = localStorage.getItem('uploadedFileName');
    if (uploadedFileName) {
        fileNameDisplay.textContent = uploadedFileName;

        // **KEY CHANGE**: Try to restore state first. If it fails, then simulate loading.
        const stateRestored = restoreState();
        if (!stateRestored) {
            simulateLoading(); // Only run loading animation if there's no previous state to restore
        }

    } else {
        fileNameDisplay.textContent = "No file found.";
        fileItem.style.display = 'none';
    }

    // --- 4. Simulate Loading & Completion ---
    function simulateLoading() {
        let progress = 0;
        const interval = setInterval(() => {
            progress += 2;
            progressBar.style.width = progress + '%';
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(onLoadingComplete, 300);
            }
        }, 30);
    }

    function onLoadingComplete() {
        fileItem.classList.add('completed');
        questionBox.style.display = 'block';
        setTimeout(() => questionBox.classList.add('visible'), 50);
    }

    // --- 5. Interactive Logic for UI Updates ---
    function clearUrlError() {
        urlInput.classList.remove('error');
        urlErrorMessage.style.display = 'none';
        urlErrorMessage.textContent = '';
    }

    function handleCheckboxChange() {
        urlInput.style.display = publicCheckbox.checked ? 'block' : 'none';
        if (!publicCheckbox.checked) clearUrlError();
        startBtn.style.display = (publicCheckbox.checked || privateCheckbox.checked) ? 'block' : 'none';
    }

    publicCheckbox.addEventListener('change', () => {
        if (publicCheckbox.checked) privateCheckbox.checked = false;
        handleCheckboxChange();
    });

    privateCheckbox.addEventListener('change', () => {
        if (privateCheckbox.checked) publicCheckbox.checked = false;
        handleCheckboxChange();
    });

    urlInput.addEventListener('input', clearUrlError);

    function validateUrl(url) {
        const urlPattern = new RegExp('^(https?|ftp):\\/\\/((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$','i');
        return !!urlPattern.test(url);
    }

    // --- 6. Event Listeners for Icons and Buttons ---
    deleteIcon.addEventListener('click', function() {
        const confirmDelete = confirm("Are you sure you want to remove this file and go back?");
        if (confirmDelete) {
            localStorage.removeItem('uploadedFileName');
            localStorage.removeItem('loadingState'); // **IMPORTANT**: Clear the saved state too
            window.location.href = 'index.html';
        }
    });

    startBtn.addEventListener('click', function() {
        clearUrlError();

        if (privateCheckbox.checked) {
            saveState(); // Save state before navigating
            window.location.href = 'audience.html';
            return;
        }

        if (publicCheckbox.checked) {
            const url = urlInput.value.trim();
            if (url === '') {
                urlErrorMessage.textContent = 'Please provide the website address.';
                urlErrorMessage.style.display = 'block';
                urlInput.classList.add('error');
                urlInput.focus();
                return;
            }
            if (!validateUrl(url)) {
                urlErrorMessage.textContent = 'Please enter a valid URL (e.g., https://example.com)';
                urlErrorMessage.style.display = 'block';
                urlInput.classList.add('error');
                urlInput.value = '';
                urlInput.focus();
                return;
            }

            saveState(); // Save state before navigating
            window.location.href = 'audience.html';
        }
    });
});