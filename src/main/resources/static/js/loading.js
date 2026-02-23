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

    // --- 2. 獲取資料庫 ID (關鍵：這是 index.js 存進來的) ---
    const currentCampaignId = localStorage.getItem('currentCampaignId');

    // --- 3. Initial Page Load ---
    const uploadedFileName = localStorage.getItem('uploadedFileName');
    if (uploadedFileName) {
        fileNameDisplay.textContent = uploadedFileName;
        // 嘗試恢復狀態，如果沒有就跑動畫
        if (!restoreState()) {
            simulateLoading();
        }
    } else {
        fileNameDisplay.textContent = "No file found.";
        fileItem.style.display = 'none';
    }

    // --- 下面保留你原本的邏輯函數 (saveState, restoreState, simulateLoading 等) ---

    function saveState() {
        const state = {
            accessType: publicCheckbox.checked ? 'public' : (privateCheckbox.checked ? 'private' : null),
            accessUrl: urlInput.value
        };
        localStorage.setItem('loadingState', JSON.stringify(state));
    }

    function restoreState() {
        const savedStateJSON = localStorage.getItem('loadingState');
        if (!savedStateJSON) return false;

        const savedState = JSON.parse(savedStateJSON);
        if (savedState.accessType === 'public') {
            publicCheckbox.checked = true;
            urlInput.value = savedState.accessUrl || '';
        } else if (savedState.accessType === 'private') {
            privateCheckbox.checked = true;
        }

        fileItem.classList.add('completed');
        progressBar.style.width = '100%';
        questionBox.style.display = 'block';
        questionBox.classList.add('visible');
        handleCheckboxChange();
        return true;
    }

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

    function handleCheckboxChange() {
        urlInput.style.display = publicCheckbox.checked ? 'block' : 'none';
        startBtn.style.display = (publicCheckbox.checked || privateCheckbox.checked) ? 'block' : 'none';
    }

    function clearUrlError() {
        urlInput.classList.remove('error');
        urlErrorMessage.style.display = 'none';
    }

    function validateUrl(url) {
        const urlPattern = new RegExp('^(https?|ftp):\\/\\/','i');
        return !!urlPattern.test(url);
    }

    publicCheckbox.addEventListener('change', () => {
        if (publicCheckbox.checked) privateCheckbox.checked = false;
        handleCheckboxChange();
    });

    privateCheckbox.addEventListener('change', () => {
        if (privateCheckbox.checked) publicCheckbox.checked = false;
        handleCheckboxChange();
    });

    // --- 4. 修改後的 Start 按鈕邏輯 (加入 Java 串接) ---
    startBtn.addEventListener('click', async function() {
        clearUrlError();

        let targetUrl = "";

        if (publicCheckbox.checked) {
            targetUrl = urlInput.value.trim();
            if (targetUrl === '') {
                urlErrorMessage.textContent = 'Please provide the website address.';
                urlErrorMessage.style.display = 'block';
                return;
            }
            if (!validateUrl(targetUrl)) {
                urlErrorMessage.textContent = 'Invalid URL (must start with http:// or https://)';
                urlErrorMessage.style.display = 'block';
                return;
            }
        }

        // --- 核心改動：呼叫 Java API ---
        startBtn.innerText = "Saving...";
        startBtn.disabled = true;

        try {
            const resp = await fetch('/api/update-url', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: currentCampaignId, // 傳送資料庫 ID
                    url: targetUrl          // 傳送填寫的網址 (Private 則為空字串)
                })
            });

            if (resp.ok) {
                saveState(); // 存下本地狀態
                window.location.href = 'audience.html'; // 跳轉下一頁
            } else {
                alert("Failed to save to database. Please try again.");
            }
        } catch (error) {
            console.error("Connection error:", error);
            alert("Connection error, make sure Java backend is running.");
        } finally {
            startBtn.innerText = "Start";
            startBtn.disabled = false;
        }
    });

    deleteIcon.addEventListener('click', function() {
        if (confirm("Remove file?")) {
            localStorage.clear();
            window.location.href = 'index.html';
        }
    });
});