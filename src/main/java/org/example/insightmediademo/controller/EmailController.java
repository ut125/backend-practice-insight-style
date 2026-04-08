package org.example.insightmediademo.controller;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class EmailController {
    @Autowired
    private JavaMailSender mailSender;

    //application.properties
    @Value("${spring.mail.username}")
    private String senderEmail;

    @Value("${app.audience.Policy:}")
    private String policyEmails;

    @Value("${app.audience.Industry:}")
    private String marketEmails;

    @Value("${app.audience.Academia:}")
    private String academicEmails;

    @Value("${app.audience.Media:}")
    private String mediaEmails;

    @Value("${app.audience.public:}")
    private String publicEmails;

    @PostMapping("/send-to-audience")
    public ResponseEntity<String> sendToAudience(@RequestBody Map<String, String> request) {
        //return ResponseEntity.status(500).body("模擬的寄信失敗錯誤");

        String audienceType = request.get("audience");
        String content = request.get("content");

        //根據受眾類型選擇Email
        String targetEmails = switch (audienceType) {
            case "Policy" -> policyEmails;
            case "Industry" -> marketEmails;
            case "Academia" -> academicEmails;
            case "Media" -> mediaEmails;
            default -> publicEmails;
        };

        if (targetEmails.isEmpty()) {
            return ResponseEntity.status(400).body("Error: No recipients found.");
        }

        //將EMAIL分開
        List<String> recipients = Arrays.asList(targetEmails.split(","));

        //循環寄信
        try {
            for (String email : recipients) {
                sendSingleEmail(email.trim(), content);
            }
            return ResponseEntity.ok("Sent to " + recipients.size() + " recipients.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Fail: " + e.getMessage());
        }
    }

    //寄信
    private void sendSingleEmail(String to, String content) throws Exception {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(senderEmail);
        helper.setTo(to);
        helper.setSubject("來自 Insight Media 的分析報告");
        helper.setText("<html><body>" + content + "</body></html>", true);
        mailSender.send(message);
    }
}
