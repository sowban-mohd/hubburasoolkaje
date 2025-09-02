import Image from "next/image";
import yaqoothImg from "../public/yaqooth_logo.png";
import marjaanImg from "../public/marjaan_logo.png";

export default function ScoreCard({
  yaqoothScore,
  marjaanScore,
}: {
  yaqoothScore: number;
  marjaanScore: number;
}) {
  // Decide which team is on top
  const topTeam = yaqoothScore >= marjaanScore
    ? { name: "Yaqooth", score: yaqoothScore, img: yaqoothImg, bg: "bg-yellow-400", textColor: "text-black" }
    : { name: "Marjaan", score: marjaanScore, img: marjaanImg, bg: "bg-green-600", textColor: "text-white" };

  const bottomTeam = yaqoothScore >= marjaanScore
    ? { name: "Marjaan", score: marjaanScore, img: marjaanImg, bg: "bg-green-600", textColor: "text-white" }
    : { name: "Yaqooth", score: yaqoothScore, img: yaqoothImg, bg: "bg-yellow-400", textColor: "text-black" };

  return (
    <div className="mx-auto mt-10 rounded-2xl overflow-hidden" style={{ width: "300px", height: "400px" }}>
      {/* Top half */}
      <div className={`flex flex-col justify-center items-center h-1/2 ${topTeam.bg}`}>
        <Image src={topTeam.img} alt={`${topTeam.name} Team`} width={225} height={230} />
        <span className={`text-5xl font-bold mt-4 ${topTeam.textColor}`}>{topTeam.score}</span>
      </div>

      {/* Bottom half */}
      <div className={`flex flex-col justify-center items-center h-1/2 ${bottomTeam.bg}`}>
        <Image src={bottomTeam.img} alt={`${bottomTeam.name} Team`} width={225} height={225} />
        <span className={`text-5xl font-bold mt-4 ${bottomTeam.textColor}`}>{bottomTeam.score}</span>
      </div>
    </div>
  );
}
