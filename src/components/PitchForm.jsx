// components/PitchForm.jsx
import { useState } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

export default function PitchForm({ onSubmit }) {
  const [title, setTitle] = useState("");
  const [founder, setFounder] = useState("");
  const [summary, setSummary] = useState("");
  const [videoURL, setVideoURL] = useState("");

  // Converts normal YouTube links to embeddable format
  const formatYouTubeURL = (url) => {
    const match = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^\s&?]+)/i
    );
    return match ? `https://www.youtube.com/embed/${match[1]}` : "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const embedURL = formatYouTubeURL(videoURL);

      await addDoc(collection(db, "pitches"), {
        title,
        founder,
        summary,
        videoURL: embedURL,
        createdBy: auth.currentUser.uid,
        votes: 0,
        votedBy: [],
      });

      // Show a professional toast notification
      const toast = document.createElement("div");
      toast.innerHTML = `<svg width="22" height="22" fill="none" viewBox="0 0 24 24" style="margin-right:0.7rem;"><circle cx="12" cy="12" r="10" fill="#22c55e"/><path d="M8 12.5l2.5 2.5 5-5" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span><b>Pitch submitted!</b> Your idea has been received. Thank you for participating.</span>`;
      toast.style.position = "fixed";
      toast.style.top = "32px";
      toast.style.left = "50%";
      toast.style.transform = "translateX(-50%)";
      toast.style.background = "#fff";
      toast.style.color = "#222";
      toast.style.padding = "1rem 2.2rem 1rem 1.5rem";
      toast.style.borderRadius = "1.25rem";
      toast.style.fontWeight = "500";
      toast.style.fontSize = "1.08rem";
      toast.style.boxShadow = "0 4px 24px 0 rgba(34,197,94,0.13)";
      toast.style.zIndex = "9999";
      toast.style.display = "flex";
      toast.style.alignItems = "center";
      toast.style.gap = "0.7rem";
      toast.style.border = "1.5px solid #22c55e";
      toast.style.opacity = "0";
      toast.style.transition = "opacity 0.4s";
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.style.opacity = "1";
      }, 50);
      setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => document.body.removeChild(toast), 400);
      }, 2200);

      onSubmit?.(); // refresh list
      setTitle("");
      setFounder("");
      setSummary("");
      setVideoURL("");
    } catch (err) {
      function showErrorToast(message = "Something went wrong!") {
        const toast = document.createElement("div");

        toast.setAttribute("role", "alert");
        toast.setAttribute("aria-live", "assertive");

        toast.innerHTML = `
    <div class="flex items-start gap-3">
      <svg class="w-5 h-5 mt-0.5 flex-shrink-0 text-red-500" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="#fee2e2" />
        <path d="M12 8v4m0 4h.01" stroke="#dc2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <div>
        <p class="text-sm font-semibold text-red-600">Error</p>
        <p class="text-sm text-slate-700">${message}</p>
      </div>
    </div>
  `;

        toast.className = `
    fixed top-6 left-1/2 transform -translate-x-1/2
    bg-white border border-red-200 shadow-lg
    rounded-xl px-4 py-3 z-[9999] w-[95%] max-w-sm
    animate-toast-slide
  `;

        // Add to body
        document.body.appendChild(toast);

        // Animate in
        toast.style.opacity = "0";
        toast.style.transition = "opacity 0.4s ease, transform 0.4s ease";
        setTimeout(() => {
          toast.style.opacity = "1";
          toast.style.transform = "translateX(-50%) translateY(0)";
        }, 10);

        // Remove after delay
        setTimeout(() => {
          toast.style.opacity = "0";
          toast.style.transform = "translateX(-50%) translateY(-20px)";
          setTimeout(() => toast.remove(), 400);
        }, 3000);
      }
      showErrorToast(
        err.message || "Failed to submit pitch. Please try again."
      );
      console.error("Error submitting pitch:", err);
    }
  };

  return (
    <form
      className="max-w-2xl mx-auto bg-white shadow-2xl rounded-3xl p-6 sm:p-8 md:p-12 space-y-8 sm:space-y-10 border border-gray-100 animate-fade-in"
      onSubmit={handleSubmit}
      style={{ animation: "fadeInUp 0.8s cubic-bezier(.4,0,.2,1)" }}
    >
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-6 sm:mb-8 text-center tracking-tight animate-slide-down">
        <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent animate-gradient-move">
          Submit Your Pitch
        </span>
      </h2>
      <div className="space-y-1 animate-fade-in delay-100 animate-float">
        <label
          className="block text-gray-700 font-semibold mb-1 animate-label-pop text-base sm:text-lg"
          htmlFor="title"
        >
          Pitch Title
        </label>
        <input
          id="title"
          placeholder="Enter a catchy title"
          className="w-full p-3 sm:p-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-200 bg-gray-50 transition-all duration-200 shadow-sm animate-input-glow text-sm sm:text-base"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="space-y-1 animate-fade-in delay-200 animate-float">
        <label
          className="block text-gray-700 font-semibold mb-1 animate-label-pop text-base sm:text-lg"
          htmlFor="founder"
        >
          Founder Name
        </label>
        <input
          id="founder"
          placeholder="Your name"
          className="w-full p-3 sm:p-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-200 bg-gray-50 transition-all duration-200 shadow-sm animate-input-glow text-sm sm:text-base"
          value={founder}
          onChange={(e) => setFounder(e.target.value)}
          required
        />
      </div>
      <div className="space-y-1 animate-fade-in delay-300 animate-float">
        <label
          className="block text-gray-700 font-semibold mb-1 animate-label-pop text-base sm:text-lg"
          htmlFor="summary"
        >
          Summary
        </label>
        <textarea
          id="summary"
          placeholder="Briefly describe your idea"
          className="w-full p-3 sm:p-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-200 bg-gray-50 transition-all duration-200 resize-none min-h-[90px] sm:min-h-[120px] shadow-sm animate-input-glow text-sm sm:text-base"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          required
        ></textarea>
      </div>
      <div className="space-y-1 animate-fade-in delay-400 animate-float">
        <label
          className="block text-gray-700 font-semibold mb-1 animate-label-pop text-base sm:text-lg"
          htmlFor="videoURL"
        >
          YouTube Video Link
        </label>
        <input
          id="videoURL"
          placeholder="e.g., https://youtu.be/abc123"
          className="w-full p-3 sm:p-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-200 bg-gray-50 transition-all duration-200 shadow-sm animate-input-glow text-sm sm:text-base"
          value={videoURL}
          onChange={(e) => setVideoURL(e.target.value)}
        />
        <p className="text-xs sm:text-sm text-gray-500 mt-2 animate-fade-in delay-500">
          <span className="font-medium">Optional:</span> Add a video to make
          your pitch stand out.
        </p>
      </div>
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-bold py-3 sm:py-4 rounded-2xl shadow-xl transition-all duration-200 transform hover:-translate-y-1 active:scale-95 text-base sm:text-lg tracking-wide flex items-center justify-center gap-2 animate-bounce-once animate-glow"
      >
        <span className="text-xl sm:text-2xl animate-pulse">🚀</span>
        <span className="animate-text-pop">Submit Pitch</span>
      </button>
      <style>
        {`
          @media (max-width: 640px) {
            form {
              border-radius: 1.25rem !important;
              padding: 1.25rem !important;
              box-shadow: 0 2px 12px 0 rgba(16,185,129,0.08) !important;
            }
          }
          @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(40px);}
            100% { opacity: 1; transform: translateY(0);}
          }
          .animate-fade-in {
            animation: fadeInUp 0.7s both;
          }
          .delay-100 { animation-delay: 0.1s !important; }
          .delay-200 { animation-delay: 0.2s !important; }
          .delay-300 { animation-delay: 0.3s !important; }
          .delay-400 { animation-delay: 0.4s !important; }
          .delay-500 { animation-delay: 0.5s !important; }
          @keyframes slideDown {
            0% { opacity: 0; transform: translateY(-30px);}
            100% { opacity: 1; transform: translateY(0);}
          }
          .animate-slide-down {
            animation: slideDown 0.7s both;
          }
          @keyframes bounceOnce {
            0% { transform: scale(1);}
            30% { transform: scale(1.08);}
            60% { transform: scale(0.97);}
            100% { transform: scale(1);}
          }
          .animate-bounce-once {
            animation: bounceOnce 0.7s 1;
          }
          @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            100% { background-position: 100% 50%; }
          }
          .animate-gradient-move {
            background-size: 200% 200%;
            animation: gradientMove 2s linear infinite alternate;
          }
          @keyframes inputGlow {
            0% { box-shadow: 0 0 0 0 rgba(16,185,129,0.2);}
            50% { box-shadow: 0 0 12px 2px rgba(16,185,129,0.25);}
            100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.2);}
          }
          .animate-input-glow:focus {
            animation: inputGlow 1.2s ease-in-out;
          }
          @keyframes labelPop {
            0% { opacity: 0; transform: scale(0.9);}
            100% { opacity: 1; transform: scale(1);}
          }
          .animate-label-pop {
            animation: labelPop 0.5s both;
          }
          @keyframes textPop {
            0% { opacity: 0; transform: scale(0.8);}
            100% { opacity: 1; transform: scale(1);}
          }
          .animate-text-pop {
            animation: textPop 0.5s both;
          }
          @keyframes float {
            0% { transform: translateY(0);}
            50% { transform: translateY(-4px);}
            100% { transform: translateY(0);}
          }
          .animate-float {
            animation: float 2.5s ease-in-out infinite;
          }
          @keyframes glow {
            0% { box-shadow: 0 0 0 0 rgba(16,185,129,0.3);}
            50% { box-shadow: 0 0 16px 4px rgba(16,185,129,0.4);}
            100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.3);}
          }
          .animate-glow {
            animation: glow 2s infinite;
          }
        `}
      </style>
    </form>
  );
}
