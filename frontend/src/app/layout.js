import { Inter } from 'next/font/google';
import "./globals.css";
import { AuthProvider } from "../context/AuthProvider";

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata = {
  title: "Scientis-Hunt",
  description: "Assessment platform"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-slate-50 text-slate-900 antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
