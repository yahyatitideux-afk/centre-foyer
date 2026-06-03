"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, ShieldAlert, Sparkles, User, HelpCircle } from "lucide-react";

// Auto-response database for common Daryel Center FAQs
const getAutoResponse = (lowercaseText: string): string | null => {
  if (lowercaseText.includes("signaler") || lowercaseText.includes("maltrait") || lowercaseText.includes("viol") || lowercaseText.includes("abus")) {
    return "Pour signaler un enfant maltraité à Djibouti :\n\n📞 **Téléphone d'urgence (H24) :** Contactez immédiatement la Brigade des Mineurs de la Police Nationale au **+253 21 35 12 12** ou composez le **17**.\n\n⚖️ **Signalement légal :** Vous pouvez également effectuer une déclaration auprès du Parquet (Procureur de la République) au Palais de Justice.\n\n⚠️ **Urgence Vitale :** Si l'enfant présente des blessures physiques graves ou est en danger immédiat, emmenez-le ou orientez-le vers le service d'urgence pédiatrique de l'hôpital le plus proche, le Foyer Daryel pourra ensuite assurer sa prise en charge d'urgence sous 2 heures après accord des autorités.";
  }
  if (lowercaseText.includes("condition") || lowercaseText.includes("garde") || lowercaseText.includes("admiss") || lowercaseText.includes("accueil") || lowercaseText.includes("urgen")) {
    return "Le Foyer Daryel applique des conditions strictes pour la mise à l'abri d'un mineur :\n\n🛡️ **Garantie Légale :** L'admission d'un enfant nécessite obligatoirement soit un signalement officiel de la Brigade des Mineurs, soit une décision ou ordonnance du Procureur de la République.\n\n🏥 **Examen médical initial :** Dès l'admission, un contrôle pédiatrique et clinique complet est réalisé sous 2 heures pour soigner les blessures visibles et stabiliser l'état psycho-affectif.\n\n🏠 **Hébergement sécurisé :** Le foyer offre un toit sûr, une alimentation saine et fortifiée, ainsi qu'un encadrement par des éducateurs spécialisés.";
  }
  if (lowercaseText.includes("procureur") || lowercaseText.includes("juge") || lowercaseText.includes("magistrat") || lowercaseText.includes("tribunal") || lowercaseText.includes("justice")) {
    return "Le Procureur de la République joue un rôle central dans le processus d'accueil et de placement :\n\n⚖️ **Autorité de décision :** C'est le magistrat du Parquet qui décide en urgence du placement provisoire de l'enfant au Foyer Daryel après enquête de la Brigade des Mineurs.\n\n📊 **Instruction du dossier & Enquêtes sociales :** Durant la période d'observation (15 à 30 jours), le procureur instruit le dossier et coordonne nos enquêtes psychosociales afin de rechercher la famille élargie ou une famille de confiance.\n\n👩‍⚖️ **Saisine du Juge :** Si aucune solution familiale sécurisée n'est identifiée, le Procureur saisit le Juge des enfants qui prononcera par ordonnance un placement de plus longue durée ou une réorientation statutaire pérenne.";
  }
  if (lowercaseText.includes("mission") || lowercaseText.includes("rôle") || lowercaseText.includes("que fait") || lowercaseText.includes("but") || lowercaseText.includes("objectif")) {
    return "Le Centre d'Accueil et d'Urgence (CAU) Daryel de Djibouti mène 3 grandes missions :\n\n1️⃣ **Sauvetage & Hébergement d'urgence (H24) :** Retrait immédiat des mineurs d'un environnement nocif pour leur offrir un abri, des repas équilibrés et des vêtements adaptés.\n\n2️⃣ **Réhabilitation Psycho-Affective :** Prise en charge psychoclinique quotidienne et ateliers pour aider l'enfant à surmonter ses traumatismes.\n\n3️⃣ **Enquêtes psychosociales & Support juridique :** Collaboration permanente avec les autorités judiciaires pour préparer l'avenir de l'enfant (réintégration sécurisée ou placement à long terme).";
  }
  if (lowercaseText.includes("contact") || lowercaseText.includes("téléphone") || lowercaseText.includes("numéro") || lowercaseText.includes("joindre") || lowercaseText.includes("mail") || lowercaseText.includes("courriel")) {
    return "Vous pouvez contacter le Foyer Daryel par les canaux officiels suivants :\n\n📞 **Ligne de Garde Administrative / Urgence :** +253 21 35 12 12\n\n✉️ **E-mail officiel :** contact@foyer-daryel.dj\n\n📌 **Situation géographique :** Secteur protégé, Djibouti-Ville (République de Djibouti).\n\n*Pour toute urgence vitale concernant un enfant en danger immédiat, composez directement le 17 pour joindre la Police ou Brigade des mineurs.*";
  }
  if (lowercaseText.includes("adresse") || lowercaseText.includes("situé") || lowercaseText.includes("localiser") || lowercaseText.includes("ville") || lowercaseText.includes("géograph")) {
    return "Le Foyer Daryel est situé dans un **secteur sécurisé et protégé de Djibouti-Ville** pour préserver la sécurité physique et l'anonymat des enfants admis. Pour des raisons évidentes de protection des mineurs, l'accès complet et les visites nécessitent une autorisation écrite rigoureuse du Parquet ou d'une autorité policière agréée. Pour tout rendez-vous administratif, merci de nous contacter d'abord par téléphone au **+253 21 35 12 12**.";
  }
  return null;
};

// Elegant newline & bold formatter for chat messages
const renderMessageText = (text: string) => {
  const lineBlocks = text.split("\n");
  return lineBlocks.map((line, blockIdx) => {
    // Bold parsing
    const parts = line.split(/(\*\*.*?\*\*)/g);
    return (
      <div key={blockIdx} className={line.trim() === "" ? "h-2" : "min-h-[1.125rem]"}>
        {parts.map((p, idx) => {
          if (p.startsWith("**") && p.endsWith("**")) {
            return (
              <strong key={idx} className="font-extrabold text-[#111827] dark:text-[#FAF9F6]">
                {p.substring(2, p.length - 2)}
              </strong>
            );
          }
          return p;
        })}
      </div>
    );
  });
};

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: "user" | "bot"; text: string }>>([
    {
      sender: "bot",
      text: "Bonjour ! Je suis l'assistant d'orientation réglementaire du Foyer Daryel. Comment puis-je vous aider aujourd'hui ?"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentSentiment, setCurrentSentiment] = useState<"distressed" | "grateful" | "neutral">("neutral");

  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const analyzeSentiment = (text: string): "distressed" | "grateful" | "neutral" => {
    const t = text.toLowerCase();
    const distressWords = [
      "maltrait", "viol", "abus", "danger", "peur", "pleure", "détresse", "seul", 
      "triste", "mal", "blessé", "urgence", "police", "agress", "securite", "securité", 
      "faim", "manger", "froid", "rue", "abandon", "cruel", "battu", "frapper", "secour", "souff"
    ];
    const gratefulWords = [
      "merci", "génial", "parfait", "super", "gentil", "reconnaissant", "bravo", 
      "excellent", "adore", "formidable", "merveilleux"
    ];
    if (distressWords.some((w) => t.includes(w))) return "distressed";
    if (gratefulWords.some((w) => t.includes(w))) return "grateful";
    return "neutral";
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const sentiment = analyzeSentiment(textToSend);
    setCurrentSentiment(sentiment);

    // Append user message
    const updatedMessages = [...messages, { sender: "user" as const, text: textToSend }];
    setMessages(updatedMessages);
    setInputValue("");
    setLoading(true);

    const lowercaseText = textToSend.toLowerCase().trim();
    const matchedLocal = getAutoResponse(lowercaseText);

    if (matchedLocal) {
      setTimeout(() => {
        let textResult = matchedLocal;
        if (sentiment === "distressed") {
          textResult = "💔 **Soutien Empathique :** *Je perçois beaucoup de détresse ou de stress dans votre message. Sachez que le Foyer Daryel est un lieu de refuge entièrement confidentiel et sécurisé. Voici les détails pour vous éclairer dans l'urgence :*\n\n" + textResult;
        } else if (sentiment === "grateful") {
          textResult = "✨ **Gratitude :** *Merci du fond du cœur pour vos pensées chaleureuses. Nous continuons d'accompagner chaque enfant avec bienveillance :*\n\n" + textResult;
        }
        setMessages((prev) => [...prev, { sender: "bot" as const, text: textResult }]);
        setLoading(false);
      }, 650);
      return;
    }

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: updatedMessages.map((m) => ({ content: m.text })),
          sentiment
        })
      });

      const data = await response.json();
      if (data.text) {
        setMessages((prev) => [...prev, { sender: "bot", text: data.text }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "Nous rencontrons un problème de liaison avec notre réseau d'assistance. Veuillez appeler notre cellule de garde administrative au +253 21 35 12 12." }
        ]);
      }
    } catch (e) {
      console.error("Failure fetching chatbot answers", e);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Problème de communication avec le serveur d'assistance. N'hésitez pas à nous joindre directement au +253 21 35 12 12." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    handleSendMessage(question);
  };

  const quickQuestions = [
    "Comment signaler un enfant maltraité à Djibouti ?",
    "Quelles sont les conditions de garde d'urgence du foyer ?",
    "Quel est le rôle du procureur dans le placement ?"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end" id="widget-chatbot-wrapper">
      
      {/* 1. CHATBOX CONSOLE WINDOW (Render conditionally) */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-[420px] h-[550px] bg-white dark:bg-slate-950 rounded-[2rem] border border-slate-200/80 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col justify-between" id="chatbot-console-win">
          
          {/* Header bar colored in space slate */}
          <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="h-9.5 w-9.5 rounded-2xl bg-blue-600 flex items-center justify-center text-sm font-serif font-black italic shadow-md">
                D
              </div>
              <div className="text-left">
                <h4 className="font-serif italic font-bold text-xs sm:text-sm leading-none">Assistant de Garde</h4>
                <div className="flex items-center gap-1.5 mt-1.5 leading-none">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9.5px] text-slate-400 font-mono font-bold uppercase tracking-wider">Ligne d&apos;écoute active</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-white transition duration-250 hover:bg-slate-800/50 cursor-pointer"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* Area detailing alerts rules */}
          <div className="p-3 bg-amber-50/75 dark:bg-amber-955/15 border-b border-amber-100 dark:border-amber-900/15 flex items-center gap-2.5">
            <ShieldAlert className="h-4.5 w-4.5 text-amber-600 shrink-0" />
            <p className="text-[10.5px] text-slate-700 dark:text-amber-200/90 font-sans leading-relaxed text-left font-semibold">
              Des urgences médicales pédiatriques ? Composez de suite le +253 21 35 12 12.
            </p>
          </div>

          {currentSentiment !== "neutral" && (
            <div className={`p-2.5 px-4.5 border-b text-left flex items-center gap-2 font-mono text-[9.5px] font-bold tracking-wider select-none animate-fade-in ${
              currentSentiment === "distressed"
                ? "bg-rose-50 text-rose-700 border-rose-100"
                : "bg-emerald-50 text-emerald-700 border-emerald-100"
            }`}>
              <span className={`h-2 w-2 rounded-full ${currentSentiment === "distressed" ? "bg-rose-600 animate-pulse" : "bg-emerald-500 animate-ping"}`} />
              <span>
                {currentSentiment === "distressed"
                  ? "💖 AJUSTEMENT EMPATHIQUE AUTOMATIQUE ACTIF : ÉCOUTE BIENVEILLANTE"
                  : "✨ AJUSTEMENT CHALEUREUX DE GRATITUDE : REMERCIEMENT"}
              </span>
            </div>
          )}

          {/* Messages list scroll area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-900/20">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 w-full max-w-[88%] ${
                  m.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                {/* Visual Avatar icons */}
                <div className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                  m.sender === "user" 
                    ? "bg-slate-900 dark:bg-slate-800 text-white" 
                    : "bg-blue-100 dark:bg-slate-800 text-[#1E3A8A] dark:text-blue-400"
                }`}>
                  {m.sender === "user" ? <User className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
                </div>

                {/* Bubble details */}
                <div className={`p-3.5 rounded-2xl text-left text-xs leading-relaxed font-sans shadow-2xs ${
                  m.sender === "user"
                    ? "bg-[#1E3A8A] dark:bg-blue-700 text-white rounded-tr-none"
                    : "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-150 dark:border-slate-800 rounded-tl-none"
                }`}>
                  {renderMessageText(m.text)}
                </div>
              </div>
            ))}

            {/* Spinner loading */}
            {loading && (
              <div className="flex gap-2 max-w-[85%] mr-auto items-center">
                <div className="h-8 w-8 rounded-xl bg-blue-100 dark:bg-slate-800 text-[#1E3A8A] dark:text-blue-400 flex items-center justify-center shrink-0 shadow-xs animate-pulse">
                  <Sparkles className="h-3.5 w-3.5 animate-spin" />
                </div>
                <div className="p-3.5 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl rounded-tl-none flex gap-1.5 items-center shadow-2xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce" />
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce delay-100" />
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce delay-200" />
                </div>
              </div>
            )}

            <div ref={endRef} />
          </div>

          {/* Preset SUGGESTIONS elements */}
          {messages.length === 1 && (
            <div className="px-5 py-4 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 space-y-2.5 text-left shrink-0">
              <span className="text-[9.5px] font-mono font-bold text-slate-400 dark:text-slate-505 uppercase tracking-widest block flex items-center gap-1.5">
                <HelpCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" /> Questions fréquemment posées :
              </span>
              <div className="flex flex-col gap-2 pt-1">
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleQuickQuestion(q)}
                    className="w-full text-left bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-150 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-sans text-[11px] font-semibold py-2.5 px-3.5 rounded-xl transition cursor-pointer leading-relaxed"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* User message input submission bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
            className="p-4 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex gap-2 items-center shrink-0"
          >
            <input
              type="text"
              placeholder="Saisissez une question d'orientation..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-205 dark:border-slate-800 py-3 px-4 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white dark:focus:bg-slate-950 text-slate-805 dark:text-slate-100"
            />
            <button
              type="submit"
              className="bg-[#1E3A8A] dark:bg-blue-700 hover:bg-blue-900 dark:hover:bg-blue-800 text-white p-3.5 rounded-xl cursor-pointer transition active:scale-95 flex items-center justify-center shrink-0"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>

        </div>
      )}

      {/* 2. MAIN FLOATING LAUNCHER BUTTON with alerts badge indicators */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 w-14 rounded-full bg-[#1E3A8A] dark:bg-blue-700 hover:bg-blue-900 dark:hover:bg-blue-800 text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:rotate-6 transition-all duration-300 relative border border-blue-400/20 cursor-pointer"
        id="chatbot-launcher-trigger"
        title="Ouvrir l'assistant d'aide"
      >
        <MessageCircle className="h-6.5 w-6.5 text-white" />
        <span className="absolute top-0.5 right-0.5 h-3.5 w-3.5 bg-emerald-500 rounded-full border-2 border-white block animate-pulse" />
      </button>

    </div>
  );
}
