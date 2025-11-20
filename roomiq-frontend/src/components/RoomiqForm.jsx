import React, { useState } from "react";
import { callCreateRoom, callJoinRoom } from "../services/RoomService";
import toast from "react-hot-toast";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router";
import { useAppContext } from "../context/AppContext";

const RoomiqForm = () => {
  const { setHasVisitedLogin } = useAppContext();

  const {
    roomId,
    currentUser,
    isConnected,
    setRoomId,
    setCurrentUser,
    setConnected,
  } = useChatContext();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", roomId: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const isValidate = () => {
    let newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.roomId.trim()) newErrors.roomId = "Room ID is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleJoin = async () => {
    if (isValidate()) {
      try {
        const response = await callJoinRoom(form.roomId);
        toast.success("Room Joined Successfully!");
        setRoomId(form.roomId);
        setCurrentUser(form.name);
        setConnected(true);
        setHasVisitedLogin(true);
        navigate("/chat");
        setForm({ name: "", roomId: "" });
      } catch (error) {
        if (error.response?.status === 404) {
          toast.error("Room doesn't exists!");
        } else {
          toast.error("Something went wrong!");
          setForm({ name: "", roomId: "" });
        }
      }
    }
  };

  const handleCreate = async () => {
    if (isValidate()) {
      try {
        const response = await callCreateRoom(form.roomId);
        toast.success("Room Created Successfully!", { position: "top-center" });
        setRoomId(form.roomId);
        setCurrentUser(form.name);
        setConnected(true);
        setHasVisitedLogin(true);
        navigate("/chat");
        setForm({ name: "", roomId: "" });
      } catch (error) {
        if (error.response?.status === 400) {
          toast.error("Room already exists!");
        } else {
          toast.error("Something went wrong!");
          setForm({ name: "", roomId: "" });
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div
        className="bg-gray-800 shadow-xl rounded-2xl px-8 py-10 w-full max-w-md flex flex-col gap-6"
        aria-label="Join or Create Room Form"
      >
        <h1 className="text-3xl font-extrabold text-white text-center font-sans tracking-wide mb-2">
          Roomiq
        </h1>
        <p className="text-gray-400 text-center mb-4 text-base font-light">
          Enter your name and room ID to join or create a room
        </p>
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-gray-200 text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="off"
            value={form.name}
            onChange={handleChange}
            className={`px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
              errors.name
                ? "border border-red-500"
                : "border border-transparent"
            }`}
            placeholder="Your Name"
            aria-invalid={!!errors.name}
            aria-describedby="name-error"
          />
          {errors.name && (
            <span id="name-error" className="text-red-400 text-xs font-medium">
              {errors.name}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="roomId" className="text-gray-200 text-sm font-medium">
            Room ID / New Room ID
          </label>
          <input
            id="roomId"
            name="roomId"
            type="text"
            autoComplete="off"
            value={form.roomId}
            onChange={handleChange}
            className={`px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
              errors.roomId
                ? "border border-red-500"
                : "border border-transparent"
            }`}
            placeholder="Enter Room ID"
            aria-invalid={!!errors.roomId}
            aria-describedby="roomId-error"
          />
          {errors.roomId && (
            <span
              id="roomId-error"
              className="text-red-400 text-xs font-medium"
            >
              {errors.roomId}
            </span>
          )}
        </div>
        <div className="flex flex-row gap-4 mt-4">
          <button
            type="button"
            onClick={handleJoin}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Join Room
          </button>
          <button
            type="button"
            onClick={handleCreate}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            Create Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomiqForm;
