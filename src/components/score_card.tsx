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
  const yaqoothTeam = { name: "Yaqooth", score: yaqoothScore, img: yaqoothImg, bg: "#facc15", fg: "black" , width : 180, height : 140, imagePadding : "0.20rem"};
  const marjaanTeam = { name: "Marjaan", score: marjaanScore, img: marjaanImg, bg: "#16a34a", fg: "white", width : 180, height : 120, imagePadding : "0"};

  const topTeam = yaqoothScore >= marjaanScore
    ? yaqoothTeam
    : marjaanTeam;

  const bottomTeam = yaqoothScore >= marjaanScore
    ? marjaanTeam
    : yaqoothTeam;

  const containerStyle: React.CSSProperties = {
    width: "300px",
    height: "400px",
    margin: "2.5rem auto",
    borderRadius: "1rem",
    overflow: "hidden",
  };

  const teamStyle = (bg: string, color: string, padding : string): React.CSSProperties => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "50%",
    backgroundColor: bg,
    color: color,
    paddingLeft : padding
  });

  const scoreStyle: React.CSSProperties = {
    fontSize: "2.5rem",
    fontWeight: "bold",
    marginTop: "0.25rem",
  };

  return (
    <div style={containerStyle}>
      <div style={teamStyle(topTeam.bg, topTeam.fg, topTeam.imagePadding)}>
        <Image src={topTeam.img} alt={`${topTeam.name} Team`} width={topTeam.width} height={topTeam.height} />
        <span style={scoreStyle}>{topTeam.score}</span>
      </div>

      <div style={teamStyle(bottomTeam.bg, bottomTeam.fg, bottomTeam.imagePadding)}>
        <Image src={bottomTeam.img} alt={`${bottomTeam.name} Team`} width={bottomTeam.width} height={bottomTeam.height} />
        <span style={scoreStyle}>{bottomTeam.score}</span>
      </div>
    </div>
  );
}
