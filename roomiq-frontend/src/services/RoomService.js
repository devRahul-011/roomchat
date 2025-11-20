import { httpClient } from "./AxiosHelper";

// Function to create a room
export const callCreateRoom = async (roomId) => {
  const response = await httpClient.post("/api/v1/rooms", roomId, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
  return response.data;
};

// Function to join a room
export const callJoinRoom = async (roomId) => {
  const response = await httpClient.get(`/api/v1/rooms/${roomId}`, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
  return response.data;
};

// Function to load message
export const getMessages = async (roomId) => {
  const response = await httpClient.get(`/api/v1/rooms/${roomId}/messages`);
  return response.data;
};