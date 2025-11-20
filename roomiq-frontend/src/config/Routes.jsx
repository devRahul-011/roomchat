import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ChatPage from "../components/ChatPage.jsx";
import RoomiqForm from "../components/RoomiqForm.jsx";
import { useAppContext } from "../context/AppContext"; // Adjust path as needed

function RequireVisit({ children }) {
  const { hasVisitedLogin } = useAppContext();

  // If hasVisitedLogin is false or undefined, redirect to the home page
  if (!hasVisitedLogin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

const AppRoutes = () => {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route path="/" element={<RoomiqForm />} />
        <Route
          path="/chat"
          element={
            <RequireVisit>
              <ChatPage />
            </RequireVisit>
          }
        />
        <Route path="*" element={<h1>404 Page not found</h1>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
