package com.roomiq.chat.services;

import com.roomiq.chat.entities.Room;
import com.roomiq.chat.repositories.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RoomService {

    private final RoomRepository roomRepository;

    @Autowired
    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    public Optional<Room> getRoomById(String id) {
        return roomRepository.findByRoomId(id.trim());
    }

    public Room createRoom(Room room) {
        return roomRepository.save(room);
    }

    public Room updateRoom(String id, Room updatedRoom) {
        return roomRepository.findByRoomId(id)
                .map(existingRoom -> {
                    existingRoom.setRoomId(updatedRoom.getRoomId());
                    existingRoom.setMessages(updatedRoom.getMessages());
                    return roomRepository.save(existingRoom);
                })
                .orElseGet(() -> {
                    updatedRoom.setRoomId(id);
                    return roomRepository.save(updatedRoom);
                });
    }

    public void deleteRoom(String id) {
        roomRepository.deleteById(id);
    }
}
