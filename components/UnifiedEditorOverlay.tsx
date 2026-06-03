"use client";

import React, { useState, useEffect } from "react";
import { useSiteState } from "@/lib/SiteStateContext";
import { X, Check, Trash2, Edit3, Settings, LogOut, Eye, EyeOff } from "lucide-react";

export default function UnifiedEditorOverlay() {
  const {
    isAdminUnlocked,
    setIsAdminUnlocked,
    activeView,
    setActiveView,
    isEditModeActive,
    setIsEditModeActive,
    globalEditor,
    setGlobalEditor,
    registerModification
  } = useSiteState();

  const [textareaValue, setTextareaValue] = useState("");

  // Sync textarea value when a new element is selected for editing
  useEffect(() => {
    if (globalEditor) {
      setTextareaValue(globalEditor.value);
    }
  }, [globalEditor]);

  if (!isAdminUnlocked) return null;

  const handleSave = () => {
    if (globalEditor) {
      const oldValue = globalEditor.value;
      const newValue = textareaValue;
      const editorLabel = globalEditor.label;
      const originalOnSave = globalEditor.onSave;

      if (oldValue !== newValue) {
        registerModification(
          `Texte "${editorLabel}" : "${oldValue.slice(0, 30)}${oldValue.length > 30 ? "..." : ""}" → "${newValue.slice(0, 30)}${newValue.length > 30 ? "..." : ""}"`,
          "text",
          () => originalOnSave(oldValue)
        );
      }

      originalOnSave(newValue);
      setGlobalEditor(null);
    }
  };

  const handleDelete = () => {
    if (globalEditor && globalEditor.onDelete) {
      if (confirm("Êtes-vous sûr de vouloir supprimer cet élément de la liste ?")) {
        globalEditor.onDelete();
        setGlobalEditor(null);
      }
    }
  };

  return (
    <>
      {/* FLOATING ACTION BOTTOM BAR AS SEEN IN THE USER'S PROVIDED SCREENSHOTS */}
      <div 
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[99] max-w-full px-4 text-xs sm:text-sm"
        id="floating-edition-bar-container"
      >
        <div className="bg-[#12AD2B] text-white rounded-full px-6 py-3.5 shadow-2xl border-2 border-white/60 flex flex-wrap items-center justify-center gap-3 sm:gap-5 animate-bounce-slow" id="floating-edition-capsule">
          <div className="flex items-center gap-2 font-semibold">
            {/* Pulsing indicator */}
            <span className="h-2.5 w-2.5 rounded-full bg-white animate-ping shrink-0" />
            <span className="font-sans">
              Mode Édition — Cliquez sur les textes pour modifier
            </span>
          </div>

          <div className="h-4 w-[1px] bg-white/30 hidden sm:block" />

          <div className="flex items-center gap-2">
            {/* Toggle outline guides button */}
            <button
              onClick={() => setIsEditModeActive(!isEditModeActive)}
              className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                isEditModeActive ? "bg-white/20 text-white font-bold" : "bg-transparent text-white/70 hover:text-white"
              }`}
              title={isEditModeActive ? "Désactiver les contours pointillés d'édition" : "Activer les contours pointillés d'édition"}
            >
              {isEditModeActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              <span className="text-[11px] font-mono uppercase">{isEditModeActive ? "Guides Actifs" : "Guides Masqués"}</span>
            </button>

            {/* Admin Console shortcut button */}
            <button
              onClick={() => {
                setActiveView(activeView === "admin" ? "home" : "admin");
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-sans uppercase transition-all duration-200 active:scale-95 flex items-center gap-1.5 ${
                activeView === "admin"
                  ? "bg-white text-[#12AD2B] shadow-inner"
                  : "bg-white/10 hover:bg-white/25 text-white"
              }`}
            >
              <Settings className="h-3.5 w-3.5" />
              <span>{activeView === "admin" ? "Vers le Site" : "Gérer (Console)"}</span>
            </button>

            {/* Logout/Quit button */}
            <button
              onClick={() => {
                setIsAdminUnlocked(false);
                if (activeView === "admin") {
                  setActiveView("home");
                }
              }}
              className="bg-red-600 hover:bg-red-700 text-white font-sans font-bold text-xs uppercase tracking-wide px-3.5 py-1.5 rounded-lg transition active:scale-95 flex items-center gap-1"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Quitter</span>
            </button>
          </div>
        </div>
      </div>

      {/* POPUP MODAL DIALOG OVERLAY FOR IN-PLACE TEXT EDITING */}
      {globalEditor && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" id="inline-editor-popup-modal">
          {/* Blurred backdrop closeable */}
          <div 
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-all"
            onClick={() => setGlobalEditor(null)}
          />

          <div className="relative bg-white rounded-3xl w-full max-w-xl p-6 sm:p-8 shadow-2xl border border-slate-100 animate-fade-in-up text-left">
            <button
              onClick={() => setGlobalEditor(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-50 text-slate-400 hover:text-slate-900 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="p-2 bg-sky-50 rounded-xl text-sky-600 shrink-0">
                  <Edit3 className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-[#00ADEF]">Modification Visuelle Directe</span>
                  <h3 className="font-serif italic font-bold text-slate-900 text-base sm:text-lg leading-tight">
                    {globalEditor.label}
                  </h3>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block font-bold">Contenu textuel éditable</label>
                <textarea
                  value={textareaValue}
                  onChange={(e) => setTextareaValue(e.target.value)}
                  rows={6}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#00ADEF] focus:bg-white text-slate-800 leading-relaxed font-sans"
                  placeholder="Saisissez la valeur de remplacement ici..."
                  autoFocus
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between gap-3">
                <div>
                  {globalEditor.onDelete && (
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-sans font-bold text-xs uppercase tracking-wider py-3 px-5 rounded-xl transition flex items-center justify-center gap-1.5 w-full sm:w-auto"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Effacer / Supprimer</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setGlobalEditor(null)}
                    className="border border-slate-200 hover:bg-slate-55 text-slate-600 font-sans font-bold text-xs uppercase tracking-wider py-3 px-5 rounded-xl transition w-full sm:w-auto text-center"
                  >
                    Annuler
                  </button>

                  <button
                    type="button"
                    onClick={handleSave}
                    className="bg-[#00ADEF] hover:bg-sky-600 text-white font-sans font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-xl transition flex items-center justify-center gap-1.5 shadow-md shadow-sky-500/10 w-full sm:w-auto"
                  >
                    <Check className="h-4 w-4" />
                    <span>Valider les Changements</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
