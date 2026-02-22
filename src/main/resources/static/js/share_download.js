document.addEventListener("DOMContentLoaded", function() {
    const audienceType = localStorage.getItem('audienceSelection') || "public";
    const finalContent = localStorage.getItem('finalContentForSharing') || "";
    const emailBody = document.getElementById("email-body");
    const inputTo = document.getElementById("input-to");

    // --- 修正預覽受眾顯示 ---
    if (emailBody) emailBody.innerHTML = finalContent;
    if (inputTo) inputTo.value = `Target: ${audienceType} group`; // 這裡把 Placeholder 改成 Value

    document.getElementById('confirm-button').addEventListener('click', async () => {
        const isEmail = document.getElementById('check-email').checked;
        const isPdf = document.getElementById('check-pdf').checked;

        // 這裡很重要：先預設為 fail，只有 fetch 成功才改成 success
        let emailStatus = isEmail ? 'fail' : 'none';
        let pdfStatus = isPdf ? 'fail' : 'none';

        if (isEmail) {
            try {
                const resp = await fetch('/api/send-to-audience', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ audience: audienceType, content: finalContent })
                });
                if (resp.ok) emailStatus = 'success'; // 只有 200 OK 才會變 success
            } catch (e) { console.error(e); }
        }

        if (isPdf) {
            try {
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
            } catch (e) { console.error(e); }
        }

        localStorage.setItem('emailStatus', emailStatus);
        localStorage.setItem('pdfStatus', pdfStatus);
        window.location.href = 'promotion_status.html';
    });
});