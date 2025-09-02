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

    // Filter results based on query
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
        <div className="mt-12 max-w-2xl mx-auto relative">
            <div className="flex items-center justify-between mb-4 relative">
                <h2 className={`text-2xl ${lexendDeca.className}`}>
                    Announced Results
                </h2>

                {!searchOpen && (
                    <button

                        onClick={() => setSearchOpen(true)}
                    >
                        <FiSearch size={20}/>
                    </button>
                )}

                {searchOpen && (
                    <div className="absolute top-0 left-0 w-full flex items-center bg-white px-2 py-1 rounded shadow z-10">
                        <button
                            onClick={() => {
                                setSearchOpen(false);
                                setQuery("");
                            }}
                            className="mr-2"
                        >
                            <FiX size={20} color = "black"/>
                        </button>
                        <input
                            type="text"
                            autoFocus
                            placeholder="Search results..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="flex-1 px-2 py-1 border rounded outline-none text-black placeholder-gray-500"
                        />
                    </div>
                )}
            </div>

            {filteredResults.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No results found.</p>
            ) : (
                <div className="space-y-4">
                    {filteredResults.map((item, index) => (
                        <div key={index} className="border rounded-lg overflow-hidden">
                            <button
                                className="w-full flex justify-between items-center px-4 py-3 bg-gray-100 hover:bg-gray-200"
                                onClick={() => toggleExpand(index)}
                            >
                                <span className="font-medium text-black">
                                    {item.competition} - {item.category}
                                    {item.gender ? ` (${item.gender})` : ""}
                                </span>
                                <span
                                    className={`transform transition-transform text-black ${expandedIndex === index ? "rotate-180" : ""
                                        }`}
                                >
                                    ▼
                                </span>
                            </button>

                            {expandedIndex === index && (
                                <div className="px-4 py-3 bg-white space-y-2">
                                    <div className="flex items-center space-x-3">
                                        <Image
                                            src={firstPlaceImg}
                                            alt="First place"
                                            width={25}
                                            height={25}
                                        />
                                        <div>
                                            <div className="font-medium text-black">
                                                {item.firstPlace.name}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {item.firstPlace.team}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <Image
                                            src={secondPlaceImg}
                                            alt="Second place"
                                            width={25}
                                            height={25}
                                            className="ml-10"
                                        />
                                        <div>
                                            <div className="font-medium text-black">
                                                {item.secondPlace.name}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {item.secondPlace.team}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
