// src/components/AuthButton.jsx
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

function AuthButton() {
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login error:", error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  return (
    <div className="mt-4">
      {auth.currentUser ? (
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow transition"
        >
          Logout ({auth.currentUser.email})
        </button>
      ) : (
        <button
          onClick={handleLogin}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow transition"
        >
          Login with Google
        </button>
      )}
    </div>
  );
}

export default AuthButton;
