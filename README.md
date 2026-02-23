# backend-practice-insight-style
This is a personal backend practice project inspired by a previous academic collaboration project.<br>
All code is independently rewritten and does not contain any proprietary or confidential information.

# Insight Media - 智能研究推廣平台 (Full-Stack Demo)
這是一個全棧（Full-Stack）網頁應用程式，旨在協助研究人員將複雜的 PDF 論文快速轉化為適合不同受眾（政策制定者、媒體、學術界等）的推廣文章，並一鍵完成郵件分發與文件下載。

## 🚀 技術棧 (Tech Stack)
### ⚙️ 後端 (Backend)

<b> Java 17 & Spring Boot 3.x </b> <br>
<br>
<b> Spring Mail: </b> 處理自動化郵件群發邏輯。<br>
<br>
<b> Apache PDFBox:</b>  解析上傳的 PDF 原始文件。<br>
<br>
<b> OpenPDF (iText):</b>  動態生成包含研究摘要的 PDF 下載檔。<br>
<br>
<b> RESTful API:</b>  前後端分離架構設計。<br>

### 🖥️ 前端 (Frontend)

<b> HTML5 / CSS3 / JavaScript (Vanilla JS)</b> <br>
<br>
<b> LocalStorage:</b>  實現跨頁面資料持久化與狀態管理。<br>
<br>
<b> Fetch API: </b> 非同步處理數據傳輸。<br>

## 🛠️ 專案進度 (Progress)
### ✅ 已完成功能

<b> PDF 檔案上傳與解析:</b>  後端能準確提取 PDF 文字並傳回前端。<br>
<br>
<b> 模擬 AI 內容生成:</b>  根據 PDF 標題與內容，自動產生多版本（新聞稿/摘要）的推廣文案。<br>
<br>
<b> 富文本編輯器:</b>  使用者可自訂字體顏色、樣式並即時儲存。<br>
<br>
<b> 自動化郵件發送系統:</b>  整合 Google SMTP 服務，根據受眾類型實現一鍵群發。<br>
<br>
<b> 動態 PDF 報告生成:</b>  支援將編輯後的成果導出為 PDF 文件。<br>
<br>
<b> 任務狀態追蹤器:</b>  即時顯示各項任務執行結果，並提供原地重試 (Retry) 機制。<br>

### ⏳ 未完成/待開發 (Roadmap)

<b> 資料庫持久化:</b> 引入 MyBatis/JPA，將受眾名單與發送紀錄存入 MySQL。<br>
<br>
<b> AI API 真正對接: </b>預計接入 Google Gemini 或 OpenAI API 實現真正的智慧摘要。<br>
<br>
<b> 社群平台分享:</b> 實作 LinkedIn 與 Facebook 的 API 串接。<br>
<br>
<b> 進階點閱統計: </b>自建 Tracking Pixel 以統計郵件開啟率。<br>

## 📈 計畫變更說明 (Project Evolution)

在開發過程中，我根據開發成本與技術展示需求，對原計畫進行了靈活調整：<br>

|階段|	原計畫 (Original)	| 更改後計畫 (Modified)                 | 	變更原因                               |
|---|---|----------------------------------|-------------------------------------|
|內容生成	|調用 OpenAI 付費 API	| Java 後端模擬生成邏輯，預計接入 Google Gemini | 	節省初期開發成本，同時專注於鍛鍊 Java 邏輯處理能力。      |
|發送統計|	使用 Mailchimp 服務| 	自建 Java Mail + 狀態追蹤頁	           | 為了展示全棧開發能力，包含後端 SMTP 串接與前端動態狀態判斷邏輯。 |
|資料存儲	|直接存入資料庫	| LocalStorage 暫存                  | 	MVP 階段優先確保「數據流」通暢，後續再擴展至資料庫。       |

## 💡 開發亮點 (Key Highlights for Interviewers)

<b> 安全性意識:</b> 敏感資訊（如 SMTP 密碼、受眾名單）皆不寫死於程式碼中，而是透過環境變數與 .gitignore 管理，防止外洩。<br>
<br>
<b> 優質 UX 設計:</b> 實作了 Status Tracker 頁面，針對異步任務（Async Tasks）提供明確的視覺反饋與錯誤恢復機制（Retry）。<br>
<br>
<b> 架構分工清晰:</b> 前端負責狀態管理與互動，Java 後端專注於高價值的 I/O 任務（文件解析、郵件協議）。<br>

## ⚙️ 如何執行 (Setup)

複製專案至本地。<br>

在 src/main/resources/ 下參考 application.properties.example 建立 application.properties。<br>

填入您的 Gmail 應用程式密碼。<br>

執行 InsightMediaDemoApplication.java。<br>

瀏覽 http://localhost:8080/html/index.html。<br>
