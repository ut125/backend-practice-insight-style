// --- HEADER ANIMATION LOGIC ---
const topContainer = document.querySelector('.top-container');
const logo = document.querySelector('.header__logo img');
let scrollTimer = null;

function switchToScrolledState() {
    if (!topContainer.classList.contains('scrolled')) {
        topContainer.classList.add('scrolled');
        // NOTE: The logo src change is now handled in the HTML of each page.
        // We only add the classes here.
        logo.src = 'https://insightm.co.uk/wp-content/themes/insights-media/images/logo-small.png';
        logo.classList.add('small');
    }
}

window.addEventListener('scroll', function () {
    clearTimeout(scrollTimer);
    if (window.scrollY > 30) {
        switchToScrolledState();
    }
});

scrollTimer = setTimeout(switchToScrolledState, 3000);


// --- UPLOAD LOGIC (REVISED) ---
const fileInput = document.getElementById('file-upload');
const simulateNetworkErrorCheckbox = document.getElementById('simulate-network-error');

// Function to clear all data related to a previous workflow
function clearWorkflowState() {
    console.log("Clearing previous workflow state from localStorage...");
    localStorage.removeItem('loadingState');
    localStorage.removeItem('audienceSelection');
    localStorage.removeItem('contentPage_state'); // Placeholder for content page
    localStorage.removeItem('sharePage_state');   // Placeholder for share page
    // Add any other workflow-related keys here as you create them
}

fileInput.addEventListener('click', function() {
    // By resetting the value on click, we ensure the 'change' event will
    // fire even if the user selects the same file again.
    this.value = null;
});


fileInput.addEventListener('change', function(event) {
    console.log("1. 偵測到檔案變更！");
    const file = event.target.files[0];
    if (!file) return;
    console.log("2. 準備發送 fetch 到 8080...");

    // --- Error Logic with Separators ---

    // 1. Network error
    if (simulateNetworkErrorCheckbox.checked) {
        localStorage.setItem('uploadFailureReason', 'Upload failed: Connection lost.|Please check your internet and try again.');
        window.location.href = 'failure.html';
        return;
    }

    // 2. Corrupted file error
    if (file.size === 0) {
        localStorage.setItem('uploadFailureReason', 'Upload failed: File is empty or corrupted.|Please select a valid, non-empty file.');
        window.location.href = 'failure.html';
        return;
    }

    // 3. Invalid format error
    const allowedExtensions = ['.pdf', '.docx', '.md', '.markdown'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
        localStorage.setItem('uploadFailureReason', 'Upload failed: Invalid file type.|Currently, only PDF, DOCX, and Markdown files are supported.');
        window.location.href = 'failure.html';
        return;
    }

    // --- Success ---

    // **KEY CHANGE**: Clear old state before starting a new workflow
    clearWorkflowState();

    const formData = new FormData();
    formData.append('file', file);
    console.log("開始上傳...");

    // 開始 fetch
    fetch('http://localhost:8080/api/upload', {
        method: 'POST',
        body: formData
    })
        .then(async response => {
            // 檢查回傳的內容類型
            const contentType = response.headers.get("content-type");
            let data;

            if (contentType && contentType.includes("application/json")) {
                data = await response.json(); // 是 JSON 就解析成 JSON
            } else {
                data = { error: await response.text() }; // 不是 JSON 就包裝成物件
            }

            // 1. 處理重複檔案 (409)
            if (response.status === 409) {
                alert("Wait! " + (data.error || "File already exists."));
                throw new Error("Duplicate");
            }

            // 2. 處理檔案過大 (413) 或 其他錯誤 (500)
            if (!response.ok) {
                alert("Upload Failed: " + (data.error || "Unknown server error"));
                throw new Error(data.error || "Server Error");
            }

            // 3. 成功
            return data;
        })
        .then(data => {
            localStorage.setItem('pdfContent', data.text);
            localStorage.setItem('currentCampaignId', data.dbId);
            localStorage.setItem('uploadedFileName', file.name);
            window.location.href = 'loading.html';
        })
        .catch(err => {
            console.error("Fetch process caught an error:", err);
        });
});

function showComingSoon() {
    alert('This feature is coming soon!');
}