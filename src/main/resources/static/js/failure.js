document.addEventListener('DOMContentLoaded', function() {
    // Get the two paragraph elements by their IDs
    const titleElement = document.getElementById('error-title');
    const suggestionElement = document.getElementById('error-suggestion');

    // Retrieve the full reason string from localStorage
    const fullReason = localStorage.getItem('uploadFailureReason');

    if (titleElement && suggestionElement && fullReason) {
        // Check if our separator '|' exists in the string
        if (fullReason.includes('|')) {
            // Split the string into two parts at the separator
            const parts = fullReason.split('|');
            const title = parts[0];
            const suggestion = parts[1];

            // Assign the parts to the respective elements
            titleElement.textContent = title;
            suggestionElement.textContent = suggestion;
        } else {
            // If there's no separator, put the whole message in the title
            // and leave the suggestion blank. This is a good fallback.
            titleElement.textContent = fullReason;
            suggestionElement.textContent = 'Please try again.';
        }
    } else if (titleElement) {
        // If localStorage is empty, show a generic default message
        titleElement.textContent = 'An unknown error occurred.';
        suggestionElement.textContent = 'Please return to the previous page and try again.';
    }

    // Clean up localStorage
    localStorage.removeItem('uploadFailureReason');
});