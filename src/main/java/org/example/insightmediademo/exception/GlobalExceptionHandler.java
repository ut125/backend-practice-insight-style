package org.example.insightmediademo.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    // 專門處理「檔案過大」
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<Map<String, String>> handleMaxSizeException(MaxUploadSizeExceededException exc) {
        Map<String, String> result = new HashMap<>();
        result.put("error", "File too large! Max limit is 10MB.");
        return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE).body(result);
    }

    // 處理其他未知的系統錯誤
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGeneralException(Exception exc) {
        Map<String, String> result = new HashMap<>();
        result.put("error", "System Error: " + exc.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
    }
}
