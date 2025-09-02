"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/services/firebase";
import ScoreCard from "@/components/score_card";
import ResultsSection from "@/components/result_section";
import { Luxurious_Roman, Zain } from "next/font/google";

interface ResultItem {
  category: string;
  competition: string;
  gender?: string;
  firstPlace: { name: string; team: string };
  secondPlace: { name: string; team: string };
}

const luxurios_roman = Luxurious_Roman({
  subsets: ["latin"],
  weight: ["400"],
});

const zain = Zain({
  subsets: ["latin"],
  weight: ["400"],
});

export default function Home() {
  const [results, setResults] = useState<ResultItem[]>([]);
  const [scores, setScores] = useState<Record<string, number>>({});

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "results"), (snapshot) => {
      const data: ResultItem[] = snapshot.docs.map((doc) => doc.data() as ResultItem).reverse();
      setResults(data);

      // Calculate scores dynamically
      const scoreMap: Record<string, number> = {};
      data.forEach((r) => {
        scoreMap[r.firstPlace.team] = (scoreMap[r.firstPlace.team] || 0) + 10;
        scoreMap[r.secondPlace.team] = (scoreMap[r.secondPlace.team] || 0) + 5;
      });
      setScores(scoreMap);
    });

    return () => unsubscribe();
  }, []);

  return (
    <main className="p-6">
      <div className="text-left">
        <h1 className={`${luxurios_roman.className} text-4xl`}>
          Hubbu Rasool - Meelad Fest 2025
        </h1>
        <p className={`${zain.className}text-xl mt-2`}>
          Irshadul Athfal Higher Secondary Madrasa Kaje
        </p>
      </div>

      <div>
        <ScoreCard
          yaqoothScore={scores["Yaqooth"] || 0}
          marjaanScore={scores["Marjaan"] || 0}
        />
      </div>

      <div>
        <ResultsSection results={results} />
      </div>
    </main>
  );
}
