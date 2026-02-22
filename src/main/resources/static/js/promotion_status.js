document.addEventListener("DOMContentLoaded", function() {
    const ICON_OK = "../image/fulfil.png";
    const ICON_FAIL = "../image/failure.png";

    const updateUI = () => {
        const eStatus = localStorage.getItem('emailStatus');
        const pStatus = localStorage.getItem('pdfStatus');

        // Email 處理
        const rowEmail = document.getElementById('row-email');
        const imgEmail = document.getElementById('img-email');
        const btnEmail = document.getElementById('btn-email');

        if (eStatus === 'none' || !eStatus) {
            rowEmail.classList.add('hidden');
        } else {
            rowEmail.classList.remove('hidden');
            imgEmail.src = (eStatus === 'success') ? ICON_OK : ICON_FAIL;
            if (eStatus === 'fail') btnEmail.classList.remove('hidden');
            else btnEmail.classList.add('hidden');
        }

        // PDF 處理
        const rowPdf = document.getElementById('row-pdf');
        const imgPdf = document.getElementById('img-pdf');
        const btnPdf = document.getElementById('btn-pdf');

        if (pStatus === 'none' || !pStatus) {
            rowPdf.classList.add('hidden');
        } else {
            rowPdf.classList.remove('hidden');
            imgPdf.src = (pStatus === 'success') ? ICON_OK : ICON_FAIL;
            if (pStatus === 'fail') btnPdf.classList.remove('hidden');
            else btnPdf.classList.add('hidden');
        }
    };

    // 重試寄信
    document.getElementById('btn-email').onclick = async function() {
        this.disabled = true;
        this.innerHTML = '<span class="spinner"></span>Processing...';
        try {
            const resp = await fetch('/api/send-to-audience', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    audience: localStorage.getItem('audienceSelection'),
                    content: localStorage.getItem('finalContentForSharing')
                })
            });
            localStorage.setItem('emailStatus', resp.ok ? 'success' : 'fail');
        } catch (e) { localStorage.setItem('emailStatus', 'fail'); }
        this.disabled = false;
        this.innerText = "Retry";
        updateUI();
    };

    // 重試 PDF
    document.getElementById('btn-pdf').onclick = async function() {
        this.disabled = true;
        this.innerHTML = '<span class="spinner"></span>Processing...';
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
            } else { localStorage.setItem('pdfStatus', 'fail'); }
        } catch (e) { localStorage.setItem('pdfStatus', 'fail'); }
        this.disabled = false;
        this.innerText = "Retry";
        updateUI();
    };

    updateUI();
});