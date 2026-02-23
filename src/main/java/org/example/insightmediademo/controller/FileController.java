package org.example.insightmediademo.controller;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.example.insightmediademo.pojo.PromotionCampaign;
import org.example.insightmediademo.service.CampaignService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
public class FileController {

    @Autowired
    private CampaignService campaignService; // 這裡注入的是介面

    @PostMapping("/upload")
    public ResponseEntity<?> uploadPDF(@RequestParam("file") MultipartFile file) {
        try {
            // 1. 讀取 PDF 內容 (保留你原本的邏輯)
            PDDocument document = PDDocument.load(file.getInputStream());
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);
            document.close();

            // 2. 額外邏輯：抓取第一行作為標題 (為了存入資料庫)
            String title = "Untitled Document";
            if (text != null && !text.trim().isEmpty()) {
                String[] lines = text.trim().split("\\r?\\n");
                if (lines.length > 0) {
                    title = lines[0].trim();
                    if (title.length() > 100) title = title.substring(0, 100); // 長度限制
                }
            }

            // 3. 呼叫 Service 處理去重與存儲
            // handleNewUpload 會回傳生成的 ID，如果重複則回傳 -1
            Integer dbId = campaignService.handleNewUpload(title, text);

            if (dbId == -1) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "This file already exists.");
                return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
            }

            // 4.封裝結果回傳給前端 (改回傳 JSON，包含文字和資料庫 ID)
            Map<String, Object> response = new HashMap<>();
            response.put("text", text);
            response.put("dbId", dbId);

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            return ResponseEntity.status(500).body("讀取檔案失敗：" + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("系統錯誤：" + e.getMessage());
        }
    }
    @PostMapping("/update-url")
    public ResponseEntity<?> updateUrl(@RequestBody Map<String, String> request) {
        try {
            Integer id = Integer.parseInt(request.get("id"));
            String url = request.get("url");

            PromotionCampaign campaign = new PromotionCampaign();
            campaign.setId(id);
            campaign.setOriginalUrl(url);

            // 呼叫 Service 的 update (之前我們已經寫好了)
            campaignService.updateCampaignInfo(campaign);

            return ResponseEntity.ok("URL updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
}
