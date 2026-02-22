document.addEventListener('DOMContentLoaded', function () {
    /* ==========================================================================
       1. CONSTANTS & STATE
       ========================================================================== */

    const page = {
        container: document.getElementById('page-container'),
        progressBar: document.getElementById('progress-bar-container'),
        backBtn: document.querySelector('.back-btn'),
        selectionView: document.getElementById('selection-view'),
        selectContainer: document.getElementById('content-type-select'),
        selectSelectedText: document.querySelector('#content-type-select .select-selected span'),
        selectItems: document.querySelector('#content-type-select .select-items'),
        versionA: document.getElementById('version-a-btn'),
        versionB: document.getElementById('version-b-btn'),
        contentDisplay: document.getElementById('content-text-display'),
        versionWatermark: document.getElementById('version-watermark'),
        editBtn: document.getElementById('edit-btn'),
        continueBtn: document.getElementById('continue-to-share'),
        editingView: document.getElementById('editing-view'),
        editableContent: document.getElementById('editable-content'),
        saveBtn: document.getElementById('save-btn'),
        cancelBtn: document.getElementById('cancel-btn'),
        rteToolbar: document.querySelector('.rte-toolbar'),
        colorBtn: document.getElementById('tool-color'),
        colorPalette: document.getElementById('color-palette'),
        colorIndicator: document.getElementById('color-indicator-bar'),
        highlightBtn: document.getElementById('tool-highlight'),
        highlightPalette: document.getElementById('highlight-palette'),
        highlightIndicator: document.getElementById('highlight-indicator-bar'),
        alignBtn: document.getElementById('tool-align'),
        alignMenu: document.getElementById('align-menu'),
        aiBtn: document.getElementById('ai-tool-btn'),
        aiMenu: document.getElementById('ai-menu'),
        pictureToolBtn: document.getElementById('picture-tool-btn'),
        picturePanel: document.getElementById('picture-panel'),
        fontSelect: document.querySelector('.font-select'),
        sizeSelect: document.querySelector('.size-select'),
        sizeIncreaseBtn: document.getElementById('size-increase'),
        sizeDecreaseBtn: document.getElementById('size-decrease'),
        toolSpacing: document.getElementById('tool-spacing'),
        closePicturePanelBtn: document.getElementById('close-picture-panel'),
        pictureSourceSelect: document.getElementById('picture-source-select'),
        toolList: document.getElementById('tool-list'),
    };

    const sessionId = localStorage.getItem('session_id');
    const audience = localStorage.getItem('audienceSelection');
    let allContent = {}; // 保存所有内容
    let contentType = 'summary';
    let version = 'A';

    // 1. 页面加载时请求
    async function fetchAllContent() {
        const pdfText = localStorage.getItem('pdfContent');
        if (!pdfText) {
            page.contentDisplay.innerHTML = '<span style="color:red;">找不到 PDF 內容</span>';
            return;
        }

        page.contentDisplay.innerHTML = '<em>AI 正在分析 PDF...</em>';

        try {
            const resp = await fetch('/api/generate_content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: pdfText,
                    audience: audience
                })
            });

            if (resp.ok) {
                const data = await resp.json();

                // --- 關鍵：統一更新 mockData ---
                mockData = data;

                // 預設選中 summary 和 A 版
                state.type = 'summary';
                state.version = 'A';

                // 渲染 UI
                updateSelectionViewUI();
            } else {
                page.contentDisplay.innerHTML = '<span style="color:red;">後端錯誤</span>';
            }
        } catch (e) {
            page.contentDisplay.innerHTML = `<span style="color:red;">連線失敗: ${e.message}</span>`;
        }
    }


    const textColors = ['black', 'blue', 'green', '#E69900', 'red'];
    const highlightColors = ['transparent', 'lightblue', 'lightgreen', 'yellow', 'lightcoral'];
    let state = { type: 'summary', version: 'A' };
    let mockData = {
        summary: { A: `MVP 3: Automatically generate a summary article...`, B: `B-Version Summary...` },
        press: { A: `FOR IMMEDIATE RELEASE: (A-Version)...`, B: `FOR IMMEDIATE RELEASE: (B-Version)...` }
    };

    /* ==========================================================================
       2. CORE FUNCTIONS (State, UI, RTE)
       ========================================================================== */

    function loadState() {
        const savedState = localStorage.getItem('contentPageState');
        if (savedState) state = JSON.parse(savedState);
        const savedContent = localStorage.getItem('contentData');
        if (savedContent) mockData = JSON.parse(savedContent);
    }

    function saveState() {
        localStorage.setItem('contentPageState', JSON.stringify(state));
        localStorage.setItem('contentData', JSON.stringify(mockData));
    }

    function updateSelectionViewUI() {
        const { type, version } = state;

        // 從 mockData 讀取
        const content = (mockData[type] && mockData[type][version]) ? mockData[type][version] : "無內容";
        page.contentDisplay.innerHTML = content;

        // 更新浮水印
        page.versionWatermark.textContent = `${version}-Version`;

        // 更新按鈕高亮狀態
        page.versionA.classList.toggle('active', version === 'A');
        page.versionB.classList.toggle('active', version === 'B');

        // 更新下拉選單文字
        const selectedOption = page.selectItems.querySelector(`[data-value="${type}"]`);
        if (selectedOption) page.selectSelectedText.textContent = selectedOption.textContent;
    }

    function switchView(mode) {
        const isEditing = mode === 'edit';
        page.container.classList.toggle('is-editing', isEditing);
        if (isEditing) {
            page.editableContent.innerHTML = page.contentDisplay.innerHTML;
            page.editableContent.focus();
            updateToolbarState();
        } else {
            page.container.classList.remove('is-editing-picture');
        }
    }

    function formatDoc(command, value = null) {
        if (command.startsWith('justify')) {
            const selection = window.getSelection();
            if (!selection.rangeCount) return;
            const range = selection.getRangeAt(0);
            const listItems = new Set();
            let container = range.commonAncestorContainer;



            if (listItems.size > 0) {
                const alignment = command.replace('justify', '').toLowerCase();
                listItems.forEach(li => { li.style.textAlign = alignment; });
            } else {
                document.execCommand(command, false, value);
            }
        } else if (command === 'hiliteColor' || command === 'backColor') {
            document.execCommand('styleWithCSS', false, true);
            document.execCommand('backColor', false, value);
            document.execCommand('styleWithCSS', false, false);
        } else {
            document.execCommand(command, false, value);
        }
        page.editableContent.focus();
        updateToolbarState();
    }

    function updateToolbarState() {
        ['bold', 'italic', 'underline', 'insertUnorderedList'].forEach(command => {
            const btnId = command === 'insertUnorderedList' ? 'tool-list' : `tool-${command}`;
            document.getElementById(btnId)?.classList.toggle('active', document.queryCommandState(command));
        });
        try {
            const textColor = document.queryCommandValue('foreColor');
            page.colorIndicator.style.backgroundColor = textColor || 'black';
            const bgColor = document.queryCommandValue('backColor');
            page.highlightIndicator.style.backgroundColor = (bgColor === 'transparent' || bgColor === 'rgba(0, 0, 0, 0)') ? 'transparent' : bgColor;
        } catch (e) {
            console.error("Could not query command value:", e);
        }
    }

    function generateColorBoxes(paletteElement, colors, command) {
        paletteElement.innerHTML = '';
        colors.forEach(color => {
            const box = document.createElement('div');
            box.className = 'color-box';
            box.style.backgroundColor = color;
            if (color === 'transparent') box.style.border = '1px solid #ccc';
            box.addEventListener('mousedown', e => { e.preventDefault(); formatDoc(command, color); });
            paletteElement.appendChild(box);
        });
    }

    function closeAllPalettes() {
        document.querySelectorAll('.tool-palette, .select-items').forEach(p => p.classList.add('select-hide'));
        document.querySelectorAll('.tool-btn.active').forEach(b => b.classList.remove('active'));
    }

    /* ==========================================================================
       3. EVENT LISTENERS
       ========================================================================== */

    // --- Main View & Navigation ---
    page.editBtn.addEventListener('click', () => switchView('edit'));
    page.cancelBtn.addEventListener('click', () => switchView('select'));
    page.saveBtn.addEventListener('click', () => {
        mockData[state.type][state.version] = page.editableContent.innerHTML;
        saveState();
        updateSelectionViewUI();
        switchView('select');
    });
    page.continueBtn.addEventListener('click', () => {
        // 確保所有狀態都已保存
        saveState();

        // 將最終顯示的 HTML 內容存入 localStorage 以便下一頁使用
        localStorage.setItem('finalContentForSharing', page.contentDisplay.innerHTML);

        // 跳轉到分享頁面
        window.location.href = 'share_download.html';
    });

    // --- Selection View Controls ---
    page.selectContainer.addEventListener('click', (e) => {
        e.stopPropagation();
        closeAllPalettes();
        page.selectItems.classList.toggle('select-hide');
    });
    // 類型切換 (下拉選單)
    page.selectItems.addEventListener('click', (e) => {
        const target = e.target.closest('[data-value]');
        if (target) {
            state.type = target.dataset.value;
            updateSelectionViewUI();
        }
    });

    // 版本 A 切換
    page.versionA.addEventListener('click', () => {
        state.version = 'A';
        updateSelectionViewUI();
    });

    // 版本 B 切換
    page.versionB.addEventListener('click', () => {
        state.version = 'B';
        updateSelectionViewUI();
    });
    // --- Toolbar Direct Actions ---
    page.rteToolbar.addEventListener('mousedown', e => {
        const button = e.target.closest('.tool-btn');
        if (!button || button.closest('.tool-palette-container') || button.closest('.ai-select') || button.closest('.font-size-group')) return;
        e.preventDefault();
        const commands = {
            'tool-undo': 'undo', 'tool-redo': 'redo', 'tool-bold': 'bold',
            'tool-italic': 'italic', 'tool-underline': 'underline',
        };
        if (commands[button.id]) formatDoc(commands[button.id]);
    });

    // --- Toolbar Palettes & Menus ---
    function setupPaletteToggle(button, palette) {
        button.addEventListener('click', e => {
            e.stopPropagation();
            const isHidden = palette.classList.contains('select-hide');
            closeAllPalettes();
            if (isHidden) {
                palette.classList.remove('select-hide');
                button.classList.add('active');
                const paletteRect = palette.getBoundingClientRect();
                palette.classList.toggle('align-right', paletteRect.right > window.innerWidth);
            }
        });
    }
    setupPaletteToggle(page.colorBtn, page.colorPalette);
    setupPaletteToggle(page.highlightBtn, page.highlightPalette);
    setupPaletteToggle(page.alignBtn, page.alignMenu);

    page.alignMenu.addEventListener('mousedown', e => {
        const target = e.target.closest('[data-align]');
        if (target) { e.preventDefault(); formatDoc(target.dataset.align); }
    });

    // --- AI Menu ---
    page.aiBtn.addEventListener('click', e => {
        e.stopPropagation();
        const isHidden = page.aiMenu.classList.contains('select-hide');
        closeAllPalettes();
        if (isHidden) {
            page.aiMenu.classList.remove('select-hide');
            page.aiBtn.classList.add('active');
            const menuRect = page.aiMenu.getBoundingClientRect();
            // AI menu is left-aligned by default, switch to right if it goes off-screen
            page.aiMenu.classList.toggle('align-right', menuRect.right > window.innerWidth);

            if (menuRect.right > window.innerWidth) {
                // If it is, align it to the right of the button
                page.aiMenu.classList.add('align-right');
            } else {
                // Otherwise, ensure it's left-aligned (the default)
                page.aiMenu.classList.remove('align-right');
            }
        }
    });

    // --- AI Menu ---
    page.aiMenu.addEventListener('click', (e) => {
        const target = e.target.closest('[data-action]');
        if (target) {
            // 修正3：為 AI 選單添加提示
            alert(`AI Action: '${target.dataset.action}' is a future feature!`);
            closeAllPalettes();
        }
    });

    // --- Picture Panel ---
    page.pictureToolBtn.addEventListener('click', () => {
        page.container.classList.add('is-editing-picture'); // Always show when clicked
    });

    page.closePicturePanelBtn.addEventListener('click', () => {
        page.container.classList.remove('is-editing-picture'); // Close button hides it
    });

    page.picturePanel.addEventListener('click', (e) => {
        const targetImg = e.target.closest('.image-previews img');
        const targetMore = e.target.closest('.show-more-btn');

        if (targetImg || targetMore) {
            alert('Image selection is a future feature!');
        }
    });

    const picSelectHeader = page.pictureSourceSelect.querySelector('.select-selected');
    const picSelectItems = page.pictureSourceSelect.querySelector('.select-items');

    picSelectHeader.addEventListener('click', (e) => {
        e.stopPropagation();
        // 關閉其他面板，然後切換當前面板
        closeAllPalettes();
        picSelectItems.classList.toggle('select-hide');
    });


    // Picture source dropdown
    picSelectItems.addEventListener('click', (e) => {
        e.stopPropagation(); // 阻止事件冒泡到 picturePanel
        const target = e.target.closest('[data-value]');
        if (target) {
            picSelectHeader.innerHTML = target.innerHTML + '<img src="../image/Dropdown_1.png" alt="v" class="dropdown-arrow">';
            picSelectItems.classList.add('select-hide');
        }
    });



    // --- Future Feature Placeholders ---
    page.toolSpacing.addEventListener('click', () => alert('Line Spacing is a future feature!'));
    page.fontSelect.addEventListener('click', () => alert('Font selection is a future feature!'));
    page.sizeIncreaseBtn.addEventListener('click', () => alert('Font size is a future feature!'));
    page.sizeDecreaseBtn.addEventListener('click', () => alert('Font size is a future feature!'));
    page.toolList.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Bulleted List alignment is a future feature!');
    });

    // --- Global Click to close all menus ---
    document.addEventListener('click', () => closeAllPalettes());

    // --- Editor Interaction ---
    page.editableContent.addEventListener('keyup', updateToolbarState);
    page.editableContent.addEventListener('mouseup', updateToolbarState);
    page.editableContent.addEventListener('focus', updateToolbarState);

    /* ==========================================================================
       4. INITIALIZATION
       ========================================================================== */
    loadState();
    updateSelectionViewUI(); // This now correctly shows summary-a on load
    generateColorBoxes(page.colorPalette, textColors, 'foreColor');
    // 修正：使用 backColor 命令
    generateColorBoxes(page.highlightPalette, highlightColors, 'backColor');

    fetchAllContent();

    page.versionA.addEventListener('click', () => {
        version = 'A';
        updateSelectionViewUI();
    });
    page.versionB.addEventListener('click', () => {
        version = 'B';
        updateSelectionViewUI();
    });
    page.selectItems.addEventListener('click', (e) => {
        const target = e.target.closest('[data-value]');
        if (target) {
            contentType = target.dataset.value;
            updateSelectionViewUI();
        }
    });

    // Define the automatic request function
    async function fetchAudienceContacts() {
        if (!sessionId || !audience) return;
        try {
            const resp = await fetch('http://localhost:8000/find_audience_contacts', { // 如果這也要連 Java，請改埠號和路徑
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    session_id: sessionId,
                    audience: audience
                })
            });

            // 這裡不要再 const data 了，因為上面 fetchAllContent 用過了或者會衝突
            const resultData = await resp.json();
            if (resp.ok) {
                console.log(`Audience count: ${resultData.count || 'N/A'}`);
            }
        } catch (e) {
            console.error(`Request error: ${e.message}`);
        }
    }

    // Automatically call on page load
    fetchAudienceContacts();

});