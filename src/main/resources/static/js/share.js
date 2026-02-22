// share.js

document.addEventListener('DOMContentLoaded', function() {
    // Get the container where the preview will be displayed
    const previewArea = document.getElementById('content-preview');

    // Retrieve the final content from localStorage
    const finalContentHTML = localStorage.getItem('finalContentForSharing');

    // Check if the content exists
    if (finalContentHTML) {
        // If it exists, set the innerHTML of the preview area.
        // We use innerHTML because the content from the editor includes
        // HTML tags like <b>, <i>, <br>, etc.
        previewArea.innerHTML = finalContentHTML;
    } else {
        // If no content is found, display a fallback message.
        previewArea.innerHTML = '<p style="color: #888; text-align: center;">No content available for preview. Please go back and generate content first.</p>';
    }

    // Optional: After displaying, you might want to clear the item
    // from localStorage so it's not shown again if the user revisits
    // this page out of sequence. This is a good practice for one-time data.
    // Uncomment the line below if you want this behavior.
    // localStorage.removeItem('finalContentForSharing');
});