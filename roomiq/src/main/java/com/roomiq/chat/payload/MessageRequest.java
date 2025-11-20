package com.roomiq.chat.payload;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class MessageRequest {
    private String roomId;
    private String sender;
    private String content;
    private LocalDateTime localDateTime;

    public MessageRequest() {
        this.localDateTime = LocalDateTime.now();
    }
}
