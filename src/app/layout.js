import { Inter } from "next/font/google";
import "./globals.css";
// import { ThemeProvider } from "@/Components/Context/ThemeContext";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Match App: Social network",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}