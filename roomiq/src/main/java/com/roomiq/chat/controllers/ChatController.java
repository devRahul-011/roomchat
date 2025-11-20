package com.roomiq.chat.controllers;

import com.roomiq.chat.entities.Message;
import com.roomiq.chat.entities.Room;
import com.roomiq.chat.payload.MessageRequest;
import com.roomiq.chat.services.RoomService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Optional;

@CrossOrigin("http://localhost:5173")
//@CrossOrigin("*")
@Controller
public class ChatController {

    private final RoomService roomService;
    private final SimpMessagingTemplate messagingTemplate;

    public ChatController(RoomService roomService, SimpMessagingTemplate messagingTemplate) {
        this.roomService = roomService;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/send/{roomId}")
    @SendTo("/topic/room/{roomId}")
    public Message sendMessage(
            @DestinationVariable String roomId,
            @RequestBody MessageRequest messageRequest
    ) {
        Optional<Room> room = roomService.getRoomById(messageRequest.getRoomId());

        Message message = new Message();
        message.setContent(messageRequest.getContent());
        message.setSender(messageRequest.getSender());
        message.setTimestamp(messageRequest.getLocalDateTime());
        if (room.isPresent()) {
            Room updateRoom = room.get();
            updateRoom.getMessages().add(message);
            roomService.updateRoom(updateRoom.getRoomId(), updateRoom);
        } else {
            throw new RuntimeException("Room not found!");
        }

        return message;
    }


}
