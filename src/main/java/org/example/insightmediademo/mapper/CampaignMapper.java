package org.example.insightmediademo.mapper;

import org.apache.ibatis.annotations.*;
import org.example.insightmediademo.pojo.PromotionCampaign;

@Mapper
public interface CampaignMapper {
    // 插入新紀錄 (去重邏輯會在 Service 處理)
    @Insert("INSERT INTO promotion_campaigns(fingerprint, title, preview_text) " +
            "VALUES(#{fingerprint}, #{title}, #{previewText})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(PromotionCampaign campaign);

    // 檢查指紋是否存在
    @Select("SELECT COUNT(*) FROM promotion_campaigns WHERE fingerprint = #{fp}")
    int countByFingerprint(String fp);

    // 根據 ID 更新後續資料 (網址、受眾、聯絡方式)
    @Update("UPDATE promotion_campaigns SET original_url=#{originalUrl}, " +
            "audience_type=#{audienceType}, uploader_email=#{uploaderEmail}, " +
            "status=#{status} WHERE id=#{id}")
    int update(PromotionCampaign campaign);
}
