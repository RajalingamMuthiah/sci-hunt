package com.scientishunt;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableMongoAuditing
public class ScientisHuntApplication {

    public static void main(String[] args) {
        SpringApplication.run(ScientisHuntApplication.class, args);
    }
}
