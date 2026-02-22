document.addEventListener("DOMContentLoaded", function() {
  const shareOptions = document.querySelectorAll('input[name="share-type"]');
  const previewTitle = document.getElementById("email-title");
  const previewContent = document.getElementById("email-body");

  const finalContent = localStorage.getItem('finalContentForSharing') || "<p>no data</p>";

  // Simulated AI-generated content
  const previewData = {
    email: {
      subject: "AI-generated summary",
      body: finalContent
    },
    linkedin: {
      subject: "LinkedIn preview",
      body: `
        <p>This is a simulated LinkedIn post.</p>
        <p>AI-generated title: This is a test title.</p>
      `
    },
    facebook: {
      subject: "Facebook preview",
      body: `
        <p>This is simulated Facebook post content.</p>
        <p>AI-generated summary content will be displayed here.</p>
      `
    }
  };

  // Update preview content
  function updatePreview(type) {
    
    previewContent.innerHTML = previewData[type]?.body || "<p>no data</p>";
  }

  updatePreview("email");

  // Monitoring radio selection 
  shareOptions.forEach(option => {
    option.addEventListener("change", () => {
      if (option.checked) {
        updatePreview(option.value);
      }
    });
  });

  // Confirm btn
  document.getElementById("confirm-button").addEventListener("click", function() {
    const shareOption = document.querySelector('input[name="share-type"]:checked')?.value;
    const downloadOption = document.querySelector('input[name="download-type"]:checked')?.value;

    // save to localStorage
    localStorage.setItem("shareOption", shareOption);
    localStorage.setItem("downloadOption", downloadOption);

    // go to next page 
    window.location.href = "loading_1.html"; 
   
  });
});
