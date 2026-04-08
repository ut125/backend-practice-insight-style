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
    //注入業務邏輯層 (Service)
    private CampaignService campaignService;

    //index.js
    @PostMapping("/upload")
    public ResponseEntity<?> uploadPDF(@RequestParam("file") MultipartFile file) {
        try {
            //取PDF內容
            PDDocument document = PDDocument.load(file.getInputStream());
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);
            document.close();

            //抓取第一行作為標題
            String title = "Untitled Document";
            if (text != null && !text.trim().isEmpty()) {
                String[] lines = text.trim().split("\\r?\\n");
                if (lines.length > 0) {
                    title = lines[0].trim();
                    if (title.length() > 100) title = title.substring(0, 100); // 長度限制
                }
            }

            //呼叫 Service 處理去重與存儲
            //CampaignServiceImpl
            Integer dbId = campaignService.handleNewUpload(title, text);

            if (dbId == -1) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "This file already exists.");
                return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
            }

            //封裝結果回傳給前端
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

            campaignService.updateCampaignInfo(campaign);

            return ResponseEntity.ok("URL updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
}
