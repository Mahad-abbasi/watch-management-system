package com.wms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class WatchManagementSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(WatchManagementSystemApplication.class, args);
        System.out.println("=================================================");
        System.out.println("🚀 TIME SPHERE BACKEND SERVICE IS LIVE ON PORT 8080");
        System.out.println("=================================================");
    }
}