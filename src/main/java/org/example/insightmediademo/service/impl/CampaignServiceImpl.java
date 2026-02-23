package org.example.insightmediademo.service.impl;

import org.example.insightmediademo.mapper.CampaignMapper;
import org.example.insightmediademo.pojo.PromotionCampaign;
import org.example.insightmediademo.service.CampaignService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;

import java.nio.charset.StandardCharsets;

@Service
public class CampaignServiceImpl implements CampaignService {

    // 注入你寫的 MyBatis Mapper
    @Autowired
    private CampaignMapper campaignMapper;

    // --- 1. 計算指紋的功能 ---
    @Override
    public String generateFingerprint(String title, String content) {
        String preview = content.length() > 50 ? content.substring(0, 50) : content;
        return DigestUtils.md5DigestAsHex((title + preview).getBytes(StandardCharsets.UTF_8));
    }

    // --- 2. 處理上傳時的檢查與存儲邏輯 ---
    @Override
    public Integer handleNewUpload(String title, String content) {
        String fp = generateFingerprint(title, content);
        if (campaignMapper.countByFingerprint(fp) > 0) {
            return -1; // 已存在
        }

        // 建立新物件並存入
        PromotionCampaign campaign = new PromotionCampaign();
        campaign.setFingerprint(fp);
        campaign.setTitle(title);
        campaign.setPreviewText(content.substring(0, Math.min(content.length(), 200)));

        campaignMapper.insert(campaign);
        return campaign.getId();
    }

    // --- 3. 更新後續資料 (網址、受眾、狀態) ---
    @Override
    public void updateCampaignInfo(PromotionCampaign campaign) {
        campaignMapper.update(campaign);
    }

}
