package com.roomiq.chat.entities;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
//@NoArgsConstructor
@AllArgsConstructor
public class Message {
    private String id;
    private String sender;
    private String content;
    private LocalDateTime timestamp;

    public Message() {
        this.id = UUID.randomUUID().toString();
    }

    public Message(String sender, String content) {
        this.sender = sender;
        this.content = content;
        this.timestamp = LocalDateTime.now();
    }

}
