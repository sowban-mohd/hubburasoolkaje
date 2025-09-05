"use client";

import { useState } from "react";
import Image from "next/image";
import firstPlaceImg from "@/public/first_place.png";
import secondPlaceImg from "@/public/second_place.png";
import { Lexend_Deca } from "next/font/google";
import { FiSearch, FiX } from "react-icons/fi";

interface ResultItem {
  category: string;
  competition: string;
  gender?: string;
  firstPlace: { name: string; team: string };
  secondPlace: { name: string; team: string };
}

const lexendDeca = Lexend_Deca({
  subsets: ["latin"],
  weight: ["700"],
});

export default function ResultsSection({ results }: { results: ResultItem[] }) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const filteredResults = results.filter((item) => {
    const q = query.toLowerCase();
    return (
      item.competition.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      (item.gender?.toLowerCase().includes(q) ?? false) ||
      item.firstPlace.name.toLowerCase().includes(q) ||
      item.firstPlace.team.toLowerCase().includes(q) ||
      item.secondPlace.name.toLowerCase().includes(q) ||
      item.secondPlace.team.toLowerCase().includes(q)
    );
  });

  return (
    <div className="results-section">
      <div className="header">
        {!searchOpen ? (
          <>
            <h2 className={lexendDeca.className}>Announced Results</h2>
            <button className="search-btn" onClick={() => setSearchOpen(true)}>
              <FiSearch size={20} />
            </button>
          </>
        ) : (
          <div className="search-container">
            <input
              type="text"
              autoFocus
              placeholder="Search results..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              className="close-btn"
              onClick={() => {
                setSearchOpen(false);
                setQuery("");
              }}
            >
              <FiX size={20} />
            </button>
          </div>
        )}
      </div>

      {filteredResults.length === 0 ? (
        <p className="no-results">No results found.</p>
      ) : (
        <div className="results-list">
          {filteredResults.map((item, index) => (
            <div key={index} className="result-card">
              <button className="card-header" onClick={() => toggleExpand(index)}>
                <span>
                  {item.competition} - {item.category}
                  {item.gender ? ` (${item.gender})` : ""}
                </span>
                <span className={`arrow ${expandedIndex === index ? "expanded" : ""}`}>▼</span>
              </button>

              {expandedIndex === index && (
                <div className="card-body">
                  <div className="place">
                    <Image src={firstPlaceImg} alt="First place" width={25} height={40} />
                    <div>
                      <div className="name">{item.firstPlace.name}</div>
                      <div className="team">{item.firstPlace.team}</div>
                    </div>
                  </div>

                  <div className="place second">
                    <Image src={secondPlaceImg} alt="Second place" width={25} height={40} />
                    <div>
                      <div className="name">{item.secondPlace.name}</div>
                      <div className="team">{item.secondPlace.team}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .results-section {
          max-width: 32rem;
          margin-left: auto;
          margin-right: auto;
          position: relative;
        }

        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
          transition: all 0.3s ease;
        }

        .search-btn{
        background: none;
        border: none;
        cursor: pointer;
        color: var(--text-color);;
        }

        .close-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-color);;
        }
          
        h2 {
          font-size: 1.5rem;
        }

        .search-container {
          display: flex;
          width: 100%;
          gap: 0.5rem;
          align-items: center;
          animation: fadeIn 0.3s ease;
        }

        .search-container input {
          flex: 1;
          padding: 0.5rem 0.75rem;
          border: 1px solid #ccc;
          border-radius: 0.375rem;
          outline: none;
          font-size: 1rem;
          color: black;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .results-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .result-card {
          border: 1px solid #e5e5e5;
          border-radius: 0.5rem;
          overflow: hidden;
        }

        .card-header {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 1rem;
          background-color: #f3f3f3;
          border: none;
          cursor: pointer;
          color : black;
        }

        .card-header:hover {
          background-color: #e5e5e5;
        }

        .arrow {
          transition: transform 0.3s;
        }

        .arrow.expanded {
          transform: rotate(180deg);
        }

        

        .card-body {
          padding: 0.75rem 1rem;
          background-color: white;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .place {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .name {
          font-weight: 500;
          color: black;
        }

        .team {
          font-size: 0.875rem;
          color: #4b5563;
        }

        .no-results {
          text-align: center;
          color: #6b7280;
          padding: 1rem 0;
        }
      `}</style>
    </div>
  );
}
