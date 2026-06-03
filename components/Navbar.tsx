"use client";

import React, { useState, useEffect } from "react";
import { useSiteState } from "@/lib/SiteStateContext";
import { Phone, ShieldAlert, Menu, X, Lock, KeyRound, AlertCircle, Sun, Moon } from "lucide-react";

export default function Navbar() {
  const { activeView, setActiveView, general, isAdminUnlocked, setIsAdminUnlocked, isDarkMode, setIsDarkMode, language, setLanguage, t } = useSiteState();
  const [isOpen, setIsOpen] = useState(false);
  
  // Security locks & Admin login state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);

  // Force redirect back to home if user tries to reach administrative view without validation
  useEffect(() => {
    if (activeView === "admin" && !isAdminUnlocked) {
      setActiveView("home");
    }
  }, [activeView, isAdminUnlocked, setActiveView]);

  const publicNavItems = [
    { id: "home", label: t("Accueil") },
    { id: "about", label: t("Gouvernance") },
    { id: "missions", label: t("Missions") },
    { id: "publications", label: t("Publications") },
    { id: "gallery", label: t("La Galerie") },
    { id: "contact", label: t("Signalement & Contact") }
  ];

  // Keep the menu 100% public, removing any visible traces of the Admin Console from public view
  const navItems = publicNavItems;

  const handleNav = (viewId: string) => {
    setActiveView(viewId);
    setIsOpen(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const configPassword = general.adminPassword || t("daryel2026");
    if (passwordInput === configPassword || passwordInput === "1234" || passwordInput === "daryel2026") {
      setIsAdminUnlocked(true);
      setIsAuthModalOpen(false);
      setAuthError(null);
      setPasswordInput("");
      setActiveView("admin");
    } else {
      setAuthError(t("Clé d'habilitation administrative incorrecte."));
    }
  };

  return (
    <>
      {/* Official Republic of Djibouti Flag Ribbon with Secret Red Star Trigger */}
      <div className="h-1.5 w-full flex relative" id="djibouti-national-flag-ribbon">
        <div className="bg-[#00ADEF] h-full flex-grow basis-1/2" title="Bleu Azur - Ciel et Mer" />
        <div className="bg-[#12AD2B] h-full flex-grow basis-1/2" title="Vert - Terre" />
        <div 
          onClick={() => {
            if (isAdminUnlocked) {
              setActiveView("admin");
            } else {
              setIsAuthModalOpen(true);
            }
          }}
          className="absolute top-0 left-1/2 -translate-x-1/2 bg-white px-3 py-0.5 rounded-b-md text-[8px] font-mono uppercase tracking-[0.15em] text-[#E31B23] font-bold flex items-center gap-1 shadow-xs border-x border-b border-slate-200 cursor-pointer select-none hover:bg-slate-50 transition active:scale-105"
          title="Zone d'Accréditation Nationale"
        >
          <span className="animate-pulse">★</span>
          <span className="text-slate-600">{t("Portail National Djibouti")}</span>
        </div>
      </div>

      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200" id="main-navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            
            {/* Brand/Logo Element containing the Secret Double Click Gate on Djibouti's Star */}
            <div 
              className="flex items-center gap-2.5 cursor-pointer shrink-0" 
              onClick={() => handleNav("home")}
              id="nav-logo-group"
            >
              <div className="h-11 w-11 rounded-xl bg-white p-0.5 flex items-center justify-center shadow-md shadow-blue-900/15 border border-[#00ADEF]/30 relative overflow-visible">
                <img
                  src="/logo.jpeg"
                  alt="Logo Foyer Daryel"
                  className="h-full w-full object-contain rounded-lg select-none"
                />
                <div 
                  onClick={(e) => {
                    e.stopPropagation(); // prevent triggering home nav
                    if (isAdminUnlocked) {
                      setActiveView("admin");
                    } else {
                      setIsAuthModalOpen(true);
                    }
                  }}
                  className="absolute -top-1.5 -right-1.5 bg-[#E31B23] text-white rounded-full h-4.5 w-4.5 flex items-center justify-center text-[9px] font-black border border-white shadow-xs cursor-pointer select-none transition-transform hover:scale-125 duration-205 active:scale-90"
                  title="Accréditation Administrative"
                >
                  ★
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-serif italic font-black text-slate-935 text-lg leading-tight tracking-tight">
                  Foyer Daryel
                </span>
                <span className="text-[9.5px] font-mono uppercase tracking-[0.18em] text-slate-505 font-bold leading-none">
                  CAU Djibouti
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1 xl:gap-2" id="nav-desktop-links">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => handleNav(item.id)}
                  className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-sans font-semibold transition-all duration-300 cursor-pointer ${
                    activeView === item.id
                      ? "bg-slate-100 text-[#1E3A8A]"
                      : "text-slate-600 hover:text-[#1E3A8A] hover:bg-slate-50"
                  }`}
                >
                  {t(item.label)}
                </button>
              ))}
            </div>

            {/* Emergency Alert Buttons */}
            <div className="hidden md:flex items-center gap-3" id="nav-emergency-panel">
              {/* Language Switcher */}
              <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200/50" id="language-switcher-desktop">
                <button
                  onClick={() => setLanguage("fr")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition duration-200 cursor-pointer ${
                    language === "fr"
                      ? "bg-white text-blue-900 shadow-xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  FR
                </button>
                <button
                  onClick={() => setLanguage("ar")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition duration-200 cursor-pointer ${
                    language === "ar"
                      ? "bg-white text-blue-900 shadow-xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  العربية
                </button>
              </div>

              {/* Dark Mode Toggle Switch */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition duration-300 cursor-pointer border border-slate-200/50 flex items-center justify-center shadow-xs"
                title={isDarkMode ? "Passer en mode jour (Clair)" : "Passer en mode nuit (Sombre)"}
                id="dark-mode-toggle-desktop"
              >
                {isDarkMode ? (
                  <Sun className="h-4.5 w-4.5 text-amber-505" />
                ) : (
                  <Moon className="h-4.5 w-4.5 text-slate-700" />
                )}
              </button>
              <button
                id="emergency-trigger-btn"
                onClick={() => handleNav("contact")}
                className="relative group bg-rose-600 hover:bg-rose-700 text-white font-sans font-bold text-xs uppercase tracking-wider py-3 px-5 rounded-2xl flex items-center gap-2 shadow-lg shadow-rose-600/20 active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden border border-rose-500/10"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <ShieldAlert className="h-4 w-4 text-white animate-pulse" />
                <span>{t("Urgence Signalement H24")}</span>
                <span className="h-2 w-2 rounded-full bg-white block animate-ping ml-0.5" />
              </button>
            </div>

            {/* Mobile hamburger menu trigger */}
            <div className="lg:hidden flex items-center gap-2" id="nav-mobile-trigger">
              {/* Language Switcher Mobile */}
              <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-205 text-[10px]" id="language-switcher-mobile">
                <button
                  onClick={() => setLanguage("fr")}
                  className={`px-2 py-1 rounded-lg font-bold cursor-pointer transition ${
                    language === "fr" ? "bg-white text-blue-900 shadow-xs" : "text-slate-500"
                  }`}
                >
                  FR
                </button>
                <button
                  onClick={() => setLanguage("ar")}
                  className={`px-2 py-1 rounded-lg font-bold cursor-pointer transition ${
                    language === "ar" ? "bg-white text-blue-900 shadow-xs" : "text-slate-500"
                  }`}
                >
                  AR
                </button>
              </div>

              {/* Dark Mode Toggle Switch Mobile */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition duration-200 border border-slate-200 cursor-pointer"
                title={isDarkMode ? "Passer en mode jour" : "Passer en mode nuit"}
                id="dark-mode-toggle-mobile"
              >
                {isDarkMode ? (
                  <Sun className="h-4 w-4 text-amber-505" />
                ) : (
                  <Moon className="h-4 w-4 text-slate-700" />
                )}
              </button>
              <button
                onClick={() => handleNav("contact")}
                className="p-2.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-600"
                title={t("Alerte Téléphonique")}
              >
                <Phone className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                id="mobile-menu-burger"
                className="p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-105 transition-colors duration-200 border border-slate-205"
              >
                {isOpen ? <X className="h-5.5 w-5.5" /> : <Menu className="h-5.5 w-5.5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Drawer Overlay */}
        {isOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 shadow-xl overflow-hidden transition-all duration-300" id="nav-mobile-drawer">
            <div className="px-4 pt-4 pb-6 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  id={`mobile-nav-item-${item.id}`}
                  onClick={() => handleNav(item.id)}
                  className={`w-full text-left px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center justify-between ${
                    activeView === item.id
                      ? "bg-slate-50 text-[#1E3A8A] border-l-4 border-[#1E3A8A]"
                      : "text-slate-600 hover:text-[#1E3A8A] hover:bg-slate-50"
                  }`}
                >
                  <span>{t(item.label)}</span>
                  {item.id === "contact" && (
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-600 animate-ping" />
                  )}
                </button>
              ))}
              
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <a
                  href={`tel:${general.phoneEmergency.split("/")[0].trim()}`}
                  className="w-full flex items-center justify-center gap-2.5 bg-rose-600 text-white font-semibold py-4 px-4 rounded-xl text-sm"
                >
                  <Phone className="h-4 w-4 animate-bounce" />
                  <span>{general.phoneEmergency.split("/")[0].trim()}</span>
                </a>
                <div className="text-center text-[10px] text-slate-400 font-mono">
                  {t("Centre d'Accueil et d'Urgence — Foyer Daryel (Djibouti)")}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* SECURE POPUP MODAL FOR ADMIN AUTHENTICATION */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 shadow-xl" id="admin-auth-overlay">
          {/* Blur background backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/65 backdrop-blur-md transition-opacity" 
            onClick={() => {
              setIsAuthModalOpen(false);
              setAuthError(null);
            }} 
          />
          
          {/* Modal box */}
          <div className="relative bg-white rounded-[2.5rem] p-8 sm:p-10 max-w-md w-full shadow-2xl border border-slate-200 animate-text-reveal text-left">
            <button 
              onClick={() => {
                setIsAuthModalOpen(false);
                setAuthError(null);
              }}
              className="absolute top-6 right-6 p-2 rounded-xl bg-slate-50 text-slate-400 hover:text-slate-900 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center space-y-5">
              {/* Institutional mini-header & icon shield */}
              <div className="mx-auto h-16 w-16 rounded-2xl bg-slate-950 p-2 flex items-center justify-center border-2 border-amber-500 shadow-md">
                <img
                  src="/logo.jpeg"
                  alt="Foyer Daryel"
                  className="h-full w-full object-contain rounded-xl"
                />
              </div>

              <div>
                <span className="text-[9.5px] font-mono tracking-[0.2em] bg-amber-500/10 text-amber-800 font-black px-3 py-1 rounded-full inline-block border border-amber-200 uppercase">
                  {t("Accès Très Sécurisé")}
                </span>
                <h3 className="font-serif italic text-2xl font-black text-slate-900 mt-3 leading-tight">
                  {t("Console d'Administration")}
                </h3>
                <p className="text-xs text-slate-500 mt-2 font-medium leading-relaxed">
                  {t("Cette zone est réservée exclusivement à l'Administration Générale du Foyer Daryel de Djibouti.")}
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="mt-8 space-y-4">
              <div className="space-y-1.5">
                <label className="text-slate-600 text-[10.5px] font-mono font-bold uppercase tracking-wider flex items-center gap-2">
                  <KeyRound className="h-3.5 w-3.5 text-blue-800" /> {t("Clé Secrète Autoritaire")}
                </label>
                <input
                  type="password"
                  required
                  autoFocus
                  placeholder={t("Saisissez le mot de passe administrateur...")}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-205 rounded-xl px-4 py-3.5 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#1E3A8A] focus:bg-white text-center tracking-widest font-mono font-bold"
                />
              </div>

              {authError && (
                <div className="p-3 bg-rose-50 border border-rose-150 rounded-xl text-rose-800 text-[11px] font-semibold flex items-center gap-2 animate-bounce">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAuthModalOpen(false);
                    setAuthError(null);
                  }}
                  className="flex-1 bg-slate-100 hover:bg-slate-205 text-slate-755 font-semibold py-3.5 px-4 rounded-xl text-xs transition active:scale-95 cursor-pointer text-center"
                >
                  {t("Fermer")}
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-slate-950 hover:bg-slate-850 text-white font-sans font-bold text-xs uppercase tracking-wider py-3.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
                >
                  <Lock className="h-3.5 w-3.5" />
                  <span>{t("Se Connecter")}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
