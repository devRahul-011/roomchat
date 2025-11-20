package com.roomiq.chat.repositories;

import com.roomiq.chat.entities.Room;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface RoomRepository extends MongoRepository<Room, String> {
     Optional<Room> findByRoomId(String roomId);
}
