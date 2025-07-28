// pages/Home.jsx
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import PitchForm from "../components/PitchForm";
import PitchCard from "../components/PitchCard";

 function Home() {
  const [user, setUser] = useState(null);
  const [pitches, setPitches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPitches = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "pitches"));
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      list.sort((a, b) => b.votes - a.votes);
      setPitches(list);
    } catch (error) {
      console.error("Error fetching pitches:", error.message);
      alert("Failed to fetch pitches.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        fetchPitches();
      } else {
        navigate("/");
      }
    });
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-purple-100 min-h-screen animate-fadeIn">
      <header className="flex justify-between items-center mb-10 border-b pb-6 animate-slideDown">
        <div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-600 tracking-tight drop-shadow">
            Idea Voting Portal
          </h1>
          <p className="text-gray-700 mt-2 text-lg">
            Welcome, <span className="font-semibold">{user?.displayName || user?.email}</span>
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2 rounded-xl shadow-lg hover:scale-105 hover:from-red-600 hover:to-pink-600 transition-all duration-200 font-semibold"
        >
          Logout
        </button>
      </header>

      <section className="mb-12 animate-fadeInUp delay-100">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
          <span className="inline-block animate-bounce text-blue-500">💡</span>
          Submit Your Pitch
        </h2>
        <div className="bg-white p-8 rounded-2xl shadow-xl transition-shadow hover:shadow-2xl">
          <PitchForm onSubmit={fetchPitches} />
        </div>
      </section>

      <section className="animate-fadeInUp delay-200">
        <h2 className="text-2xl font-bold mb-5 text-gray-800 flex items-center gap-2">
          <span className="inline-block animate-pulse text-purple-500">🚀</span>
          All Pitches
        </h2>
        <div className="space-y-6">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <svg className="animate-spin h-8 w-8 text-blue-500 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              <span className="text-gray-500 text-lg">Loading pitches...</span>
            </div>
          ) : pitches.length === 0 ? (
            <div className="text-center text-gray-400 italic animate-fadeIn">
              No pitches submitted yet.
            </div>
          ) : (
            pitches.map((pitch, idx) => (
              <div className="animate-fadeInUp" style={{ animationDelay: `${idx * 60}ms` }} key={pitch.id}>
                <PitchCard pitch={pitch} refresh={fetchPitches} />
              </div>
            ))
          )}
        </div>
      </section>

      {/* Animations */}
      <style>
        {`
          .animate-fadeIn { animation: fadeIn 0.7s ease; }
          .animate-slideDown { animation: slideDown 0.7s cubic-bezier(.4,0,.2,1); }
          .animate-fadeInUp { animation: fadeInUp 0.7s cubic-bezier(.4,0,.2,1) both; }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes slideDown { from { opacity: 0; transform: translateY(-30px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        `}
      </style>
    </div>
  );
}

export default Home;