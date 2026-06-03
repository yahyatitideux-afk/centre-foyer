import "./globals.css";
import React from "react";
import { SiteStateProvider } from "@/lib/SiteStateContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatbotWidget from "@/components/ChatbotWidget";
import UnifiedEditorOverlay from "@/components/UnifiedEditorOverlay";
import { Landmark } from "lucide-react";

export const metadata = {
  title: "Foyer Daryel - Centre d'Accueil et d'Urgence de Djibouti",
  description: "Portail officiel d'information sociale et administrative pour la protection h24 de l'enfance en détresse à Djibouti."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="scroll-smooth" suppressHydrationWarning>
      <body className="bg-[#FAF9F5] text-slate-800 min-h-screen flex flex-col justify-between antialiased">
        <SiteStateProvider>
          {/* Header persistent navigation */}
          <Navbar />

          {/* Core main display layouts */}
          <main className="flex-grow">{children}</main>

          {/* Floating conversational helper */}
          <ChatbotWidget />

          {/* Floating unified visual editor controls for administrations */}
          <UnifiedEditorOverlay />

          {/* Institutional legal Footer */}
          <Footer />

        </SiteStateProvider>
      </body>
    </html>
  );
}
