// src/App.jsx
import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import Purchases from "./pages/Purchases";
import { auth } from "./firebase";
import AuthButton from "./components/AuthButton";
import AllPurchases from "./pages/AllPurchases";
import Success from "./pages/Success";

function App() {
  const [credits, setCredits] = useState(0);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  return (
    <Router>
      <AuthWatcher setUser={setUser} setLoading={setLoading} />
      
      {/* Floating AuthButton only if NOT logged in */}
      {!user && (
        <div className="fixed top-4 right-4 z-50">
          <AuthButton />
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/app"
            element={
              user ? (
                <MainPage credits={credits} setCredits={setCredits} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="/success" element={<Success setCredits={setCredits} />} />
          <Route path="/allpurchases" element={<AllPurchases />} />
          <Route path="/purchases/all" element={<AllPurchases />} />
          <Route path="/purchases" element={<Purchases />} />
          <Route
            path="*"
            element={<Navigate to={user ? "/app" : "/login"} />}
          />
        </Routes>
      )}
    </Router>

  );
}

// 🔑 Watches Firebase auth state and handles redirects
function AuthWatcher({ setUser, setLoading }) {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      // ✅ Safely read pathname
      const currentPath = typeof window !== "undefined" ? window.location?.pathname || "/" : "/";

      if (firebaseUser) {
        // ✅ Only redirect if on /login or /
        if (currentPath === "/login" || currentPath === "/") {
          navigate("/app", { replace: true });
        }
      } else {
        // ✅ Only redirect if not already on /login
        if (currentPath !== "/login") {
          navigate("/login", { replace: true });
        }
      }
    });

    return () => unsubscribe();
  }, [navigate, setUser, setLoading]);

  return null;
}






export default App;
