// src/pages/_app.tsx (PATH KRITIS DI SINI)

import "@/styles/globals.css";
import type { AppProps } from "next/app";

// 💡 Cek: Apakah file AuthContext.tsx ada di src/context/?
import { AuthProvider } from "@/context/AuthContext"; // JANGAN SAMPAI ADA TYPO

export default function App({ Component, pageProps }: AppProps) {
  return (
    // 💡 AuthProvider HARUS membungkus Component
    <AuthProvider> 
      <Component {...pageProps} />
    </AuthProvider>
  );
}