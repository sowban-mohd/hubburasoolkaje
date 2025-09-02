import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["400", "500", "700"]
})

const metadata = {
  title: "Hubbu Rasool 2025 IFHSM Kaje",
  description: "A web app to view live scores and results from the Irshaful Athfal Higher Secondary Madrasa's art competition (Hubbu Rasool 2025) on the great month of Rabi-al-awwal"
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}