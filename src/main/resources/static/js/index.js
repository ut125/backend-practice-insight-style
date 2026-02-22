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

    // 開始 fetch
    fetch('http://localhost:8080/api/upload', { // 注意埠號 8080
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (!response.ok) throw new Error('後端錯誤');
            console.log("3. 收到回應了！狀態碼：", response.status);
            return response.text(); // 改用 .text() 因為 Java 回傳純文字
        })
        .then(extractedText => {
            // --- 關鍵：把 Java 讀出來的 PDF 文字存進去 ---
            localStorage.setItem('pdfContent', extractedText);
            localStorage.setItem('uploadedFileName', file.name);

            console.log("成功拿到 PDF 文字！");
            console.log("4. 資料已存入 LocalStorage");
            window.location.href = 'loading.html'; // 成功才跳轉
        })
        .catch(err => {
            console.error("上傳失敗:", err);
            localStorage.setItem('uploadFailureReason', '上傳失敗：' + err.message);
            window.location.href = 'failure.html'; // 失敗跳轉到錯誤頁
        });
});

function showComingSoon() {
    alert('This feature is coming soon!');
}