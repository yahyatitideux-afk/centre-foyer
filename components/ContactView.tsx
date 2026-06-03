"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useSiteState } from "@/lib/SiteStateContext";
import Editable from "@/components/Editable";
import { Phone, Mail, MapPin, Send, MessageSquare, Compass, ShieldAlert, BadgeInfo, CheckCircle, LogIn } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";

const MapComponent = dynamic(() => import("./Map"), { ssr: false });

export default function ContactView() {
  const { general, setGeneral, addAssistanceRequest, registerModification, t } = useSiteState();
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + window.location.pathname,
      },
    });
  };
  
  // Interactive "Boussole de l'Alerte" state
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

  // Simple feedback message submission
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [senderMessage, setSenderMessage] = useState("");
  const [isSent, setIsSent] = useState(false);

  const scenarios = [
    {
      id: "abuse",
      label: "Maltraitances physiques aiguës",
      subtitle: "Coups, coups et blessures, hématomes",
      path: "Saisine pénale immédiate",
      action: "Appelez de concert la Brigade des Mineurs et le procureur. Présentez l'enfant à l'infirmerie d'auscultation du Centre d'Accueil et d'Urgence (CAU) de Djibouti sous 2h pour un bilan clinique initial réglementaire de sauvegarde."
    },
    {
      id: "abandon",
      label: "Nouveau-né ou mineur abandonné",
      subtitle: "Enfant en rupture d&apos;hébergement dans la rue",
      path: "Alerte de police h24 & Constat",
      action: "Contactez d'urgence la patrouille de police de garde pour enregistrer le constat officiel de carence de tutelle familiale parentale. Notre pouponnière d'accueil prépare le lit et l'alimentation clinique fortifiée de crise."
    },
    {
      id: "social",
      label: "Fugues récurrentes ou déscolarisation",
      subtitle: "Anxiété intense, précarité alimentaire",
      path: "Diagnostic Social & Enquête d&apos;apaisement",
      action: "Planifiez une entrevue auprès de l'assistante sociale spécialisée de notre pôle médical et éducatif. Nous initierons une enquête psychosociale approfondie sous 15 jours pour réconcilier ou désamorcer le foyer."
    }
  ];

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName || !senderMessage) return;

    // Persist assistance request in administrative state
    addAssistanceRequest({
      name: senderName,
      email: senderEmail,
      message: senderMessage
    });

    // Register action in system audit logs
    registerModification(
      `Formulaire d'assistance envoyé par ${senderName} (Alerte SMS transmise au +253 77179755)`,
      "text",
      () => {}
    );

    setIsSent(true);
    setTimeout(() => {
      setSenderName("");
      setSenderEmail("");
      setSenderMessage("");
      setIsSent(false);
    }, 6000);
  };

  const activeScenario = scenarios.find((s) => s.id === selectedScenario);

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-20" id="contact-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Header with elegant badges and typography */}
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] bg-rose-50 text-rose-700 font-black px-4 py-1.5 rounded-full inline-block border border-rose-200">
            Alerte Civique &amp; Assistance
          </span>
          <h1 className="font-serif italic text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Signalement &amp; Contacts
          </h1>
          <p className="text-xs sm:text-sm text-slate-650 font-sans leading-relaxed">
            Trouvez les canaux d&apos;intervention officiels de garde pour parer à la détresse infantile à Djibouti de manière légale et médicale.
          </p>
        </div>

        {/* 1. L'INTERACTIVE BOUSSOLE DE L'ALERTE (Diagnostic Protection Quiz) */}
        <div className="bg-white border border-slate-200 shadow-2xs rounded-[2.5rem] p-8 sm:p-12 max-w-4xl mx-auto mb-20 text-left" id="alert-compass-container">
          <div className="flex items-center gap-3.5 border-b border-slate-100 pb-6 mb-8">
            <div className="h-12 w-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100/50">
              <Compass className="h-6 w-6 text-orange-600 animate-spin-slow" />
            </div>
            <div className="text-left">
              <h3 className="font-serif italic font-black text-slate-950 text-xl">Boussole de l&apos;Alerte</h3>
              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">Outil de diagnostic de situation d&apos;urgence infantile</p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans mb-6">
            Vous êtes témoin d&apos;un mineur en situation critique à Djibouti ? Sélectionnez la configuration de détresse ci-dessous pour localiser instantanément la procédure et le canal de protection adapté :
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="scenarios-grid">
            {scenarios.map((sc) => (
              <button
                key={sc.id}
                onClick={() => setSelectedScenario(sc.id)}
                className={`p-5 rounded-2xl text-left border transition duration-300 cursor-pointer h-full flex flex-col justify-between ${
                  selectedScenario === sc.id
                    ? "bg-[#1E3A8A] text-white border-blue-900 shadow-lg shadow-blue-100/5"
                    : "bg-slate-50 text-slate-800 border-slate-150 hover:bg-slate-100 hover:border-slate-350"
                }`}
              >
                <div className="space-y-2">
                  <h4 className="font-serif italic font-bold text-sm sm:text-base">{sc.label}</h4>
                  <p className={`text-[10.5px] leading-relaxed font-sans ${selectedScenario === sc.id ? "text-slate-200" : "text-slate-500"}`}>
                    {sc.subtitle}
                  </p>
                </div>
                <span className={`text-[9px] font-mono font-bold uppercase tracking-widest block mt-4 border-t pt-3 ${selectedScenario === sc.id ? "text-amber-400 border-white/10" : "text-[#1E3A8A] border-slate-200"}`}>
                  Diagnostiquer →
                </span>
              </button>
            ))}
          </div>

          {/* Reveal details of selected diagnostic */}
          {activeScenario && (
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 sm:p-8 mt-8 text-left space-y-3 relative overflow-hidden" id="diagnostic-outcome">
              <div className="absolute top-0 right-0 w-44 h-44 bg-blue-600/5 rounded-full blur-2xl pointer-events-none" />
              <span className="text-rose-600 text-[10px] font-mono tracking-widest font-black uppercase bg-rose-50 border border-rose-100 px-3 py-1 rounded-full">
                Procédure recommandée
              </span>
              <h4 className="font-serif italic font-bold text-lg text-slate-900 pt-1">
                {activeScenario?.path}
              </h4>
              <p className="text-xs sm:text-sm text-slate-650 leading-relaxed font-sans whitespace-pre-line">
                {activeScenario?.action}
              </p>
              <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-amber-700 shrink-0" />
                <span className="text-[10.5px] text-amber-950 font-medium">Tout signalement abusif est répressible par le droit de la famille djiboutien.</span>
              </div>
            </div>
          )}
        </div>

        {/* 2. CONTACT DETAILS & DIRECT CORRESPONDENCE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto" id="contact-channels">
          
          {/* Detailed contact columns (Left) */}
          <div className="lg:col-span-5 space-y-8 text-left" id="contact-coords-col">
            <h2 className="font-serif italic text-2xl sm:text-3xl font-black text-slate-900 border-b border-slate-250 pb-4">Coordonnées</h2>
            
            <div className="space-y-6">
              
              {/* Emergency channels */}
              <div className="bg-rose-50/50 border border-rose-150 p-6 rounded-3xl flex gap-4">
                <div className="h-11 w-11 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-600/10 shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-rose-700 font-bold block">Protection d&apos;urgence H24</span>
                  <Editable
                    label="Numéro de Téléphone d'Urgence"
                    value={general.phoneEmergency || t("")}
                    onSave={(newVal) => setGeneral((prev) => ({ ...prev, phoneEmergency: newVal }))}
                  >
                    <p className="text-slate-900 font-bold font-serif text-base sm:text-lg">{general.phoneEmergency}</p>
                  </Editable>
                  <p className="text-[10.5px] text-slate-500 font-medium leading-relaxed font-mono uppercase">Ligne directe Brigade des mineurs &amp; Foyer</p>
                </div>
              </div>

              {/* Direct Mail */}
              <div className="bg-slate-100/50 border border-slate-205 p-6 rounded-3xl flex gap-4">
                <div className="h-11 w-11 rounded-2xl bg-[#1E3A8A] text-white flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="space-y-1 text-left">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[#1E3A8A] font-bold block">Correspondance Administration</span>
                  <Editable
                    label="Courriel Confidentiel"
                    value={general.email || t("")}
                    onSave={(newVal) => setGeneral((prev) => ({ ...prev, email: newVal }))}
                  >
                    <p className="text-slate-900 font-serif font-bold text-sm sm:text-base break-all">{general.email}</p>
                  </Editable>
                </div>
              </div>

              {/* Address physical Location */}
              <div className="bg-slate-100/50 border border-slate-205 p-6 rounded-3xl flex gap-4">
                <div className="h-11 w-11 rounded-2xl bg-[#1E3A8A] text-white flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="space-y-1 text-left">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[#1E3A8A] font-bold block">Adresse Géographique</span>
                  <Editable
                    label="Adresse Géographique du Foyer"
                    value={general.address || t("")}
                    onSave={(newVal) => setGeneral((prev) => ({ ...prev, address: newVal }))}
                  >
                    <p className="text-slate-900 text-xs sm:text-sm font-semibold leading-relaxed font-sans">{general.address}</p>
                  </Editable>
                </div>
              </div>
              
              {/* Interactive Leaflet Map */}
              <div className="h-64 sm:h-72 w-full relative border border-slate-205 rounded-3xl overflow-hidden shadow-sm bg-slate-100 flex items-center justify-center">
                 <MapComponent />
              </div>

            </div>
          </div>

          {/* Electronic Mailer Message box Form (Right) */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-[2rem] p-6 sm:p-10 shadow-2xs text-left" id="mailer-form-col">
            <h2 className="font-serif italic text-2xl sm:text-3xl font-black text-slate-900 mb-2">Formulaire d&apos;Assistance</h2>
            <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed font-medium mb-6">
              Utilisez ce formulaire officiel pour des requêtes d&apos;orientation administrative non urgentes. Les messages sont audités par le pôle administratif de concert avec la direction sociale et les magistrats.
            </p>

            {user ? (
                <form onSubmit={handleMessageSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-slate-600 text-[10px] font-mono font-bold uppercase tracking-wider block mb-2">Votre nom complet</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Omar Farah"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-205 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-600 text-[10px] font-mono font-bold uppercase tracking-wider block mb-2">Courriel confidentiel</label>
                      <input
                        type="email"
                        required
                        placeholder="Ex: omar@gmail.dj"
                        value={senderEmail}
                        onChange={(e) => setSenderEmail(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-205 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white"
                      />
                    </div>
                  </div>
    
                  <div>
                    <label className="text-slate-600 text-[10px] font-mono font-bold uppercase tracking-wider block mb-2">Détails de votre requête d&apos;orientation</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Écrivez votre message confidentiel ici..."
                      value={senderMessage}
                      onChange={(e) => setSenderMessage(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-205 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white resize-none"
                    />
                  </div>
    
                  {isSent ? (
                    <div className="space-y-3 animate-fade-in">
                      <div className="p-4 bg-emerald-50 border border-emerald-150 rounded-2xl flex items-center gap-3 text-emerald-800 font-sans text-xs font-semibold">
                        <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
                        <span>Votre requête d&apos;assistance confidentielle a été enregistrée à la console administrative du Foyer Daryel !</span>
                      </div>
                      <div className="p-4 bg-sky-50 border border-sky-150 rounded-2xl flex items-start gap-3 text-sky-900 font-mono text-[10.5px] leading-relaxed">
                        <span className="bg-[#1E3A8A] text-white font-extrabold p-1 px-1.5 rounded text-[8.5px] tracking-wider uppercase shrink-0 mt-0.5 animate-pulse">ALERTE SYSTEME</span>
                        <div className="text-left font-sans">
                          <span className="font-bold block text-slate-800">Signal SMS instantané expédié !</span>
                          <span>Une tonalité texto réglementaire a été acheminée en temps réel au numéro d&apos;astreinte administrative <strong className="font-mono text-xs text-slate-950 underline">+253 77179755</strong> pour notification immédiate.</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="submit"
                      className="bg-slate-950 hover:bg-slate-850 text-white font-sans font-bold text-xs uppercase tracking-wider py-4 px-6 rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition active:scale-95"
                    >
                      <Send className="h-4 w-4" />
                      <span>Sauvegarder le message de requête</span>
                    </button>
                  )}
                </form>
    ) : (
                <div className="flex flex-col items-center justify-center gap-4 p-8 border-2 border-dashed border-slate-300 rounded-3xl bg-slate-50" id="login-required-box">
                  <p className="text-sm text-slate-700 font-medium text-center">Pour plus de sécurité, veuillez vous connecter avec votre compte Gmail afin d&apos;accéder au formulaire.</p>
                  <button
                    onClick={loginWithGoogle}
                    className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-300 text-slate-900 rounded-xl font-semibold shadow-sm hover:bg-slate-50 transition active:scale-95"
                  >
                    <LogIn className="h-5 w-5" />
                    <span>Se connecter avec Google</span>
                  </button>
                </div>
    )}
          </div>

        </div>

      </div>
    </div>
  );
}
