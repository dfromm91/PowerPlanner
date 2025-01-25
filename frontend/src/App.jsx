import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Calendar from "./components/Calendar";
import Nav from "./components/Nav";
import Workout from "./components/Workout";
import Stats from "./components/Stats";
import Landing from "./components/Landing";
import axios from "axios";

function Dashboard({
  selectedDate,
  setSelectedDate,
  loggedIn,
  userId,
  isEditing,
  setIsEditing,
}) {
  return (
    <>
      <section className="flex flex-col sm:flex-row gap-4 p-4">
        <div className="flex-shrink-0 w-full sm:w-1/3">
          <Calendar
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            setIsEditing={setIsEditing}
          />
        </div>
        <div className="flex-1">
          <Workout
            selectedDate={selectedDate}
            loggedIn={loggedIn}
            userId={userId}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
          />
        </div>
      </section>
      <div>
        <Stats userId={userId} />
      </div>
    </>
  );
}

function ComingSoon() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center">
      <h2 className="text-2xl font-bold">Coming Soon!</h2>
    </div>
  );
}

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loggedIn, setLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isValidated, setIsValidated] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Check token on app initialization
  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_API}/users/validate-token`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const { id, isValidated } = response.data;
          setUserId(id);
          setIsValidated(isValidated);
          setLoggedIn(true);
        } catch (error) {
          console.error("Token validation failed:", error.response?.data);
          localStorage.removeItem("token");
        }
      }
    };

    checkToken();
  }, []);

  return (
    <Router>
      {loggedIn ? (
        <>
          <Nav setLoggedIn={setLoggedIn} />
          <Routes>
            <Route
              path="/dashboard"
              element={
                <Dashboard
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  loggedIn={loggedIn}
                  userId={userId}
                  isEditing={isEditing}
                  setIsEditing={setIsEditing}
                />
              }
            />
            <Route path="/rewards" element={<ComingSoon />} />
            <Route path="/friends" element={<ComingSoon />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </>
      ) : (
        <Routes>
          <Route
            path="*"
            element={
              <Landing
                loggedIn={loggedIn}
                setLoggedIn={setLoggedIn}
                setUserId={setUserId}
                setIsValidated={setIsValidated}
              />
            }
          />
        </Routes>
      )}
    </Router>
  );
}

export default App;
