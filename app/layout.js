import { Inter } from "next/font/google";
import "./globals.css";
import MyMain from "@/components/MyMain";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Chat U | Just Chat",
  description: "This is the chatting web app created with socket.io ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="app">
          <MyMain>{children}</MyMain>
        </main>
      </body>
    </html>
  );
}
