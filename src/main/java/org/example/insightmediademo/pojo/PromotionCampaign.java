package org.example.insightmediademo.pojo;

public class PromotionCampaign {
    private Integer id;
    private String fingerprint;
    private String title;
    private String previewText;
    private String originalUrl;
    private String audienceType;
    private String uploaderEmail;
    private String status;

    public PromotionCampaign() {
    }

    public PromotionCampaign(Integer id, String fingerprint, String title,
                             String previewText, String originalUrl,
                             String audienceType, String uploaderEmail,
                             String status) {
        this.id = id;
        this.fingerprint = fingerprint;
        this.title = title;
        this.previewText = previewText;
        this.originalUrl = originalUrl;
        this.audienceType = audienceType;
        this.uploaderEmail = uploaderEmail;
        this.status = status;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getFingerprint() {
        return fingerprint;
    }

    public void setFingerprint(String fingerprint) {
        this.fingerprint = fingerprint;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getPreviewText() {
        return previewText;
    }

    public void setPreviewText(String previewText) {
        this.previewText = previewText;
    }

    public String getOriginalUrl() {
        return originalUrl;
    }

    public void setOriginalUrl(String originalUrl) {
        this.originalUrl = originalUrl;
    }

    public String getAudienceType() {
        return audienceType;
    }

    public void setAudienceType(String audienceType) {
        this.audienceType = audienceType;
    }

    public String getUploaderEmail() {
        return uploaderEmail;
    }

    public void setUploaderEmail(String uploaderEmail) {
        this.uploaderEmail = uploaderEmail;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
