package com.roomiq.chat.controllers;

import com.roomiq.chat.entities.Message;
import com.roomiq.chat.entities.Room;
import com.roomiq.chat.services.RoomService;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin("http://localhost:5173")
@RestController
@RequestMapping("/api/v1/rooms")
public class RoomController {

    private RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @PostMapping
    public ResponseEntity<?> createRoom(@RequestBody String roomId){
        if(roomService.getRoomById(roomId.trim()).isPresent()){
            return ResponseEntity.badRequest().body("Room already exists!");
        }

        Room room = new Room();
        room.setRoomId(roomId);
        Room savedRoom = roomService.createRoom(room);
        return ResponseEntity.status(HttpStatus.CREATED).body(room);
    }

    @GetMapping("/{roomId}")
    public ResponseEntity<?> joinRoom(@PathVariable String roomId){
        Optional<Room> room = roomService.getRoomById(roomId);
        if(room.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Room not found!");
        }
        return ResponseEntity.ok(room.get());
    }

    @GetMapping("/{roomId}/messages")
    public ResponseEntity<List<Message>> getMesseges(
            @PathVariable String roomId,
            @RequestParam(value = "page", defaultValue = "0", required = false) int page,
            @RequestParam(value = "size", defaultValue = "20", required = false) int size
    ){
        Optional<Room> room = roomService.getRoomById(roomId);

        if(room.isEmpty()){
            return ResponseEntity.notFound().build();
        }

        List<Message> messages = room.get().getMessages();
        return ResponseEntity.ok(messages);
    }
}
