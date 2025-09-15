// src/pages/LoginPage.jsx
import AuthButton from "../components/AuthButton";

function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      <div className="bg-white shadow-lg rounded-xl p-8 text-center max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Welcome to AI API Web App
        </h1>
        <p className="text-gray-600 mb-6">
          Please sign in to continue and start exploring AI tools.
        </p>
        {/* No AuthButton here, it's floating top-right */}
      </div>
    </div>
  );
}

export default LoginPage;
