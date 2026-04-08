package org.example.insightmediademo.controller;

import com.lowagie.text.Font;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.BaseFont;
import com.lowagie.text.pdf.PdfWriter;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.*;

import com.lowagie.text.Document;
import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api") //定義此控制器下所有路徑的前綴。
@CrossOrigin(origins = "*")
public class ContentController {

    @PostMapping("/generate_content")//限制只能用 HTTP POST 方法存取
    //content.js拿到前端傳來的 PDF 文字
    public Map<String, Object> generateAllContent(@RequestBody Map<String, String> request) {
        String pdfText = request.get("text");

        // 模擬針對 PDF 內容產出的版本
        String title = "無標題文件";
        if (pdfText != null && !pdfText.isEmpty()) {

            String[] lines = pdfText.trim().split("\\r?\\n");
            if (lines.length > 0) {
                title = lines[0].trim();
                if (title.length() > 50) title = title.substring(0, 50) + "...";
            }
        }

        //模擬AI產出 LLM 的 API!!後面要替換
        Map<String, String> summary = new HashMap<>();
        summary.put("A", "【摘要版 A】針對《" + title + "》的深入研究...");
        summary.put("B", "【摘要版 B】這份關於《" + title + "》的報告指出...");

        Map<String, String> press = new HashMap<>();
        press.put("A", "【新聞稿 A】最新消息：研究員發布了關於《" + title + "》的分析...");
        press.put("B", "【新聞稿 B】本報訊，針對《" + title + "》的討論今日達到高峰...");

        Map<String, Object> allContent = new HashMap<>();
        allContent.put("summary", summary);
        allContent.put("press", press);

        return allContent;
    }

    //share_download.js
    @PostMapping("/download-pdf")
    public void downloadPDF(@RequestBody Map<String, String> request, HttpServletResponse response) {

        String content = request.get("content");
        if (content == null) content = "No content provided";

        String plainText = content.replaceAll("<[^>]*>", "");

        try {
            response.setContentType("application/pdf");
            response.setHeader("Content-Disposition", "attachment; filename=Insight_Report.pdf");

            //建立文件物件 -> 連結輸出流（這裡指向瀏覽器） -> 打開文件
            Document document = new Document(PageSize.A4);
            PdfWriter.getInstance(document, response.getOutputStream());
            document.open();

            //字體
            BaseFont bfChinese = BaseFont.createFont("C:/Windows/Fonts/msjh.ttc,0", BaseFont.IDENTITY_H, BaseFont.NOT_EMBEDDED);
            Font fontTitle = new Font(bfChinese, 16, Font.BOLD);
            Font fontBody = new Font(bfChinese, 12, Font.NORMAL);

            //寫入 PDF
            document.add(new Paragraph("Insight Media Analysis Report"));
            document.add(new Paragraph("--------------------------------------"));
            document.add(new Paragraph(plainText, fontBody));

            document.close();

        } catch (Exception e) {
            System.err.println("PDF 生成錯誤: " + e.getMessage());
            e.printStackTrace();
        }
    }
}