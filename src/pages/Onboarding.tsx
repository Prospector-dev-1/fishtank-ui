import React, { useEffect } from "react";
import { useAuthStore } from "@/state/auth";

function FishIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 32" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M19 16c7-8 20-10 28-6 3 2 5 4 6 6-1 2-3 4-6 6-8 4-21 2-28-6z" fill="#0b1220" />
      <circle cx="50" cy="14" r="2" fill="#0b1220" />
      <path d="M6 8l8 8-8 8c-2-5-2-11 0-16z" fill="#0b1220" />
    </svg>
  );
}

export default function Onboarding() {
  const setRole = useAuthStore((s) => s.setRole);

  useEffect(() => {
    document.title = "Fishtank · Choose your role";
  }, []);

  const select = (r: "creator" | "innovator" | "investor") => {
    setRole(r);
    // Navigate to the independent role app
    const ports = { creator: 5174, innovator: 5175, investor: 5176 };
    window.location.href = `http://localhost:${ports[r]}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-center px-3 py-8 sm:px-4 sm:py-12">
      {/* Header */}
      <div className="w-full max-w-6xl">
        <div className="flex items-center justify-center gap-3 mb-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            Welcome to <span className="text-blue-700 dark:text-blue-400">Fishtank</span>
          </h1>
          <FishIcon className="h-6 w-6 sm:h-7 sm:w-7 text-slate-800 dark:text-white" />
        </div>
        <p className="text-center text-slate-600 dark:text-slate-300 text-base sm:text-lg mb-8">
          Please select your role on Fishtank
        </p>
      </div>

      {/* Side-by-side tall vertical cards. Innovator is subtly emphasized. */}
      <div className="w-full max-w-6xl">
        <div className="mx-auto flex flex-row flex-wrap items-end justify-center gap-4 sm:gap-6 md:gap-8">
          {/* creator */}
          <button
            onClick={() => select("creator") }
            aria-label="Choose Creator"
            aria-describedby="creator-desc"
            className="flex-none w-[120px] sm:w-[150px] md:w-[180px] h-[360px] sm:h-[420px] md:h-[480px] border border-slate-300 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-transform hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 px-3 sm:px-4 py-4 flex flex-col items-center justify-center"
          >
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-slate-900 dark:text-white mb-2">Creator</h2>
            <p id="creator-desc" className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 text-center max-w-[140px]">
              Skilled freelancers and interns helping bring an innovator's idea to life.
            </p>
          </button>

          {/* innovator (slightly wider & taller center card for hierarchy) */}
          <button
            onClick={() => select("innovator") }
            aria-label="Choose Innovator"
            aria-describedby="innovator-desc"
            className="flex-none w-[130px] sm:w-[170px] md:w-[200px] h-[400px] sm:h-[480px] md:h-[540px] border border-blue-600 rounded-2xl bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-transform hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 px-3 sm:px-5 py-5 flex flex-col items-center justify-center"
          >
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-slate-900 dark:text-white mb-2">Innovator</h2>
            <p id="innovator-desc" className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 text-center max-w-[160px]">
              Innovate, pitch, and collaborate to build smarter together.
            </p>
          </button>

          {/* investor */}
          <button
            onClick={() => select("investor") }
            aria-label="Choose Investor"
            aria-describedby="investor-desc"
            className="flex-none w-[120px] sm:w-[150px] md:w-[180px] h-[360px] sm:h-[420px] md:h-[480px] border border-slate-300 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-transform hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 px-3 sm:px-4 py-4 flex flex-col items-center justify-center"
          >
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-slate-900 dark:text-white mb-2">Investor</h2>
            <p id="investor-desc" className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 text-center max-w-[140px]">
              Discover and back the next generation of startups.
            </p>
          </button>
        </div>
      </div>

      {/* About section */}
      <div className="w-full max-w-3xl mt-12 text-center px-3 sm:px-0">
        <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-3">What Is Fishtank</h3>
        <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed">
          Fishtank is a platform where innovators pitch ideas with short videos, creators—vetted freelancers and interns—help produce assets, research, and outreach, and investors quickly screen, request NDAs, and move deals forward. It streamlines discovery, collaboration, and deal flow with a simple pipeline, rapid feedback, and clear next steps from first pitch to full diligence.
        </p>
      </div>

      <footer className="mt-10 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">© {new Date().getFullYear()} Fishtank App INC. All rights reserved.</footer>
    </div>
  );
}

