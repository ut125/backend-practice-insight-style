package org.example.insightmediademo.controller;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class TextController {

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
}