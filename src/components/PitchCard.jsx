// components/PitchCard.jsx
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function PitchCard({ pitch, refresh }) {
  const userId = auth.currentUser.uid;

  const handleVote = async () => {
    const pitchRef = doc(db, "pitches", pitch.id);
    const pitchSnap = await getDoc(pitchRef);

    if (!pitchSnap.exists()) return;

    const data = pitchSnap.data();

    if (data.votedBy.includes(userId)) {
      alert("You already voted for this pitch!");
      return;
    }

    await updateDoc(pitchRef, {
      votes: data.votes + 1,
      votedBy: [...data.votedBy, userId],
    });

    refresh(); // re-fetch after vote
  };

  return (
    <div className="relative p-7 border border-transparent rounded-2xl mb-8 bg-white shadow-xl hover:shadow-2xl transition-all duration-300 group">
      <div className="flex items-center mb-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-2xl mr-5 shadow-lg animate-fade-in">
          {pitch.founder?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900 animate-slide-in">{pitch.title}</h3>
          <p className="text-sm text-gray-400">By {pitch.founder}</p>
        </div>
      </div>
      <p className="mb-4 text-gray-700 leading-relaxed animate-fade-in">{pitch.summary}</p>
      {pitch.videoURL && (
        <div className="overflow-hidden rounded-xl mb-4 border border-blue-100 animate-fade-in">
          <iframe
            className="w-full h-56"
            src={pitch.videoURL}
            title="pitch video"
            allowFullScreen
          ></iframe>
        </div>
      )}
      <div className="flex justify-between items-center mt-3">
        <div className="flex items-center gap-2">
          <span className="text-blue-700 font-extrabold text-xl animate-pop">{pitch.votes}</span>
          <span className="text-gray-400 text-base">Votes</span>
        </div>
        <button
          onClick={handleVote}
          className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-xl shadow-lg font-semibold transition-all duration-300 hover:from-blue-700 hover:to-indigo-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300 group-hover:ring-4 group-hover:ring-blue-200"
        >
          <span className="relative z-10">Vote</span>
          <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
        </button>
      </div>
      {/* Animations using Tailwind CSS custom classes */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.7s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animate-slide-in {
          animation: slideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animate-pop {
          animation: pop 0.4s;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: translateY(-12px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes pop {
          0% { transform: scale(0.85); }
          80% { transform: scale(1.08); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
