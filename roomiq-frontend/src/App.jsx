import { Routes } from "react-router";
import "./App.css";
import ChatPage from "./components/ChatPage";
import RoomiqForm from "./components/RoomiqForm";
import { useAppContext } from "./context/AppContext";

function App() {
  return (
    <RoomiqForm/>
  );
}

export default App;
