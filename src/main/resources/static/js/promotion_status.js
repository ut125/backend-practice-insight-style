// promotion_status.js 裡面的按鈕邏輯
document.addEventListener("DOMContentLoaded", function() {
    const ICON_OK = "../image/fulfil.png";
    const ICON_FAIL = "../image/failure.png";

    const updateUI = () => {
        const eStatus = localStorage.getItem('emailStatus');
        const pStatus = localStorage.getItem('pdfStatus');

        // Email UI
        const rowEmail = document.getElementById('row-email');
        const imgEmail = document.getElementById('img-email');
        const btnEmail = document.getElementById('btn-email');

        if (eStatus === 'none' || !eStatus) {
            rowEmail.classList.add('hidden');
        } else {
            rowEmail.classList.remove('hidden');
            imgEmail.src = (eStatus === 'success') ? ICON_OK : ICON_FAIL;
            // 如果成功就隱藏按鈕，失敗就顯示按鈕並確保文字是 Retry
            if (eStatus === 'success') {
                btnEmail.classList.add('hidden');
            } else {
                btnEmail.classList.remove('hidden');
                btnEmail.innerText = "Retry";
            }
        }

        // PDF UI (與上面邏輯相同)
        const rowPdf = document.getElementById('row-pdf');
        const imgPdf = document.getElementById('img-pdf');
        const btnPdf = document.getElementById('btn-pdf');

        if (pStatus === 'none' || !pStatus) {
            rowPdf.classList.add('hidden');
        } else {
            rowPdf.classList.remove('hidden');
            imgPdf.src = (pStatus === 'success') ? ICON_OK : ICON_FAIL;
            if (pStatus === 'success') {
                btnPdf.classList.add('hidden');
            } else {
                btnPdf.classList.remove('hidden');
                btnPdf.innerText = "Retry";
            }
        }
    };

    // --- Retry Email 動作 ---
    document.getElementById('btn-email').onclick = async function() {
        const btn = this;
        btn.innerText = "Processing..."; // 1. 點擊瞬間變更文字
        btn.disabled = true;

        try {
            const resp = await fetch('/api/send-to-audience', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    audience: localStorage.getItem('audienceSelection'),
                    content: localStorage.getItem('finalContentForSharing')
                })
            });

            if (resp.ok) {
                localStorage.setItem('emailStatus', 'success');
            } else {
                localStorage.setItem('emailStatus', 'fail');
                alert("Retry failed.");
            }
        } catch (e) {
            localStorage.setItem('emailStatus', 'fail');
        }

        btn.disabled = false;
        updateUI(); // 2. 更新 UI (如果 success 會隱藏按鈕，如果 fail 會變回 Retry)
    };

    // --- Retry PDF 動作 ---
    document.getElementById('btn-pdf').onclick = async function() {
        const btn = this;
        btn.innerText = "Processing...";
        btn.disabled = true;

        try {
            const resp = await fetch('/api/download-pdf', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ content: localStorage.getItem('finalContentForSharing') })
            });

            if (resp.ok) {
                const blob = await resp.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a'); a.href = url; a.download = "Report.pdf"; a.click();
                localStorage.setItem('pdfStatus', 'success');
            } else {
                localStorage.setItem('pdfStatus', 'fail');
                alert("Retry failed.");
            }
        } catch (e) {
            localStorage.setItem('pdfStatus', 'fail');
        }

        btn.disabled = false;
        updateUI();
    };

    updateUI(); // 初始載入
});