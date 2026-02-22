package org.example.insightmediademo.controller;

import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.*;

import com.lowagie.text.Document;
import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ContentController {

    @PostMapping("/generate_content")
    public Map<String, Object> generateAllContent(@RequestBody Map<String, String> request) {
        String pdfText = request.get("text"); // 拿到前端傳來的 PDF 文字

        // 模擬針對 PDF 內容產出的版本
        String title = "無標題文件";
        if (pdfText != null && !pdfText.isEmpty()) {
            // 先去掉開頭的空白，然後按換行符號分割
            String[] lines = pdfText.trim().split("\\r?\\n");
            if (lines.length > 0) {
                title = lines[0].trim(); // 取第一行
                // 如果第一行太長，再截斷
                if (title.length() > 50) title = title.substring(0, 50) + "...";
            }
        }

        // 建立巢狀結構
        Map<String, String> summary = new HashMap<>();
        summary.put("A", "【摘要版 A】針對《" + title + "》的深入研究...");
        summary.put("B", "【摘要版 B】這份關於《" + title + "》的報告指出...");

        Map<String, String> press = new HashMap<>();
        press.put("A", "【新聞稿 A】最新消息：研究員發布了關於《" + title + "》的分析...");
        press.put("B", "【新聞稿 B】本報訊，針對《" + title + "》的討論今日達到高峰...");

        Map<String, Object> allContent = new HashMap<>();
        allContent.put("summary", summary);
        allContent.put("press", press);

        return allContent; // Spring 會自動把它轉成你 JS 期待的 JSON 格式
    }

    @PostMapping("/download-pdf")
    public void downloadPDF(@RequestBody Map<String, String> request, HttpServletResponse response) {
        // 1. 獲取前端傳來的真正內容
        String content = request.get("content");
        if (content == null) content = "No content provided";

        // 2. 過濾 HTML 標籤（OpenPDF 的 Paragraph 僅支援純文字）
        String plainText = content.replaceAll("<[^>]*>", "");

        try {
            // 3. 設定 Response Header，告訴瀏覽器這是一個 PDF 檔案
            response.setContentType("application/pdf");
            response.setHeader("Content-Disposition", "attachment; filename=Insight_Report.pdf");

            // 4. 初始化 OpenPDF 的 Document
            Document document = new Document(PageSize.A4);

            // 5. 將 Document 綁定到 Response 的輸出流
            PdfWriter.getInstance(document, response.getOutputStream());

            // 6. 開始寫入內容
            document.open();

            // 注意：OpenPDF 預設字體不支援中文。如果你的內容有中文，下載下來會是空白。
            // 我們先測試英文，確認流程正確。
            document.add(new Paragraph("Insight Media Analysis Report"));
            document.add(new Paragraph("--------------------------------------"));
            document.add(new Paragraph(plainText));

            // 7. 關閉 Document (這會完成 PDF 格式的封裝)
            document.close();

        } catch (Exception e) {
            System.err.println("PDF 生成錯誤: " + e.getMessage());
            e.printStackTrace();
        }
    }

}