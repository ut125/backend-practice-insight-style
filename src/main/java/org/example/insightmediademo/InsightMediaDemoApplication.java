package org.example.insightmediademo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import javax.sql.DataSource;
import java.sql.Connection;

@SpringBootApplication
public class InsightMediaDemoApplication {

    /*public static void main(String[] args) {

        SpringApplication.run(InsightMediaDemoApplication.class, args);
    }*/
    public static void main(String[] args) {
        var context = SpringApplication.run(InsightMediaDemoApplication.class, args);

        // 直接從 Spring context 拿 DataSource
        DataSource dataSource = context.getBean(DataSource.class);

        try (Connection conn = dataSource.getConnection()) {
            System.out.println("資料庫連線成功!");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
