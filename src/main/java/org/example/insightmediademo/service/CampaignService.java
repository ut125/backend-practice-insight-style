package org.example.insightmediademo.service;

import org.example.insightmediademo.pojo.PromotionCampaign;

public interface CampaignService {
    // 處理上傳，回傳生成的資料庫 ID
    Integer handleNewUpload(String title, String content);

    // 更新資料
    void updateCampaignInfo(PromotionCampaign campaign);

    // 計算內容指紋
    String generateFingerprint(String title, String content);
}
