document.addEventListener("DOMContentLoaded", function() {
    const audienceType = localStorage.getItem('audienceSelection') || "public";
    const finalContent = localStorage.getItem('finalContentForSharing') || "";
    const emailBody = document.getElementById("email-body");
    const inputTo = document.getElementById("input-to");

    // --- 修正預覽受眾顯示 ---
    if (emailBody) emailBody.innerHTML = finalContent;
    if (inputTo) inputTo.value = `Target: ${audienceType} group`; // 這裡把 Placeholder 改成 Value

    // share_download.js 裡面的 Confirm 事件
    document.getElementById('confirm-button').addEventListener('click', async function() {
        const confirmBtn = this; // 取得按鈕本人
        const isEmail = document.getElementById('check-email').checked;
        const isPdf = document.getElementById('check-pdf').checked;
        const finalContent = localStorage.getItem('finalContentForSharing') || "";
        const audienceType = localStorage.getItem('audienceSelection') || "public";

        // 1. 文字變更為 Processing 並停用按鈕防止重複點擊
        confirmBtn.innerText = "Processing...";
        confirmBtn.disabled = true;

        let emailStatus = isEmail ? 'fail' : 'none';
        let pdfStatus = isPdf ? 'fail' : 'none';

        try {
            if (isEmail) {
                const resp = await fetch('/api/send-to-audience', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ audience: audienceType, content: finalContent })
                });
                if (resp.ok) emailStatus = 'success';
            }

            if (isPdf) {
                const resp = await fetch('/api/download-pdf', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content: finalContent })
                });
                if (resp.ok) {
                    const blob = await resp.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a'); a.href = url; a.download = "Report.pdf"; a.click();
                    pdfStatus = 'success';
                }
            }
        } catch (e) {
            console.error("Connection Error", e);
        }

        // 2. 存入狀態並跳轉
        localStorage.setItem('emailStatus', emailStatus);
        localStorage.setItem('pdfStatus', pdfStatus);
        window.location.href = 'promotion_status.html';
    });
});