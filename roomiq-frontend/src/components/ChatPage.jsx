import React, { useState, useRef, useEffect } from "react";
import "./css/chatpage.css";
import useChatContext from "../context/ChatContext";
import SockJS from "sockjs-client";
import { baseURL } from "../services/AxiosHelper";
import { Stomp } from "@stomp/stompjs";
import toast from "react-hot-toast";
import { getMessages } from "../services/RoomService";
import { useNavigate } from "react-router";

const ChatPage = () => {
  const navigate = useNavigate();

  const { roomId, currentUser, isConnected, setConnected } = useChatContext();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    const sock = new SockJS(`${baseURL}/ws-chat`);
    const client = Stomp.over(() => sock);

    let subscription = null;

    client.connect(
      {},
      () => {
        setStompClient(client);
        setConnected(true);

        subscription = client.subscribe(`/topic/room/${roomId}`, (message) => {
          const receivedMessage = JSON.parse(message.body);
          setMessages((prev) => [
            ...prev,
            {
              id: receivedMessage.id,
              user: receivedMessage.sender,
              content: receivedMessage.content,
              isCurrentUser: receivedMessage.sender === currentUser,
            },
          ]);
        });
      },
      (err) => {
        console.error("WebSocket connection error:", err);
        toast.error("Failed to connect to chat server.");
      }
    );

    return () => {
      if (subscription) subscription.unsubscribe();
      if (client && client.connected) {
        client.disconnect(() => {
          console.log("WebSocket disconnected during cleanup");
        });
      }
    };
  }, [roomId]); 

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const serverMessages = await getMessages(roomId);
        const formattedMessages = serverMessages.map((msg) => ({
          id: msg.id,
          user: msg.sender,
          content: msg.content,
          isCurrentUser: msg.sender === currentUser,
        }));
        setMessages(formattedMessages);
      } catch (err) {
        console.error("Failed to load messages:", err);
        toast.error("Could not load previous messages.");
      }
    };

    if (roomId) loadMessages();
  }, [roomId, currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      const isTypingArea = document.activeElement === inputRef.current;
      const isLetter = /^[a-zA-Z]$/.test(e.key);
      const hasModifier = e.ctrlKey || e.metaKey || e.altKey;

      if (isLetter && !isTypingArea && !hasModifier) {
        e.preventDefault();
        inputRef.current.focus();
        setInput((prev) => prev + e.key);
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  const handleSend = () => {
    if (stompClient && isConnected && input.trim()) {
      const sendMessage = {
        roomId: roomId,
        sender: currentUser,
        content: input.trim(),
      };
      stompClient.send(`/app/send/${roomId}`, {}, JSON.stringify(sendMessage));
      setInput("");
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  const handleLeave = () => {
    if (stompClient) {
      stompClient.disconnect(() => {
        console.log("Disconnected from chat");
        setConnected(false);
        setStompClient(null);
        navigate("/");
      });
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <nav className="bg-gray-900 px-6 py-4 flex items-center shadow-lg z-10 border-b border-gray-700 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
            {currentUser[0].toUpperCase()}
          </div>
          <div className="text-white text-sm font-semibold">
            <span className="opacity-60">You:</span> {currentUser}
          </div>
        </div>
        <div className="flex-grow text-center text-white text-lg font-bold tracking-widest font-mono select-all">
          {roomId}
        </div>
        <div className="flex-shrink-0">
          <button
            onClick={handleLeave}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            Leave
          </button>
        </div>
      </nav>

      <main className="flex-1 flex flex-col w-full bg-gray-800 shadow-xl border-t border-gray-700 min-h-0">
        <div
          className="flex-1 overflow-y-scroll px-2 md:px-16 py-6 space-y-6 chat-scrollbar"
          style={{ maxHeight: "100%", minHeight: 0 }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.isCurrentUser ? "items-end" : "items-start"
              }`}
            >
              <span
                className={`mb-1 text-xs font-bold ${
                  msg.isCurrentUser ? "text-blue-400" : "text-gray-400"
                }`}
              >
                {msg.isCurrentUser ? "You" : msg.user}
              </span>
              <div
                className={`max-w-xs md:max-w-md p-3 shadow-md text-sm ${
                  msg.isCurrentUser
                    ? "bg-blue-600 text-white rounded-lg rounded-tr-none"
                    : "bg-gray-700 text-gray-100 rounded-lg rounded-tl-none"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="px-2 md:px-16 py-4 bg-gray-900 flex items-center gap-3 border-t border-gray-700 flex-shrink-0">
          <input
            ref={inputRef}
            type="text"
            className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleInputKeyDown}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className={`px-5 py-2 rounded-lg font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              input.trim()
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-900 text-gray-400 cursor-not-allowed"
            }`}
          >
            Send
          </button>
        </div>
      </main>
    </div>
  );
};

export default ChatPage;
