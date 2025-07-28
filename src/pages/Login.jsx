import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

export default function Login() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleAuth = async () => {
    setLoading(true);
    setMessage("");

    try {
      if (isNewUser) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (name) {
          await updateProfile(userCredential.user, { displayName: name });
        }
        setMessage("✅ Account created successfully! Redirecting...");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        setMessage("✅ Login successful!");
      }

      setTimeout(() => navigate("/home"), 1200);
    } catch (error) {
      setMessage("❌ " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 transition-all duration-700">
      <div className="bg-white/95 backdrop-blur-lg p-10 rounded-3xl w-full max-w-md shadow-2xl space-y-8 animate-fade-in border border-gray-200">
        
        <div className="flex flex-col items-center space-y-2">
          <svg width="48" height="48" fill="none" viewBox="0 0 48 48" className="mb-2">
            <circle cx="24" cy="24" r="24" fill="#6366F1" />
            <path d="M16 24l6 6 10-10" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h2 className="text-3xl font-bold text-gray-800 tracking-tight animate-slide-down">
            {isNewUser ? "Create Your Account" : "Sign In"}
          </h2>
          <p className="text-center text-gray-500 text-base animate-fade-in-slow">
            {isNewUser
              ? "Join the Idea Voting Portal and start sharing your ideas."
              : "Access your account to continue."}
          </p>
        </div>

        <form
          className="space-y-5"
          onSubmit={e => {
            e.preventDefault();
            handleAuth();
          }}
        >
          {isNewUser && (
            <div>
              <label className="block text-gray-700 font-medium mb-1" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Your Name"
                className="w-full border border-gray-300 focus:border-blue-500 p-3 rounded-lg outline-none transition-all duration-200 shadow-sm focus:shadow-md bg-white/90"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="yourname@gmail.com"
              className="w-full border border-gray-300 focus:border-blue-500 p-3 rounded-lg outline-none transition-all duration-200 shadow-sm focus:shadow-md bg-white/90"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="w-full border border-gray-300 focus:border-blue-500 p-3 rounded-lg outline-none transition-all duration-200 shadow-sm focus:shadow-md bg-white/90"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete={isNewUser ? "new-password" : "current-password"}
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full py-3 rounded-lg font-semibold text-white shadow-md transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              loading
                ? "bg-gradient-to-r from-blue-400 to-blue-600 cursor-not-allowed opacity-70"
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            }`}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Please wait...
              </span>
            ) : isNewUser ? "Sign Up" : "Login"}
          </button>
        </form>

        {message && (
          <div
            className={`text-center text-sm mt-2 px-3 py-2 rounded-lg animate-fade-in-fast ${
              message.startsWith("✅")
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {message}
          </div>
        )}

        <div className="text-center text-sm text-gray-600 mt-2 animate-fade-in-slow">
          {isNewUser ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            className="text-blue-600 font-semibold underline hover:text-purple-600 transition-colors duration-200"
            onClick={() => {
              setIsNewUser(!isNewUser);
              setMessage("");
            }}
            type="button"
          >
            {isNewUser ? "Login" : "Sign Up"}
          </button>
        </div>
      </div>

      <style>
        {`
          .animate-fade-in {
            animation: fadeIn 0.8s ease both;
          }
          .animate-fade-in-fast {
            animation: fadeIn 0.4s ease both;
          }
          .animate-fade-in-slow {
            animation: fadeIn 1.2s ease both;
          }
          .animate-slide-down {
            animation: slideDown 0.7s ease both;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(16px);}
            to { opacity: 1; transform: translateY(0);}
          }
          @keyframes slideDown {
            from { opacity: 0; transform: translateY(-24px);}
            to { opacity: 1; transform: translateY(0);}
          }
        `}
      </style>
    </div>
  );
}
