"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/services/firebase";
import logoImg from "@/public/logo.png";
import ScoreCard from "@/components/score_card";
import ResultsSection from "@/components/result_section";
import { Luxurious_Roman, Zain } from "next/font/google";
import { FiSun, FiMoon } from "react-icons/fi";

interface ResultItem {
  category: string;
  competition: string;
  gender?: string;
  firstPlace: { name: string; team: string };
  secondPlace: { name: string; team: string };
}

const luxurios_roman = Luxurious_Roman({ subsets: ["latin"], weight: ["400"] });
const zain = Zain({ subsets: ["latin"], weight: ["400"] });

export default function Home() {
  const [results, setResults] = useState<ResultItem[]>([]);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingPercent, setLoadingPercent] = useState(0);

  const resultsRef = collection(db, "results");
  const resultsQuery = query(resultsRef, orderBy("addedAt", "desc"));

  useEffect(() => {
    const unsubscribe = onSnapshot(resultsQuery, (snapshot) => {
      const data: ResultItem[] = snapshot.docs.map(
        (doc) => doc.data() as ResultItem
      );

      setResults(data);

      const scoreMap: Record<string, number> = {};
      data.forEach((r) => {
        scoreMap[r.firstPlace.team] = (scoreMap[r.firstPlace.team] || 0) + 10;
        scoreMap[r.secondPlace.team] = (scoreMap[r.secondPlace.team] || 0) + 5;
      });
      setScores(scoreMap);

      setTimeout(() => {
        setLoadingPercent(100);
        setTimeout(() => setLoading(false), 500);
      }, 500);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setLoadingPercent((prev) => {
        if (prev < 95) {
          return prev + Math.floor(Math.random() * 5) + 1;
        }
        return prev;
      });
    }, 300);

    return () => clearInterval(interval);
  }, [loading]);

  return (
    <main className={`home ${darkMode ? "dark" : "light"}`}>
      {loading ? (
        <div className="loading-screen">
          <div className="loading-content">
            <img
              src={logoImg.src}
              alt="Loading Logo"
              className="loading-logo"
            />
            <p className="loading-text">{loadingPercent}%</p>
          </div>
        </div>
      ) : (
        <>
          <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>

          <div className="header-section">
            <h1 className={`${luxurios_roman.className} main-title`}>
              Hubbu Rasool - Meelad Fest 2025
            </h1>
            <p className={`${zain.className} sub-title`}>
              Irshadul Athfal Higher Secondary Madrasa Kaje
            </p>
          </div>

          <div className="scorecard-wrapper">
            <ScoreCard
              yaqoothScore={scores["Yaqooth"] || 0}
              marjaanScore={scores["Marjaan"] || 0}
            />
          </div>

          <div className="results-wrapper">
            <ResultsSection results={results} />
          </div>
        </>
      )}

      <style jsx>{`
       :global(body) {
  margin: 0 auto;
      }

            .loading-screen {
          position: fixed;
          inset: 0;
          background: #111; /* Dark background */
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          transition: opacity 0.5s ease;
        }

        .loading-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .loading-logo {
          width: 300px;
          height: auto;
          margin-bottom: 1rem;
        }

        .loading-text {
          color: #fff;
          font-size: 1.25rem;
          font-weight: bold;
          letter-spacing: 1px;
        }

        .home {
          padding: 1.5rem;
          transition: background 0.3s, color 0.3s;
        }

        .home.light {
          --bg-color: #fefefe;
          --text-color: #111;
          --card-bg: #fff;
        }

        .home.dark {
          --bg-color: #111;
          --text-color: #fefefe;
          --card-bg: #1e1e1e;
        }

        .home {
          background-color: var(--bg-color);
          color: var(--text-color);
        }

        .header-section {
          text-align: left;
          margin-bottom: 2rem;
        }

        .main-title {
          font-size: 2.25rem;
          margin: 0;
        }

        .sub-title {
          font-size: 1.25rem;
          margin-top: 0.5rem;
          margin-bottom: 0;
        }

        .scorecard-wrapper {
          margin-bottom: 2rem;
        }

        .results-wrapper {
          margin-bottom: 2rem;
        }

        /* Theme toggle button */
        .theme-toggle {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 2.5rem;
          height: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--card-bg);
          color: var(--text-color);
          border: none;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
          transition: background 0.3s, color 0.3s, transform 0.2s;
        }

        .theme-toggle:hover {
          transform: scale(1.1);
        }

        @media (max-width: 768px) {
          .header-section {
            padding-top: 3rem; /* Adjust as needed */
          }
        }
      `}</style>
    </main>
  );
}
