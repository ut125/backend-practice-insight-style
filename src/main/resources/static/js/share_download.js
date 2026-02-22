document.addEventListener("DOMContentLoaded", function() {
    const emailBody = document.getElementById("email-body");
    const confirmBtn = document.getElementById("confirm-button");

    // 1. 從 LocalStorage 載入內容
    const finalContent = localStorage.getItem('finalContentForSharing') || "<p>No content available.</p>";
    const audienceType = localStorage.getItem('audienceSelection') || "public";

    // 顯示在預覽區
    emailBody.innerHTML = finalContent;
    document.getElementById('input-to').placeholder = `Sending to: ${audienceType} group`;

    // 2. 點擊 Confirm 按鈕
    confirmBtn.addEventListener('click', async () => {
        const isEmail = document.getElementById('check-email').checked;
        const isPdf = document.getElementById('check-pdf').checked;

        // 驗證：至少選一個
        if (!isEmail && !isPdf) {
            alert("Please select at least one option (Email or PDF).");
            return;
        }

        confirmBtn.disabled = true;
        confirmBtn.innerText = "Processing...";

        try {
            // A. 如果選了寄信
            if (isEmail) {
                console.log("Sending email to audience:", audienceType);
                const emailResp = await fetch('/api/send-to-audience', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        audience: audienceType,
                        content: finalContent
                    })
                });
                if (!emailResp.ok) throw new Error("Email sending failed");
            }

            // B. 如果選了下載 PDF
            if (isPdf) {
                console.log("Generating PDF...");
                const resp = await fetch('/api/download-pdf', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content: finalContent })
                });

                if (resp.ok) {
                    const blob = await resp.blob(); // 這裡必須是 blob
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = "Report.pdf";
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url); // 釋放記憶體
                    a.remove();
                }
            }

            // 成功後的跳轉
            alert("Operation successful!");
            window.location.href = isEmail ? 'emailSuccess.html' : 'downloadSuccess.html';

        } catch (error) {
            console.error(error);
            alert("Error: " + error.message);
        } finally {
            confirmBtn.disabled = false;
            confirmBtn.innerText = "Confirm";
        }
    });
});