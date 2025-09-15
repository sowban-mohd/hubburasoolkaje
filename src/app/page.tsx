"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/services/supabase";
import logoImg from "@/public/logo.png";
import ScoreCard from "@/components/score_card";
import ResultsSection from "@/components/result_section";
import { Luxurious_Roman, Zain } from "next/font/google";
import { FiSun, FiMoon, FiFilter } from "react-icons/fi";

interface ResultItem {
  category: string;
  competition: string;
  gender: string;
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

  const [serverDown, setServerDown] = useState(true);

  const allCategories = [
    "Kiddies",
    "Sub Junior",
    "Junior",
    "Senior",
    "Super Senior",
    "Super Senior Degree",
    "General",
    "Old Students General",
    "Old Students Senior",
    "Old Students Junior",
  ];

  const allGenders = ["Boys", "Girls"];

  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    ...allCategories,
  ]);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([
    ...allGenders,
  ]);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const isAllCategoriesSelected =
    selectedCategories.length === allCategories.length &&
    allCategories.every((c) => selectedCategories.includes(c));

  const isAllGendersSelected =
    selectedGenders.length === allGenders.length &&
    allGenders.every((g) => selectedGenders.includes(g));

  // Fetch initial data ordered by announced_at
  const fetchResults = async () => {
    const { data, error } = await supabase
      .from("announced_results")
      .select("*")
      .order("announced_at", { ascending: false });

    if (error) {
      console.error("Error fetching results:", error.message);
      return;
    }

    if (data) {
      const parsedData: ResultItem[] = data.map(
        (item: Record<string, unknown>) => ({
          category: item["category"] as string,
          competition: item["competition"] as string,
          gender: item["gender"] as string,
          firstPlace: item["first_place"] as { name: string; team: string },
          secondPlace: item["second_place"] as { name: string; team: string },
        })
      );

      setResults(parsedData);
      updateScores(parsedData);

      setTimeout(() => {
        setLoadingPercent(100);
        setTimeout(() => setLoading(false), 500);
      }, 500);
    }
  };

  // Update team scores based on first and second place
  const updateScores = (data: ResultItem[]) => {
    const scoreMap: Record<string, number> = {};

    data.forEach((r) => {
      if (r.firstPlace?.team) {
        scoreMap[r.firstPlace.team] = (scoreMap[r.firstPlace.team] || 0) + 10;
      }
      if (r.secondPlace?.team) {
        scoreMap[r.secondPlace.team] = (scoreMap[r.secondPlace.team] || 0) + 5;
      }
    });

    setScores(scoreMap);
  };

  // Get filtered results
  const getFilteredResults = () => {
    return results.filter(
      (r) =>
        selectedCategories.includes(r.category) &&
        selectedGenders.includes(r.gender)
    );
  };

  const applyFilter = () => {
    updateScores(getFilteredResults());
    setShowFilterModal(false);
  };

  const resetFilters = () => {
    setSelectedCategories([...allCategories]);
    setSelectedGenders([...allGenders]);
  };

  // Subscribe to real-time updates
  useEffect(() => {
    fetchResults();

    const channel = supabase
      .channel("announced_results_stream")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "announced_results" },
        () => {
          fetchResults();
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "announced_results" },
        () => fetchResults()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Loading bar progress animation
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

  if (serverDown) {
    return (
      <main className="error-screen">
        <div className="error-box">
          <h1>500 Internal Server Error</h1>
          <pre>
            {`Error: Failed to fetch data from API endpoint.
          
  at fetchResults (/app/services/supabase.js:42:17)
  at processTicksAndRejections (node:internal/process/task_queues:96:5)
  at async useEffect (/app/page.tsx:89:9)
          
Status: 500 INTERNAL SERVER ERROR
`}
          </pre>
          <p className="hint-text">
            Please try again later or contact your system administrator.
          </p>
        </div>

        <style jsx>{`
        .error-screen {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background: #0d0d0d;
          padding: 20px;
        }
        .error-box {
          background: #1a1a1a;
          border: 1px solid #333;
          color: #f5f5f5;
          font-family: monospace;
          padding: 24px;
          max-width: 800px;
          width: 100%;
          border-radius: 8px;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.8);
        }
        h1 {
          font-size: 1.8rem;
          color: #ff5555;
          margin-bottom: 16px;
        }
        pre {
          background: #111;
          padding: 16px;
          font-size: 0.9rem;
          overflow-x: auto;
          border-radius: 6px;
          margin-bottom: 12px;
          line-height: 1.4;
        }
        .hint-text {
          font-size: 0.85rem;
          color: #999;
          text-align: center;
        }
      `}</style>
      </main>
    );
  }



  return (
    <main className={`home ${darkMode ? "dark" : "light"}`}>
      {loading ? (
        <div className="loading-screen">
          <div className="loading-content">
            <img src={logoImg.src} alt="Loading Logo" className="loading-logo" />
            <p className="loading-text">{loadingPercent}%</p>
          </div>
        </div>
      ) : (
        <>
          {/* Theme and Filter Buttons */}
          <div className="top-right-buttons">
            <button className="filter-toggle" onClick={() => setShowFilterModal(true)}>
              <FiFilter size={20} />
            </button>
            <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>
          </div>

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
            <ResultsSection results={getFilteredResults()} />
          </div>
        </>
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Filter Results</h2>
              <button onClick={resetFilters} className="reset-btn">
                Reset
              </button>
            </div>

            {/* Category Section */}
            <div className="filter-section">
              <div className="section-header">
                <h3>Category</h3>
                <button
                  onClick={() =>
                    isAllCategoriesSelected
                      ? setSelectedCategories([])
                      : setSelectedCategories([...allCategories])
                  }
                  className="select-all-btn"
                >
                  {isAllCategoriesSelected ? "Deselect All" : "Select All"}
                </button>
              </div>
              <div className="options-grid">
                {allCategories.map((cat) => (
                  <button
                    key={cat}
                    className={`option-btn ${selectedCategories.includes(cat) ? "selected" : ""
                      }`}
                    onClick={() =>
                      setSelectedCategories((prev) =>
                        prev.includes(cat)
                          ? prev.filter((c) => c !== cat)
                          : [...prev, cat]
                      )
                    }
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Gender Section */}
            <div className="filter-section">
              <div className="section-header">
                <h3>Gender</h3>
                <button
                  onClick={() =>
                    isAllGendersSelected
                      ? setSelectedGenders([])
                      : setSelectedGenders([...allGenders])
                  }
                  className="select-all-btn"
                >
                  {isAllGendersSelected ? "Deselect All" : "Select All"}
                </button>
              </div>
              <div className="options-grid">
                {allGenders.map((gen) => (
                  <button
                    key={gen}
                    className={`option-btn ${selectedGenders.includes(gen) ? "selected" : ""
                      }`}
                    onClick={() =>
                      setSelectedGenders((prev) =>
                        prev.includes(gen)
                          ? prev.filter((g) => g !== gen)
                          : [...prev, gen]
                      )
                    }
                  >
                    {gen}
                  </button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowFilterModal(false)}>
                Cancel
              </button>
              <button className="save-btn" onClick={applyFilter}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Styles */}
      <style jsx>{`
        :global(body) {
          margin: 0 auto;
        }

        .loading-screen {
          position: fixed;
          inset: 0;
          background: #111;
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
          --text-secondary: #4b5563;
          --option-selected: #16a34a;
          --option-unselected: #d1d5db;
        }

        .home.dark {
          --bg-color: #111;
          --text-color: #fefefe;
          --card-bg: #1e1e1e;
          --text-secondary: #9ca3af;
          --option-selected: #16a34a;
          --option-unselected: #374151;
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

        .top-right-buttons {
          position: absolute;
          top: 1rem;
          right: 1rem;
          display: flex;
          gap: 0.5rem;
        }

        .theme-toggle,
        .filter-toggle {
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

        .theme-toggle:hover,
        .filter-toggle:hover {
          transform: scale(1.1);
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
        }

        .modal {
          background: var(--card-bg);
          color: var(--text-color);
          padding: 1.5rem;
          border-radius: 10px;
          width: 90%;
          max-width: 500px;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .reset-btn,
        .select-all-btn {
          background: transparent;
          border: 1px solid var(--text-secondary);
          padding: 0.25rem 0.5rem;
          border-radius: 5px;
          cursor: pointer;
          color: var(--text-color);
        }

        .filter-section {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .options-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 0.5rem;
        }

        .option-btn {
          padding: 0.5rem;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          background: var(--option-unselected);
          color: var(--text-color);
          transition: background 0.3s;
        }

        .option-btn.selected {
          background: var(--option-selected);
          color: #fff;
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
        }

        .cancel-btn,
        .save-btn {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        .cancel-btn {
          background: var(--option-unselected);
          color: var(--text-color);
        }

        .save-btn {
          background: var(--option-selected);
          color: #fff;
        }
      `}</style>
    </main>
  );
}
